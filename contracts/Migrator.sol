// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./ZentryToken.sol";

contract Migrator is Ownable {
    IERC20 public immutable gfToken;
    ZentryToken public zentryToken;
    uint256 public immutable MIGRATE_RATE = 10;
    bool public migrationEnabled = false;

    event Migrated(address indexed migrant, uint256 indexed destinationAmount);

    constructor(address _gfToken, address _zentryToken) Ownable(msg.sender) {
        gfToken = IERC20(_gfToken);
        zentryToken = ZentryToken(_zentryToken);
    }

    modifier migrationEnabledOnly() {
        require(migrationEnabled, "Migration is currently disabled");
        _;
    }

    function enableMigration() external onlyOwner {
        migrationEnabled = true;
    }

    function disableMigration() external onlyOwner {
        migrationEnabled = false;
    }

    function migrate() external migrationEnabledOnly {
        uint256 _gfAmount = gfToken.balanceOf(msg.sender);
        uint256 _destinationAmount = _gfAmount * MIGRATE_RATE;
        gfToken.transferFrom(msg.sender, address(this), _gfAmount);
        zentryToken.mint(msg.sender, _destinationAmount);
        emit Migrated(msg.sender, _destinationAmount);
    }
}
