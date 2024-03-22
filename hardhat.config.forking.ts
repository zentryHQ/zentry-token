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
  solidity: '0.8.20',
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
      blockNumber: 19408785,
      forking: {
        url: process.env.MAINNET_FORK_RPC_URL || '',
      },
    },
  },
};
