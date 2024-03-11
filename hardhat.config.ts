// hardhat.config.js
import '@nomicfoundation/hardhat-ignition-ethers';

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: '0.8.20',
  networks: {
    localhost: {
      url: 'http://localhost:8545',
    },
  },
};
