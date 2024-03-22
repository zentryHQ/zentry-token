import { ethers, ignition, network } from 'hardhat';
import ZentryTokenModule from '../../ignition/modules/ZentryToken';
import {
  gfTokenAddress,
  owner,
  MINTER_ROLE,
  DEFAULT_ADMIN_ROLE,
} from '../../ignition/modules/ZentryToken';
import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { expect } from 'chai';

const impersonate = async (account: string) => {
  await network.provider.send('hardhat_impersonateAccount', [account]);
  return await ethers.getSigner(account);
};

describe('ZentryToken', () => {
  async function deployTokenFixture() {
    const { zentryToken, migrator } = await ignition.deploy(ZentryTokenModule);

    return { zentryToken, migrator };
  }

  it('set deployed parameter correctly', async () => {
    const { zentryToken, migrator } = await loadFixture(deployTokenFixture);

    expect((await migrator.gfToken()).toLowerCase()).to.equal(gfTokenAddress);
    expect((await migrator.zentryToken()).toLowerCase()).to.equal(
      (zentryToken.target as string).toLowerCase(),
    );
    expect(await migrator.migrationEnabled()).to.equal(true);
  });

  it('grant MINT_ROLE to migrator', async () => {
    const { zentryToken, migrator } = await loadFixture(deployTokenFixture);

    expect(await zentryToken.hasRole(MINTER_ROLE, migrator.target)).to.equal(
      true,
    );
  });

  it('renounce ZentryToken ADMIN_ROLE from deployer', async () => {
    const { zentryToken } = await loadFixture(deployTokenFixture);
    const [deployer] = await ethers.getSigners();

    expect(
      await zentryToken.hasRole(DEFAULT_ADMIN_ROLE, deployer.address),
    ).to.equal(false);
  });

  it('transfer Migrator ownership to owner', async () => {
    const { migrator } = await loadFixture(deployTokenFixture);
    expect((await migrator.owner()).toLowerCase()).to.equal(
      owner.toLowerCase(),
    );
  });

  it('should migrate GF to ZentryToken', async () => {
    const { zentryToken, migrator } = await loadFixture(deployTokenFixture);
    const whale = await impersonate(
      '0xd55CAde5F46B3B7E20eC0B30e174FD7013FD6170',
    );

    // Send some eth to whale
    await (
      await ethers.getSigners()
    )[0].sendTransaction({
      to: whale.address,
      value: ethers.parseEther('5'),
    });

    const gfToken = await ethers.getContractAt('IERC20', gfTokenAddress, whale);

    const gfBalanceBefore = await gfToken.balanceOf(whale.address);
    const zentryBalanceBefore = await zentryToken.balanceOf(whale.address);
    console.log(
      'GF Balance Before ',
      ethers.formatEther(gfBalanceBefore.toString()).toString(),
    );
    console.log(
      'ZentryToken Before ',
      ethers.formatEther(zentryBalanceBefore.toString()).toString(),
    );
    expect(zentryBalanceBefore).to.equal(ethers.toBigInt(0));

    await gfToken.approve(migrator.target, ethers.MaxUint256);
    const migratorAsWhale = migrator.connect(whale);

    await (migratorAsWhale as any).migrate();

    const gfBalanceAfter = await gfToken.balanceOf(whale.address);
    const zentryBalanceAfter = await zentryToken.balanceOf(whale.address);
    console.log(
      'GF Balance After ',
      ethers.formatEther(gfBalanceAfter.toString()).toString(),
    );
    console.log(
      'ZentryToken After ',
      ethers.formatEther(zentryBalanceAfter.toString()).toString(),
    );

    const rate = await migrator.MIGRATE_RATE();
    expect(zentryBalanceAfter).to.equal(gfBalanceBefore * rate);
    expect(gfBalanceAfter).to.equal(ethers.toBigInt(0));
  });
});
