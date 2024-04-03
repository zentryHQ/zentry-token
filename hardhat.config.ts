import { config as dotEnvConfig } from "dotenv";
dotEnvConfig();

// hardhat.config.js
import "@typechain/hardhat";
import "@nomicfoundation/hardhat-ignition-ethers";
import "@nomicfoundation/hardhat-verify";
import "hardhat-gas-reporter";

/** @type import('hardhat/config').HardhatUserConfig */
export default {
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
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
  networks: {
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
  typechain: {
    outDir: "./typechain",
    target: "ethers-v6",
  },
};
