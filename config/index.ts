const tokens = {
	stZENT: "0x996d67aa9b37df96428ad3608cb21352bf1fdb90",
	ZENT: "0xdBB7a34Bf10169d6d2D0d02A6cbb436cF4381BFa",
}

const networks = {
	mainnet: {
		optimismMintableERC20Factory: "0x05cc379EBD9B30BbA19C6fA282AB29218EC61D84",
	},
	sepolia: {
		optimismMintableERC20Factory: "0xb1efB9650aD6d0CC1ed3Ac4a0B7f1D5732696D37",
	},
	base: {
		optimismMintableERC20Factory: "0xF10122D428B4bc8A9d050D06a2037259b4c4B83B",
	},
	baseSepolia: {
		optimismMintableERC20Factory: "0x4200000000000000000000000000000000000012",
	},
}

export { networks, tokens }
