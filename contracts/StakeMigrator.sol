// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract StakeMigrator is Ownable {
    constructor(address owner) Ownable(owner) {}

    function stakeMigrate() external onlyOwner {
        //migrate from stake pool to new stake pool
        // for single stake pool, withdraw all and stake to new pool while keeping all shares relatively to the amount they deposited in the old pool (if we decided to migrate for them)
    }
}
