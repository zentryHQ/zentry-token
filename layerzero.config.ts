// eslint-disable-next-line @typescript-eslint/no-var-requires
import { EndpointId } from '@layerzerolabs/lz-definitions'

const mainnetContract = {
    eid: EndpointId.ETHEREUM_V2_MAINNET,
    contractName: 'ZentryOFTAdapter',
}

const baseContract = {
    eid: EndpointId.BASE_V2_MAINNET,
    contractName: 'ZentryOFT',
}

const blastContract = {
    eid: EndpointId.BLAST_V2_MAINNET,
    contractName: 'ZentryOFT',
}

const arbContract = {
    eid: EndpointId.ARBITRUM_V2_MAINNET,
    contractName: 'ZentryOFT',
}

export default {
    contracts: [
        {
            contract: mainnetContract,
        },
        {
            contract: baseContract,
        },
        {
            contract: blastContract,
        },
        {
            contract: arbContract,
        },
    ],
    connections: [
        {
            from: mainnetContract,
            to: baseContract,
        },
        {
            from: mainnetContract,
            to: blastContract,
        },
        {
            from: mainnetContract,
            to: arbContract,
        },
        {
            from: baseContract,
            to: mainnetContract,
        },
        {
            from: baseContract,
            to: blastContract,
        },
        {
            from: baseContract,
            to: arbContract,
        },
        {
            from: blastContract,
            to: mainnetContract,
        },
        {
            from: blastContract,
            to: baseContract,
        },
        {
            from: blastContract,
            to: arbContract,
        },
        {
            from: arbContract,
            to: mainnetContract,
        },
        {
            from: arbContract,
            to: baseContract,
        },
        {
            from: arbContract,
            to: blastContract,
        },
    ],
}
