import { loadFixture } from '@nomicfoundation/hardhat-network-helpers'
import { expect } from 'chai'
import { ContractFactory } from 'ethers'
import { deployments, ethers } from 'hardhat'

import { Options } from '@layerzerolabs/lz-v2-utilities'

describe('ZentryOFT Test', function () {
    // Constant representing a mock Endpoint ID for testing purposes
    const eidA = 1
    const eidB = 2

    const deployFixture = async () => {
        const signers = await ethers.getSigners()
        const ownerA = signers[1]
        const ownerB = signers[2]
        const endpointOwner = signers[3]

        const ERC20Mock = await ethers.getContractFactory('ERC20Mock')
        const OFT = await ethers.getContractFactory('ZentryOFT')
        const OFTAdapter = await ethers.getContractFactory('ZentryOFTAdapter')
        const EndpointV2MockArtifact = await deployments.getArtifact('EndpointV2Mock')
        const EndpointV2Mock = new ContractFactory(
            EndpointV2MockArtifact.abi,
            EndpointV2MockArtifact.bytecode,
            endpointOwner
        )

        // Deploying a mock LZEndpoint with the given Endpoint ID
        const mockEndpointV2A = await EndpointV2Mock.deploy(eidA)
        const mockEndpointV2B = await EndpointV2Mock.deploy(eidB)

        // Deploy ZentryToken
        const zentryTokenA = await ERC20Mock.deploy('Zentry Token', 'ZENT')
        const zentryAdapterA = await OFTAdapter.deploy(zentryTokenA.address, mockEndpointV2A.address, ownerA.address)
        const zentryOFTB = await OFT.deploy(mockEndpointV2B.address, ownerB.address)

        // Setting destination endpoints in the LZEndpoint mock for each MyOFT instance
        await mockEndpointV2A.setDestLzEndpoint(zentryOFTB.address, mockEndpointV2B.address)
        await mockEndpointV2B.setDestLzEndpoint(zentryAdapterA.address, mockEndpointV2A.address)

        // Setting each MyOFT instance as a peer of the other in the mock LZEndpoint
        await zentryAdapterA.connect(ownerA).setPeer(eidB, ethers.utils.zeroPad(zentryOFTB.address, 32))
        await zentryOFTB.connect(ownerB).setPeer(eidA, ethers.utils.zeroPad(zentryAdapterA.address, 32))

        return {
            ownerA,
            ownerB,
            zentryTokenA,
            zentryAdapterA,
            zentryOFTB,
        }
    }

    // A test case to verify token transfer functionality
    it('should send a token from A address to B address via each OFT', async function () {
        const { ownerA, ownerB, zentryTokenA, zentryAdapterA, zentryOFTB } = await loadFixture(deployFixture)
        // Minting an initial amount of tokens to ownerA's address in the ZentryToken contract
        const initialAmount = ethers.utils.parseEther('100')
        await zentryTokenA.mint(ownerA.address, initialAmount)

        // Defining the amount of tokens to send and constructing the parameters for the send operation
        const tokensToSend = ethers.utils.parseEther('1')

        // Defining extra message execution options for the send operation
        const options = Options.newOptions().addExecutorLzReceiveOption(200000, 0).toHex().toString()
        const sendParam = [
            eidB,
            ethers.utils.zeroPad(ownerB.address, 32),
            tokensToSend,
            tokensToSend,
            options,
            '0x',
            '0x',
        ]

        // Approve the ZentryOFTAdapter to spend the tokens
        await zentryTokenA.connect(ownerA).approve(zentryAdapterA.address, ethers.constants.MaxUint256)

        // Fetching the native fee for the token send operation
        const [nativeFee] = await zentryAdapterA.quoteSend(sendParam, false)

        // Executing the send operation from myOFTA contract
        await zentryAdapterA.connect(ownerA).send(sendParam, [nativeFee, 0], ownerA.address, { value: nativeFee })

        // Fetching the final token balances of ownerA and ownerB
        const finalBalanceA = await zentryTokenA.balanceOf(ownerA.address)
        const finalAdapterBalanceA = await zentryTokenA.balanceOf(zentryAdapterA.address)
        const finalBalanceB = await zentryOFTB.balanceOf(ownerB.address)

        // tokens should be locked in zentryAdapterA
        expect(finalAdapterBalanceA.eq(tokensToSend)).to.be.true

        // ownerA should have less tokens
        expect(finalBalanceA.eq(initialAmount.sub(tokensToSend))).to.be.true
        expect(finalBalanceB.eq(tokensToSend)).to.be.true
    })
})
