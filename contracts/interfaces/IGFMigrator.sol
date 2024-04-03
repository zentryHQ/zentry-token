// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IGFMigrator {

  function MIGRATE_RATE() external view returns (uint256);

  function migrate() external;
}

