// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "./interfaces/IUniswapV2Pair.sol";
import "./interfaces/IUniswapV2Router01.sol";
import "./interfaces/IUniswapV2Factory.sol";
import "./interfaces/IGFMigrator.sol";

contract LpMigrator {
    using SafeERC20 for IERC20;

    IUniswapV2Router01 public immutable router;
    IERC20 public immutable gfToken;
    IERC20 public immutable zentryToken;
    IERC20 public immutable weth;
    IGFMigrator public immutable gfMigrator;

    IUniswapV2Pair immutable gfPair;

    /**
     * Note that we approve the gfMigrator to spend gfToken and the router to spend zentryToken, weth and gfPair
     * which is ok since this contract is not supposed to hold any gfToken except during migration
     */
    constructor(address _router, address _gfToken, address _zentryToken, address _gfMigrator) {
        router = IUniswapV2Router01(_router);
        gfToken = IERC20(_gfToken);
        zentryToken = IERC20(_zentryToken);
        weth = IERC20(router.WETH());
        gfMigrator = IGFMigrator(_gfMigrator);

        gfPair = IUniswapV2Pair(IUniswapV2Factory(router.factory()).getPair(address(gfToken), address(weth)));

        gfToken.approve(address(gfMigrator), type(uint256).max);
        zentryToken.approve(address(router), type(uint256).max);
        weth.approve(address(router), type(uint256).max);
        gfPair.approve(address(router), type(uint256).max);
    }

    function migrate(
        uint256 liquidityToMigrate,
        uint256 amountZentMin,
        uint256 amountETHMin,
        address to,
        uint256 deadline
    ) external {
        gfPair.transferFrom(msg.sender, address(this), liquidityToMigrate);
        (, uint256 amountETHOut) =
            router.removeLiquidity(address(gfToken), address(weth), liquidityToMigrate, 1, 1, address(this), deadline);

        uint256 zentryBalBefore = zentryToken.balanceOf(address(this));
        gfMigrator.migrate();
        uint256 amountZent = zentryToken.balanceOf(address(this)) - zentryBalBefore;

        (uint256 amountZentIn, uint256 amountETHIn,) = router.addLiquidity(
            address(zentryToken), address(weth), amountZent, amountETHOut, amountZentMin, amountETHMin, to, deadline
        );

        if (amountZent > amountZentIn) {
            zentryToken.approve(address(router), 0);
            zentryToken.safeTransfer(msg.sender, amountZent - amountZentIn);
        } else if (amountETHOut > amountETHIn) {
            weth.approve(address(router), 0);
            weth.safeTransfer(msg.sender, amountETHOut - amountETHIn);
        }
    }
}
