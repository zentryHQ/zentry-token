// eslint-disable-next-line @typescript-eslint/no-var-requires
import { EndpointId } from '@layerzerolabs/lz-definitions'

const sepoliaContract = {
    eid: EndpointId.SEPOLIA_V2_TESTNET,
    contractName: 'ZentryOFTAdapter',
}

const ftmTestnetContract = {
    eid: EndpointId.FANTOM_V2_TESTNET,
    contractName: 'ZentryOFT',
}

const mumbaiContract = {
    eid: EndpointId.POLYGON_V2_TESTNET,
    contractName: 'ZentryOFT',
}

export default {
    contracts: [
        {
            contract: sepoliaContract,
        },
        {
            contract: ftmTestnetContract,
        },
        {
            contract: mumbaiContract,
        },
    ],
    connections: [
        {
            from: sepoliaContract,
            to: ftmTestnetContract,
            config: {},
        },
        {
            from: sepoliaContract,
            to: mumbaiContract,
        },
        {
            from: ftmTestnetContract,
            to: sepoliaContract,
        },
        {
            from: ftmTestnetContract,
            to: mumbaiContract,
        },
        {
            from: mumbaiContract,
            to: sepoliaContract,
        },
        {
            from: mumbaiContract,
            to: ftmTestnetContract,
        },
    ],
}
