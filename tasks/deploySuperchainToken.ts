import { task } from "hardhat/config"
import { networks } from "../config"
import OPTIMISM_MINTABLE_ERC20_FACTORY_ABI from "../abi/OptimismMintableERC20Factory.json"

interface DeployL2TokenArgs {
	name: string
	symbol: string
}

task("deployL2Token", "Deploy L2 token")
	.addParam("name", "The name of the token")
	.addParam("symbol", "The symbol of the token")
	.setAction(async ({ name, symbol }: DeployL2TokenArgs, { ethers, network, run }) => {
		const networkName = network.name
		const networkConfig = networks[networkName as keyof typeof networks]

		const [signer] = await ethers.getSigners()
		const OptimismMintableERC20Factory = new ethers.Contract(
			networkConfig.optimismMintableERC20Factory,
			OPTIMISM_MINTABLE_ERC20_FACTORY_ABI,
			signer
		)

		const tx = await OptimismMintableERC20Factory.createOptimismMintableERC20(
			networkConfig.remoteZentryToken,
			name,
			symbol
    )
    console.log(`TX hash: ${tx.hash}`)
    const txResult = await tx.wait()

    const iface = new ethers.Interface(OPTIMISM_MINTABLE_ERC20_FACTORY_ABI)
    const tokenAddress = getTokenAddress(iface, txResult)
    console.log(`Token deployed at ${tokenAddress} on ${networkName}`)
})

function getTokenAddress(factoryInterface: any, txResult: any) {
    const log = factoryInterface.parseLog(txResult.logs[1])
    return log?.args[0]
}
