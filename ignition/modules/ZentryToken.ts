import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import { ethers } from "ethers";

const gfToken = "0xaaef88cea01475125522e117bfe45cf32044e238";
const owner = "0x9DE6DE21007312eeb6CD90500fFECafeC297B70D";
const publicAddressDeployer = "0xAe7Be8c6d00B46CfeC2Fb5744003012612404B9e";
const MINTER_ROLE = ethers.keccak256(ethers.toUtf8Bytes("MINTER_ROLE"));
const DEFAULT_ADMIN_ROLE = ethers.ZeroHash
export default buildModule("ZentryToken", (m) => {
  const zentryToken = m.contract("ZentryToken");

  const migrator = m.contract("Migrator", [gfToken, zentryToken]);

  // grant role mintter
  const grantRole = m.call(zentryToken, "grantRole", [MINTER_ROLE, migrator]);

  // grant role mintter
  m.call(zentryToken, "renounceRole", [DEFAULT_ADMIN_ROLE, publicAddressDeployer], { after: [grantRole] });

  // transfer ownership to multisig
  m.call(migrator, "transferOwnership", [owner]);

  return { migrator, zentryToken };
});
