import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import { ethers } from "ethers";

export const gfTokenAddress = "0xaaef88cea01475125522e117bfe45cf32044e238";
export const wethAddress = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
export const zentryTokenAddress = "0xdBB7a34Bf10169d6d2D0d02A6cbb436cF4381BFa";
export const owner = "0x9DE6DE21007312eeb6CD90500fFECafeC297B70D";
export const gfMigratorAddress = "0x9f28c9C2dA4A833cbFaAacbf7eB62267334d7149";
export const uniswapRouterAddress = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";
export const uniGfPairAddress = "0x2f0B1417aA42ebf0B4ca1154212847f6094D708D";

export default buildModule("LpMigrator", (m) => {
  const signer = m.getAccount(0);

  const lpMigrator = m.contract("LpMigrator", [
    uniswapRouterAddress,
    gfTokenAddress,
    zentryTokenAddress,
    gfMigratorAddress,
  ]);

  return { lpMigrator };
});
