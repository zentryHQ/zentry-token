import { network, ethers } from "hardhat";

export const impersonate = async (account: string) => {
  await network.provider.send("hardhat_impersonateAccount", [account]);
  return await ethers.getSigner(account);
};
