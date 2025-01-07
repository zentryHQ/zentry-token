import "@nomicfoundation/hardhat-toolbox"

import { HardhatUserConfig } from "hardhat/config"

import "hardhat-deploy"
import "@nomiclabs/hardhat-solhint"
import "hardhat-deploy"
import "solidity-coverage"

import "dotenv/config"

import "@nomicfoundation/hardhat-ignition-ethers"
import "@nomicfoundation/hardhat-verify"

import "./tasks"

// Ethereum
const MAINNET_RPC_URL = process.env.MAINNET_RPC_URL as string
const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL as string

// Base
const BASE_RPC_URL = (process.env.BASE_RPC_URL as string) || "https://mainnet.base.org"
const BASE_SEPOLIA_RPC_URL = (process.env.BASE_SEPOLIA_RPC_URL as string) || "https://sepolia.base.org"

// Blockchain explorers
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY as string
const BASESCAN_API_KEY = process.env.BASESCAN_API_KEY as string

// Private key
const PRIVATE_KEY = process.env.PRIVATE_KEY || ""

const config: HardhatUserConfig = {
	defaultNetwork: "hardhat",
	networks: {
		localhost: {
			url: "http://localhost:8545",
			accounts: [PRIVATE_KEY],
			gasPrice: 1000000000,
		},
		hardhat: {
			// If you want to do some forking, uncomment below lines
			// forking: {
			// 	url: MAINNET_RPC_URL,
			// },
		},
		mainnet: {
			url: MAINNET_RPC_URL || "",
			accounts: [PRIVATE_KEY],
		},
		sepolia: {
			url: SEPOLIA_RPC_URL || "",
			accounts: [PRIVATE_KEY],
		},
		base: {
			url: BASE_RPC_URL,
			accounts: [PRIVATE_KEY],
			gasPrice: 1000000000,
		},
		baseSepolia: {
			url: BASE_SEPOLIA_RPC_URL,
			accounts: [PRIVATE_KEY],
			gasPrice: 1000000000,
		},
	},
	etherscan: {
		// Your API key for Etherscan
		// Obtain one at https://etherscan.io/
		apiKey: {
			// Ethereum
			mainnet: ETHERSCAN_API_KEY,
			sepolia: ETHERSCAN_API_KEY,

			// Base
			base: BASESCAN_API_KEY,
			baseSepolia: BASESCAN_API_KEY,
		},
		customChains: [
			{
				network: "base",
				chainId: 8453,
				urls: {
					apiURL: "https://api.basescan.org/api",
					browserURL: "https://basescan.org",
				},
			},
			{
				network: "baseSepolia",
				chainId: 84532,
				urls: {
					apiURL: "https://api-sepolia.basescan.org/api",
					browserURL: "https://sepolia.basescan.org/",
				},
			},
		],
	},
	solidity: {
		version: "0.8.20",
		settings: {
			viaIR: true,
			optimizer: {
				enabled: true,
				runs: 999999,
			},
		},
	},
	sourcify: {
		enabled: false, // False as Base is not supported
	},
}

export default config
