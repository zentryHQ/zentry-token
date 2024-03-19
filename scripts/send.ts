import { ethers } from 'hardhat'

import { EndpointId } from '@layerzerolabs/lz-definitions'
import { Options } from '@layerzerolabs/lz-v2-utilities'

const mumbai = {
    contractAddress: '0x18dA2b9c46374EE3a2fC4d52D2421A680622aa0d',
    eid: EndpointId.POLYGON_V2_TESTNET,
}

const sepolia = {
    contractAddress: '0x176BF52F7c0B0508f5b71306bd8BA2E98992c0D2',
    eid: EndpointId.SEPOLIA_V2_TESTNET,
}

const ftmTestnet = {
    contractAddress: '0x5343646AA34E137937A2E530BA3B642bA807e2d4',
    eid: EndpointId.FANTOM_V2_TESTNET,
}

/******* Adjust Parameters here *************************************************/
const from = sepolia
const to = mumbai
const receiver = ''
const tokensToSend = ethers.utils.parseEther('10')
/****************************************************************************** */

async function main() {
    const ZentOFT = await ethers.getContractFactory('ZentryOFT')

    const signers = await ethers.getSigners()

    const owner = signers.at(0)!

    const oft = ZentOFT.attach(from.contractAddress).connect(owner)

    // Defining extra message execution options for the send operation
    const options = Options.newOptions().addExecutorLzReceiveOption(200000, 0).toHex().toString()
    const sendParam = [to.eid, ethers.utils.zeroPad(receiver, 32), tokensToSend, tokensToSend, options, '0x', '0x']

    // Fetching the native fee for the token send operation
    const [nativeFee] = await oft.quoteSend(sendParam, false)

    // Executing the send operation from myOFTA contract
    await oft.send(sendParam, [nativeFee, 0], owner.address, { value: nativeFee })
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
