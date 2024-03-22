import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import { ethers } from "ethers";

export const gfTokenAddress = "0xaaef88cea01475125522e117bfe45cf32044e238";
export const owner = "0x9DE6DE21007312eeb6CD90500fFECafeC297B70D";
export const MINTER_ROLE = ethers.keccak256(ethers.toUtf8Bytes("MINTER_ROLE"));
export const DEFAULT_ADMIN_ROLE = ethers.ZeroHash;

export default buildModule("ZentryToken", (m) => {
  const signer = m.getAccount(0);

  const zentryToken = m.contract("ZentryToken");

  const migrator = m.contract("Migrator", [gfTokenAddress, zentryToken]);

  // grant role mintter
  const grantRole = m.call(zentryToken, "grantRole", [MINTER_ROLE, migrator]);

  // renounceRole role mintter
  m.call(zentryToken, "renounceRole", [DEFAULT_ADMIN_ROLE, signer], {
    after: [grantRole],
  });

  // transfer ownership to multisig
  m.call(migrator, "transferOwnership", [owner]);

  return { migrator, zentryToken };
});
