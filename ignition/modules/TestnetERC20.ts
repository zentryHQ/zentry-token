import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("TestnetERC20", (m) => {
  const mockToken = m.contract("TestnetERC20", ["Sepolia Zentry", "SepoliaZENT"]);

  return { mockToken };
});
