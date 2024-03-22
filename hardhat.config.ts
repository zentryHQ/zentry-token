import { config as dotEnvConfig } from "dotenv";
dotEnvConfig();

// hardhat.config.js
import "@nomicfoundation/hardhat-ignition-ethers";
import "@nomicfoundation/hardhat-verify";
import "hardhat-gas-reporter"

/**
 * @type import('hardhat/config').HardhatUserConfig
 */


module.exports = {
  solidity: "0.8.20",
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
  settings: {
    optimizer: {
      enabled: true,
      runs: 1000,
    },
  },
  networks: {
    hardhat: {
      forking: {
        url: process.env.MAINNET_FORK_RPC_URL || "",
        // blockNumber: process.env.MAINNET_FORK_BLOCK_NUMBER || '',
      },
      accounts: { privateKey: process.env.ETH_MAINNET_PRIVATE_KEY },
    },
    localhost: {
      url: "http://localhost:8545",
    },
    mainnet: {
      url: process.env.ETH_MAINNET_RPC_URL || "",
      accounts: [process.env.ETH_MAINNET_PRIVATE_KEY].filter(Boolean),
      etherscan: {
        apiKey: process.env.ETHERSCAN_API_KEY,
      },
    },
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL || "",
      accounts: [process.env.SEPOLIA_PRIVATE_KEY].filter(Boolean),
    },
  },
};
