import { ethers } from 'hardhat'

import { EndpointId } from '@layerzerolabs/lz-definitions'
import { Options } from '@layerzerolabs/lz-v2-utilities'

const sepolia = {
    eid: EndpointId.SEPOLIA_V2_TESTNET,
    contractAddress: '0xBF8228aeb591bF86786746D433FecC03EC18bd83',
}

const baseSepolia = {
    eid: EndpointId.BASESEP_V2_TESTNET,
    contractAddress: '0xe9F8bd6E887b21F2Ce6d841dd61fa43455733B4e',
}

const blastTestnet = {
    eid: EndpointId.BLAST_V2_TESTNET,
    contractAddress: '0xe9F8bd6E887b21F2Ce6d841dd61fa43455733B4e',
}

const arbSepolia = {
    eid: EndpointId.ARBSEP_V2_TESTNET,
    contractAddress: '0xe9F8bd6E887b21F2Ce6d841dd61fa43455733B4e',
}
/******* Adjust Parameters here *************************************************/
const from = arbSepolia
const to = sepolia
const receiver = '0x86d00B700E302Ee2EB687bAdEd855223Db888B58'
const tokensToSend = ethers.utils.parseEther('100000')
/****************************************************************************** */

async function main() {
    console.log(`Sending ${ethers.utils.formatEther(tokensToSend)} tokens `)
    const ZentOFT = await ethers.getContractFactory('ZentryOFT')

    const signers = await ethers.getSigners()

    const owner = signers.at(0)!

    const oft = ZentOFT.attach(from.contractAddress).connect(owner)

    // Defining extra message execution options for the send operation
    const options = Options.newOptions().addExecutorLzReceiveOption(100000, 0).toHex().toString()
    const sendParam = [to.eid, ethers.utils.zeroPad(receiver, 32), tokensToSend, tokensToSend, options, '0x', '0x']

    // Fetching the native fee for the token send operation
    const [nativeFee] = await oft.quoteSend(sendParam, false)

    console.log(`Native Fee: ${ethers.utils.formatEther(nativeFee)}`)

    // Executing the send operation from myOFTA contract
    const tx = await oft.send(sendParam, [nativeFee, 0], owner.address, { value: nativeFee })
    const response = await tx.wait(1)
    console.log('✅ Transaction submitted')
    console.log(response)
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
