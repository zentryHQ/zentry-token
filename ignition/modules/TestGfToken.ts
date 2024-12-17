import { buildModule } from "@nomicfoundation/hardhat-ignition/modules"

export default buildModule("TestGfToken", (m) => {
	const mockToken = m.contract("TestGfToken", [])

	return { mockToken }
})
