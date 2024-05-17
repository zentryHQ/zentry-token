<p align="center">
  <a href="https://layerzero.network">
    <img alt="LayerZero" style="max-width: 500px" src="https://d3a2dpnnrypp5h.cloudfront.net/bridge-app/lz.png"/>
  </a>
</p>

<p align="center">
  <a href="https://layerzero.network" style="color: #a77dff">Homepage</a> | <a href="https://docs.layerzero.network/" style="color: #a77dff">Docs</a> | <a href="https://layerzero.network/developers" style="color: #a77dff">Developers</a>
</p>

<h1 align="center">OFT Example</h1>

<p align="center">
  <a href="https://docs.layerzero.network/contracts/oft" style="color: #a77dff">Quickstart</a> | <a href="https://docs.layerzero.network/contracts/oapp-configuration" style="color: #a77dff">Configuration</a> | <a href="https://docs.layerzero.network/contracts/options" style="color: #a77dff">Message Execution Options</a> | <a href="https://docs.layerzero.network/contracts/endpoint-addresses" style="color: #a77dff">Endpoint Addresses</a>
</p>

<p align="center">Template project for getting started with LayerZero's <code>OFT</code> contract development.</p>

## 1) Developing Contracts

#### Installing dependencies

We recommend using `pnpm` as a package manager (but you can of course use a package manager of your choice):

```bash
pnpm install
```

#### Compiling your contracts

This project supports both `hardhat` and `forge` compilation. By default, the `compile` command will execute both:

```bash
pnpm compile
```

If you prefer one over the other, you can use the tooling-specific commands:

```bash
pnpm compile:forge
pnpm compile:hardhat
```

Or adjust the `package.json` to for example remove `forge` build:

```diff
- "compile": "$npm_execpath run compile:forge && $npm_execpath run compile:hardhat",
- "compile:forge": "forge build",
- "compile:hardhat": "hardhat compile",
+ "compile": "hardhat compile"
```

#### Running tests

Similarly to the contract compilation, we support both `hardhat` and `forge` tests. By default, the `test` command will execute both:

```bash
pnpm test
```

If you prefer one over the other, you can use the tooling-specific commands:

```bash
pnpm test:forge
pnpm test:hardhat
```

Or adjust the `package.json` to for example remove `hardhat` tests:

```diff
- "test": "$npm_execpath test:forge && $npm_execpath test:hardhat",
- "test:forge": "forge test",
- "test:hardhat": "$npm_execpath hardhat test"
+ "test": "forge test"
```

## 2) Deploying Contracts

Set up deployer wallet/account:

- Rename `.env.example` -> `.env`
- Choose your preferred means of setting up your deployer wallet/account:

```
MNEMONIC="test test test test test test test test test test test junk"
or...
PRIVATE_KEY="0xabc...def"
```

- Fund this address with the corresponding chain's native tokens you want to deploy to.

To deploy your contracts to your desired blockchains, run the following command in your project's folder:

```bash
npx hardhat lz:deploy
```

More information about available CLI arguments can be found using the `--help` flag:

```bash
npx hardhat lz:deploy --help
```

### Deploy Zentry OFT

1.  Deploy OFT Adapter On Mainnet

- before proceed, check the variable in `deploy/ZentryOFTAdapter.ts`
- Note that there should be only one ZentryOFTAdapter across all networks.

```sh
npx hardhat lz:deploy --networks mainnet --tags ZentryOFTAdapter
```

2. Deploy OFT On other networks

- before proceed, check the variable in `deploy/ZentryOFT.ts`

```sh
npx hardhat lz:deploy --networks base,blast,arb --tags ZentryOFT
```

3. wire

- wire pathways to ensure contracts can communicate with each other

```sh
npx hardhat lz:oapp:wire --oapp-config layerzero.config.ts
```

4. verify contracts

- ARGS: arguments of deployed contract separated by whitespace
- there is an argument that is a layerzero endpoint. it can be found [here](https://docs.layerzero.network/v2/developers/evm/technical-reference/deployed-contracts)

```sh
npx hardhat verify --network <NETWORK> <CONTRACT_ADDRESS> <...ARGS>
```

To check if the contracts have correctly been set to communicate with one another, run
```sh
npx hardhat lz:oapp:peers:get --oapp-config layerzero.config.ts
```

Examples:

OFT Adapter
```sh
npx hardhat verify --network sepolia 0xBF8228aeb591bF86786746D433FecC03EC18bd83 0xDf9160b02c837C19746Ce9de2389e565e5372135 0x6EDCE65403992e310A62460808c4b910D972f10f 0x226870989E4b9bDdD07060285b3E2924EFaE93f2
```

OFT
```sh
npx hardhat verify --network base_sepolia 0x6EDCE65403992e310A62460808c4b910D972f10f 0x226870989E4b9bDdD07060285b3E2924EFaE93f2
```



<br></br>

<p align="center">
  Join our community on <a href="https://discord-layerzero.netlify.app/discord" style="color: #a77dff">Discord</a> | Follow us on <a href="https://twitter.com/LayerZero_Labs" style="color: #a77dff">Twitter</a>
</p>


### Deployed addresses

| Contract                                       | Chain                                          | Address                                        |
| ---------------------------------------------- | ---------------------------------------------- | ---------------------------------------------- |
| ZentryToken                                    | ETH testnet (sepolia)                          | 0xDf9160b02c837C19746Ce9de2389e565e5372135     |
| ZentryOFTAdapter                               | ETH testnet (sepolia)                          | 0x176BF52F7c0B0508f5b71306bd8BA2E98992c0D2     |
| ZentryOFT                                      | Arbitrum sepolia                               | 0xe9F8bd6E887b21F2Ce6d841dd61fa43455733B4e     |
| ZentryOFT                                      | Base sepolia                                   | 0xe9F8bd6E887b21F2Ce6d841dd61fa43455733B4e     |
| ZentryOFT                                      | Blast testnet                                  | 0xe9F8bd6E887b21F2Ce6d841dd61fa43455733B4e     |
