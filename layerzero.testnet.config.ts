// eslint-disable-next-line @typescript-eslint/no-var-requires
import { EndpointId } from '@layerzerolabs/lz-definitions'

const sepoliaContract = {
    eid: EndpointId.SEPOLIA_V2_TESTNET,
    contractName: 'ZentryOFTAdapter',
}

const baseSepoliaContract = {
    eid: EndpointId.BASESEP_V2_TESTNET,
    contractName: 'ZentryOFT',
}

const blastTestnetContract = {
    eid: EndpointId.BLAST_V2_TESTNET,
    contractName: 'ZentryOFT',
}

const arbSepoliaContract = {
    eid: EndpointId.ARBSEP_V2_TESTNET,
    contractName: 'ZentryOFT',
}

export default {
    contracts: [
        {
            contract: sepoliaContract,
        },
        {
            contract: baseSepoliaContract,
        },
        {
            contract: blastTestnetContract,
        },
        {
            contract: arbSepoliaContract,
        },
    ],
    connections: [
        {
            from: sepoliaContract,
            to: baseSepoliaContract,
        },
        {
            from: sepoliaContract,
            to: blastTestnetContract,
        },
        {
            from: sepoliaContract,
            to: arbSepoliaContract,
        },
        {
            from: baseSepoliaContract,
            to: sepoliaContract,
        },
        {
            from: baseSepoliaContract,
            to: blastTestnetContract,
        },
        {
            from: baseSepoliaContract,
            to: arbSepoliaContract,
        },
        {
            from: blastTestnetContract,
            to: sepoliaContract,
        },
        {
            from: blastTestnetContract,
            to: baseSepoliaContract,
        },
        {
            from: blastTestnetContract,
            to: arbSepoliaContract,
        },
        {
            from: arbSepoliaContract,
            to: sepoliaContract,
        },
        {
            from: arbSepoliaContract,
            to: baseSepoliaContract,
        },
        {
            from: arbSepoliaContract,
            to: blastTestnetContract,
        },
    ],
}
