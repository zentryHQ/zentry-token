import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import { ethers } from "ethers";

const MINTER_ROLE = ethers.keccak256(ethers.toUtf8Bytes("MINTER_ROLE"));
const DEFAULT_ADMIN_ROLE = ethers.ZeroHash;

export default buildModule("ZentryToken", (m) => {
  const signer = m.getAccount(0);

  const zentryToken = m.contract("ZentryToken");

  const migrator = m.contract("Migrator", [m.getParameter("gfToken"), zentryToken]);

  // grant role mintter
  const grantRole = m.call(zentryToken, "grantRole", [MINTER_ROLE, migrator]);

  // renounceRole role mintter
  m.call(zentryToken, "renounceRole", [DEFAULT_ADMIN_ROLE, signer], {
    after: [grantRole],
  });

  // transfer ownership to multisig
  m.call(migrator, "transferOwnership", [m.getParameter("owner")]);

  return { migrator, zentryToken };
});
