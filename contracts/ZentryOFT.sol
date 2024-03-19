// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import {ERC20Burnable} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import {ERC20Permit} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import {OFT} from "@layerzerolabs/lz-evm-oapp-v2/contracts/oft/OFT.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract ZentryTokenOFT is OFT, ERC20Burnable, ERC20Permit {
    constructor(address _lzEndpoint, address _delegate)
        OFT("ZentryToken", "ZENT", _lzEndpoint, _delegate)
        ERC20Permit("Zentry")
        Ownable(_delegate)
    {}
}
