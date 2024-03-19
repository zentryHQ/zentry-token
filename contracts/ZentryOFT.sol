// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import {OFT} from "@layerzerolabs/lz-evm-oapp-v2/contracts/oft/OFT.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract ZentryOFT is OFT {
    constructor(address _lzEndpoint, address _delegate)
        OFT("ZentryToken", "ZENT", _lzEndpoint, _delegate)
        Ownable(_delegate)
    {}
}
