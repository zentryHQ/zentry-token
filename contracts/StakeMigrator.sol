// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract StakeMigrator is Ownable {
    mapping(address => uint256) public balances;

    constructor(address owner) Ownable(owner) {}

    function stakeMigrate(address[] calldata _users, uint256[] calldata _balances) external onlyOwner {
        //migrate from stake pool to new stake pool
        // for single stake pool, withdraw all and stake to new pool while keeping all shares relatively to the amount they deposited in the old pool (if we decided to migrate for them)
        require(_users.length == _balances.length, "StakingV3: invalid input");

        for (uint256 i = 0; i < _users.length; i++) {
            balances[_users[i]] = _balances[i];
        }
    }
}
