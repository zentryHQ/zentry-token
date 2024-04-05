import { ethers, ignition } from "hardhat";
import LpMigratorDeployment from "../../ignition/modules/LpMigrator";
import deployParameters from "../../ignition/parameters/chain-1.json";
import { impersonateAccount, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import {
  IERC20,
  IERC20__factory,
  Migrator,
  Migrator__factory,
  LpMigrator,
  IUniswapV2Router01__factory,
  IUniswapV2Router01,
  IUniswapV2Pair,
  IUniswapV2Pair__factory,
  IUniswapV2Factory,
  IUniswapV2Factory__factory,
  ZentryToken,
} from "../../typechain";

const impersonate = async (account: string) => {
  await impersonateAccount(account);
  return await ethers.getSigner(account);
};

describe("LPMigrator", () => {
  // random address with GF
  let whale: any;
  // random address with GF LP
  let whale2: any;

  let migrator: Migrator;
  let zentryToken: ZentryToken;
  let lpMigrator: LpMigrator;

  let gfToken: IERC20;
  let weth: IERC20;
  let uniswapRouter: IUniswapV2Router01;
  let gfLpPair: IUniswapV2Pair;
  let uniswapFactory: IUniswapV2Factory;

  const deployFixture = async () => {
    const res = await ignition.deploy(LpMigratorDeployment, { parameters: deployParameters });
    lpMigrator = res.lpMigrator as unknown as LpMigrator;
    migrator = res.migrator as unknown as Migrator;
    zentryToken = res.zentryToken as unknown as ZentryToken;

    whale = await impersonate("0xd55CAde5F46B3B7E20eC0B30e174FD7013FD6170");
    whale2 = await impersonate("0x1b16CFfD50d110DB633Eeb79a8A69300cE9f5815");
    gfToken = IERC20__factory.connect(deployParameters.ZentryToken.gfToken, whale);

    uniswapRouter = IUniswapV2Router01__factory.connect(deployParameters.LpMigrator.uniswapRouter, whale);

    uniswapFactory = IUniswapV2Factory__factory.connect(await uniswapRouter.factory(), whale);
    const uniGfPairAddress = await uniswapFactory.getPair(gfToken.getAddress(), await uniswapRouter.WETH());
    gfLpPair = IUniswapV2Pair__factory.connect(uniGfPairAddress, whale);
    weth = IERC20__factory.connect(await uniswapRouter.WETH(), whale);

    const [signer] = await ethers.getSigners();
    // migrate gf of whale to zentry
    await signer.sendTransaction({
      to: whale.address,
      value: ethers.parseEther("1"),
    });

    await gfToken.approve(migrator.getAddress(), ethers.MaxUint256);
    await migrator.connect(whale).migrate();

    // for paying gas
    await signer.sendTransaction({
      to: whale2.address,
      value: ethers.parseEther("1"),
    });
  };

  const initZentryPool = async (signer: any, { initETH, initZent }: { initZent: bigint; initETH: bigint }) => {
    // Send some eth to whale
    const [testAccount] = await ethers.getSigners();
    await testAccount.sendTransaction({
      to: whale.address,
      value: initETH.toString(),
    });
    await zentryToken.connect(signer).approve(uniswapRouter.getAddress(), initZent.toString());
    await uniswapRouter
      .connect(signer)
      .addLiquidityETH(
        zentryToken.getAddress(),
        initZent.toString(),
        "0",
        "0",
        signer.address,
        (await ethers.provider.getBlock("latest"))!.timestamp * 2,
        { value: initETH.toString() }
      );
  };

  beforeEach(async () => {
    await loadFixture(deployFixture);
  });

  const getZentLpPair = async () => {
    const zentLpAddress = await uniswapFactory.getPair(zentryToken.getAddress(), await uniswapRouter.WETH());
    return IUniswapV2Pair__factory.connect(zentLpAddress, whale);
  };

  it("migrate", async () => {
    const [reserveGF, reserveETH] = await gfLpPair.getReserves();
    // assume initial ratio of zent/eth pool is equal to gf/eth pool
    const initZent = reserveGF / BigInt(10);
    const initETH = reserveETH / BigInt(100);

    await initZentryPool(whale, { initETH, initZent });
    const zentLpPair = await getZentLpPair();
    const wethBalBefore = await weth.balanceOf(whale2.address);
    const zentBalBefore = await zentryToken.balanceOf(whale2.address);

    const gfLpBalBefore = await gfLpPair.balanceOf(whale2.address);
    await gfLpPair.connect(whale2).approve(lpMigrator.target, gfLpBalBefore);
    await lpMigrator
      .connect(whale2)
      .migrate(gfLpBalBefore, "0", "0", whale2.address, (await ethers.provider.getBlock("latest"))!.timestamp * 2);

    const gfLPBalAfter = await gfLpPair.balanceOf(whale2.address);
    const zentLpBalAfter = await zentLpPair.balanceOf(whale2.address);
    const zentBalAfter = await zentryToken.balanceOf(whale2.address);
    const wethBalAfter = await weth.balanceOf(whale2.address);

    console.log("Zent Lp after: ", zentLpBalAfter.toString());
    console.log("WETH balance before: ", wethBalBefore.toString());
    console.log("WETH balance after: ", wethBalAfter.toString());
    console.log("Zent balance before: ", zentBalBefore.toString());
    console.log("Zent balance after: ", zentBalAfter.toString());

    expect(gfLPBalAfter).to.equal(BigInt(0));
    expect(zentLpBalAfter > 0).to.be.true;
    expect(await zentryToken.balanceOf(lpMigrator.getAddress())).to.equal(BigInt(0));
    expect(await weth.balanceOf(lpMigrator.getAddress())).to.equal(BigInt(0));
  });

  it("migrate when there is a price difference between two pools", async () => {
    const [reserveGF, reserveETH] = await gfLpPair.getReserves();

    // assume initial ratio of zent/eth pool is slightly less than gf/eth pool
    const initZent = (reserveGF - BigInt(ethers.parseEther("10000"))) / BigInt(10);
    const initETH = reserveETH / BigInt(100);

    await initZentryPool(whale, { initETH, initZent });
    const zentLpPair = await getZentLpPair();

    const gfLpBalBefore = await gfLpPair.balanceOf(whale2.address);
    const zentBalBefore = await zentryToken.balanceOf(whale2.address);
    const wethBalBefore = await weth.balanceOf(whale2.address);

    await gfLpPair.connect(whale2).approve(lpMigrator.target, gfLpBalBefore);
    await lpMigrator
      .connect(whale2)
      .migrate(gfLpBalBefore, "0", "0", whale2.address, (await ethers.provider.getBlock("latest"))!.timestamp * 2);

    const gfLPBalAfter = await gfLpPair.balanceOf(whale2.address);
    const zentLpBalAfter = await zentLpPair.balanceOf(whale2.address);
    const zentBalAfter = await zentryToken.balanceOf(whale2.address);
    const wethBalAfter = await weth.balanceOf(whale2.address);

    console.log("Zent Lp after: ", zentLpBalAfter.toString());
    console.log("WETH balance before: ", wethBalBefore.toString());
    console.log("WETH balance after: ", wethBalAfter.toString());
    console.log("Zent balance before: ", zentBalBefore.toString());
    console.log("Zent balance after: ", zentBalAfter.toString());

    expect(gfLPBalAfter).to.equal(BigInt(0));
    expect(zentLpBalAfter > 0).to.be.true;
    expect(await zentryToken.balanceOf(lpMigrator.getAddress())).to.equal(BigInt(0));
    expect(await weth.balanceOf(lpMigrator.getAddress())).to.equal(BigInt(0));
  });
});
