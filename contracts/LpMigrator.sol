// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;


import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "./interfaces/IUniswapV2Pair.sol";
import './interfaces/IUniswapV2Router01.sol';
import "./interfaces/IUniswapV2Factory.sol";
import './interfaces/IGFMigrator.sol';

contract LpMigrator {
    using SafeERC20 for IERC20;

    IUniswapV2Router01 public immutable router;
    IERC20 public immutable gfToken;
    IERC20 public immutable zentryToken;
    IERC20 public immutable weth;
    IGFMigrator public immutable gfMigrator;

    IUniswapV2Pair immutable gfPair;

    /**
     * Note that we approve the gfMigrator to spend max gfToken from this contract 
     * which is ok since this contract is not supposed to hold any gfToken except during migration 
     */
    constructor(address _router, address _gfToken, address _zentryToken, address _gfMigrator) {
        router = IUniswapV2Router01(_router);
        gfToken = IERC20(_gfToken);
        zentryToken = IERC20(_zentryToken);
        weth = IERC20(router.WETH());
        gfMigrator = IGFMigrator(_gfMigrator);

        gfToken.approve(address(gfMigrator), type(uint256).max);

        gfPair = IUniswapV2Pair(IUniswapV2Factory(router.factory()).getPair(address(gfToken),address(weth)));
    }

    function migrate(uint256 liquidityToMigrate, uint amountZentMin, uint amountETHMin, address to, uint deadline)
        external
    {
     gfPair.transferFrom(msg.sender, address(this), liquidityToMigrate);
     gfPair.approve(address(router), liquidityToMigrate);
     (, uint amountETHOut) = router.removeLiquidity(
        address(gfToken),
        address(weth),
        liquidityToMigrate,
        1,
        1,
        address(this),
        deadline
     );

    uint256 zentryBalBefore = zentryToken.balanceOf(address(this));
    gfMigrator.migrate();
    uint256 amountZent = zentryToken.balanceOf(address(this)) - zentryBalBefore;
    
    zentryToken.approve(address(router), amountZent);
    weth.approve(address(router), amountETHOut);
    (uint amountZentIn, uint amountETHIn,) = router.addLiquidity(
        address(zentryToken),
        address(weth),
        amountZent,
        amountETHOut,
        amountZentMin,
        amountETHMin,
        to,
        deadline
    );

    if (amountZent > amountZentIn) {
        zentryToken.approve(address(router), 0);
        zentryToken.safeTransfer(msg.sender, amountZent - amountZentIn);
    } else if (
        amountETHOut > amountETHIn
    ) {
        weth.approve(address(router), 0);
        weth.safeTransfer(msg.sender, amountETHOut - amountETHIn);
    }
    }
}