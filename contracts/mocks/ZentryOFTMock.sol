// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import {ZentryOFT} from "../ZentryOFT.sol";

// @dev WARNING: This is for testing purposes only
contract ZentryTokenMock is ZentryOFT {
    constructor(address _lzEndpoint, address _delegate) ZentryOFT(_lzEndpoint, _delegate) {}

    function mint(address _to, uint256 _amount) public {
        _mint(_to, _amount);
    }
}