import { config as dotEnvConfig } from "dotenv";
dotEnvConfig();

// hardhat.config.js
import "@nomicfoundation/hardhat-ignition-ethers";
import "hardhat-gas-reporter";

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    hardhat: {
      blockNumber: 19423123,
      forking: {
        url: process.env.MAINNET_FORK_RPC_URL || "",
      },
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
  },
  mocha: {
    timeout: 2000000,
  },
  gasReporter: {
    enabled: true,
  },
};
