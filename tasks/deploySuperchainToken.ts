import { task } from "hardhat/config"
import { networks, tokens } from "../config"
import { ethers, EventLog, Log } from "ethers"
import {} from "ethers"
import OPTIMISM_MINTABLE_ERC20_FACTORY_ABI from "../abi/OptimismMintableERC20Factory.json"

interface DeploySuperchainTokenArgs {
	name: string
	symbol: string
}

task("deploySuperchainToken", "Deploy Superchain token")
	.addParam("name", "The name of the token")
	.addParam("symbol", "The symbol of the token")
	.setAction(async ({ name, symbol }: DeploySuperchainTokenArgs, { ethers, network }) => {
		const networkName = network.name
		const networkConfig = networks[networkName as keyof typeof networks]

		const [signer] = await ethers.getSigners()
		const OptimismMintableERC20Factory = new ethers.Contract(
			networkConfig.optimismMintableERC20Factory,
			OPTIMISM_MINTABLE_ERC20_FACTORY_ABI,
			signer
		)

		console.log("Account balance:", ethers.formatUnits(await ethers.provider.getBalance(signer.address), 18))
		const remoteToken = tokens[`${symbol}` as keyof typeof tokens]

		if (!remoteToken) {
			throw new Error(`Remote token not found for ${name}`)
		}

		const tx = await OptimismMintableERC20Factory.createOptimismMintableERC20(remoteToken, name, symbol)
		console.log(`Transaction hash: ${tx.hash}`)
		const receipt: ethers.ContractTransactionReceipt = await tx.wait()

		const event = receipt.logs?.find(
			(e: Log | EventLog) => e instanceof EventLog && e.eventName === "OptimismMintableERC20Created"
		)

		if (!event) {
			throw new Error("Unable to find OptimismMintableERC20Created event")
		}

		const tokenAddress = (event as EventLog).args.localToken
		console.log(`Deployed token: ${name} (${symbol}) at ${tokenAddress}`)
	})
