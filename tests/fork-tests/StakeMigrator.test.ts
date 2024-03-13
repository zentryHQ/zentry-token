import _ from "lodash";
import { ethers, ignition, network } from "hardhat";
import ZentryTokenModule from "../../ignition/modules/ZentryToken";
import { gfTokenAddress, owner, MINTER_ROLE, DEFAULT_ADMIN_ROLE } from "../../ignition/modules/ZentryToken";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import data from "../../scripts/xGF-stakers.json";

const impersonate = async (account: string) => {
  await network.provider.send("hardhat_impersonateAccount", [account]);
  return await ethers.getSigner(account);
};

describe("StakeMigrator", () => {
  async function deployTokenFixture() {
    const [deployer] = await ethers.getSigners();
    const stakingMigrator = await ethers.deployContract("StakeMigrator", [deployer.address]);
    await stakingMigrator.waitForDeployment();

    return { stakingMigrator, deployer };
  }

  it("set migrate", async () => {
    const { stakingMigrator } = await loadFixture(deployTokenFixture);

    console.log("Migrating data...", data.length);
    const size = 500;
    const chunks = _.chunk(data, size);

    for (let i = 0; i < chunks.length; i++) {
      console.log(`Migrating chunk ${i + 1}/${chunks.length}`);
      const chunk = chunks[i];
      if (chunk.length < size) {
        console.log(`skipping chunk ${i + 1}/${chunks.length}`);
        continue;
      }
      const users = chunk.map((item) => item.stakerAddress);
      const amounts = chunk.map((item) => item.lockBalance);

      await stakingMigrator.stakeMigrate(users, amounts);
    }
  });
});
