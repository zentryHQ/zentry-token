// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./ZentryToken.sol";

contract Migrator {
    IERC20 public immutable source;
    ZentryToken public immutable destination;
    uint256 public immutable MIGRATE_RATE = 10;

    event Migrated(address indexed migrant, uint256 indexed destinationAmount);

    constructor(address _source, address _destination) {
        source = IERC20(_source);
        destination = ZentryToken(_destination);
    }

    function migrate() external {
        uint256 _sourceAmount = source.balanceOf(msg.sender);
        uint256 _destinationAmount = _sourceAmount * MIGRATE_RATE;
        require(
            source.allowance(msg.sender, address(this)) >= _sourceAmount,
            "Insufficient allowance"
        );
        source.transferFrom(msg.sender, address(0), _sourceAmount);
        destination.mint(msg.sender, _destinationAmount);
        emit Migrated(msg.sender, _destinationAmount);
    }
}
