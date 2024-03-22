import { config as dotEnvConfig } from 'dotenv';
dotEnvConfig();

// hardhat.config.js
import '@nomicfoundation/hardhat-ignition-ethers';
import "@nomicfoundation/hardhat-verify";
import "hardhat-gas-reporter"

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: {
    version: '0.8.20',
    settings: {
      viaIR: true,
      optimizer: {
        enabled: true,
        runs: 10000,
      },
    },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
  gasReporter: {
    enabled: true,
    L1: 'ethereum',
    L1Etherscan: process.env.ETHERSCAN_API_KEY,
    reportPureAndViewMethods: true,
    coinmarketcap: 'a6c9f552-88c8-4c29-80c1-bc62b7b0495c',
    darkMode: true,
    includeIntrinsicGas: true,
  },
  networks: {
    hardhat: {
      blockNumber: 19408785,
      forking: {
        url: process.env.MAINNET_FORK_RPC_URL || '',
      },
    },
  },
};
