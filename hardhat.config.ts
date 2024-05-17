// Get the environment configuration from .env file
//
// To make use of automatic environment setup:
// - Duplicate .env.example file and name it .env
// - Fill in the environment variables
import 'dotenv/config'

import 'hardhat-deploy'
import 'hardhat-contract-sizer'
import '@nomiclabs/hardhat-ethers'
import '@layerzerolabs/toolbox-hardhat'
import '@nomicfoundation/hardhat-verify'
import { HardhatUserConfig, HttpNetworkAccountsUserConfig } from 'hardhat/types'

import { EndpointId } from '@layerzerolabs/lz-definitions'

// Set your preferred authentication method
//
// If you prefer using a mnemonic, set a MNEMONIC environment variable
// to a valid mnemonic
const MNEMONIC = process.env.MNEMONIC

// If you prefer to be authenticated using a private key, set a PRIVATE_KEY environment variable
const PRIVATE_KEY = process.env.PRIVATE_KEY

const accounts: HttpNetworkAccountsUserConfig | undefined = MNEMONIC
    ? { mnemonic: MNEMONIC }
    : PRIVATE_KEY
      ? [PRIVATE_KEY]
      : undefined

if (accounts == null) {
    console.warn(
        'Could not find MNEMONIC or PRIVATE_KEY environment variables. It will not be possible to execute transactions in your example.'
    )
}

const config: HardhatUserConfig = {
    solidity: {
        compilers: [
            {
                version: '0.8.20',
                settings: {
                    optimizer: {
                        enabled: true,
                        runs: 200,
                    },
                },
            },
        ],
    },
    networks: {
        sepolia: {
            eid: EndpointId.SEPOLIA_V2_TESTNET,
            url: 'https://rpc.sepolia.org/',
            accounts,
        },
        base: {
            eid: EndpointId.BASE_V2_MAINNET,
            url: 'https://mainnet.base.org',
            accounts,
        },
        base_sepolia: {
            eid: EndpointId.BASESEP_V2_TESTNET,
            url: 'https://sepolia.base.org',
            accounts,
        },
        blast: {
            eid: EndpointId.BLAST_V2_MAINNET,
            url: 'https://rpc.blast.io',
            accounts,
        },
        blast_testnet: {
            eid: EndpointId.BLAST_V2_TESTNET,
            url: 'https://sepolia.blast.io',
            accounts,
        },
        arb: {
            eid: EndpointId.ARBITRUM_V2_MAINNET,
            url: 'https://arb1.arbitrum.io/rpc',
            accounts,
        },
        arb_sepolia: {
            eid: EndpointId.ARBSEP_V2_TESTNET,
            url: 'https://sepolia-rollup.arbitrum.io/rpc',
            accounts,
        },
    },
    namedAccounts: {
        deployer: {
            default: 0, // wallet address of index[0], of the mnemonic in .env
        },
    },
    etherscan: {
        apiKey: {
            mainnet: process.env.MAINNET_ETHERSCAN_API_KEY || '',
            sepolia: process.env.SEPOLIA_ETHERSCAN_API_KEY || '',
            base: process.env.BASE_ETHERSCAN_API_KEY || '',
            baseSepolia: process.env.BASESEP_ETHERSCAN_API_KEY || '',
            arbitrumOne: process.env.ARB_ETHERSCAN_API_KEY || '',
            arbitrumSepolia: process.env.ARBSEP_ETHERSCAN_API_KEY || '',
            blast: process.env.BLAST_ETHERSCAN_API_KEY || '',
            blastSepolia: process.env.BLASTSEP_ETHERSCAN_API_KEY || '',
        },
        customChains: [
            {
                network: 'baseSepolia',
                chainId: 84532,
                urls: {
                    apiURL: 'https://api-sepolia.basescan.org/api',
                    browserURL: 'https://sepolia.basescan.org',
                },
            },
            {
                network: 'blast',
                chainId: 81457,
                urls: {
                    apiURL: 'https://api.blastscan.io/api',
                    browserURL: 'https://blastscan.io',
                },
            },
            {
                network: 'blastSepolia',
                chainId: 168587773,
                urls: {
                    apiURL: 'https://api-sepolia.blastscan.io/api',
                    browserURL: 'https://sepolia.blastscan.io/',
                },
            },
        ],
    },
}

export default config
