import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import ZentryTokenModule from "./ZentryToken";

export default buildModule("LpMigrator", (m) => {
  const { zentryToken, migrator } = m.useModule(ZentryTokenModule);

  const lpMigrator = m.contract("LpMigrator", [
    m.getParameter("uniswapRouter"),
    m.getParameter("gfToken"),
    zentryToken,
    migrator,
  ]);

  return { lpMigrator, zentryToken, migrator };
});
