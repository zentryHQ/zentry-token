# Zentry Token

## Local Development
The following assumes the use of `node@>=14`.

### Install Dependencies
 1. Copy `.env.example` file and change its name to `.env` in the project folder
 2. Run `npm install` to install all dependencies

### Compile Contracts
`npm run compile`

### Run Unit Tests
`npm run test`

### Run Integration Tests
`npm run integration-test`


## Deployment
Before running this command, check parameters in `ignition/parameters/chain-1.json`.make sure parameters of your deploying module and your dependent module are correct

e.g If you are deploying `ignition/modules/xGFMigrator.ts`, it using `ZentryTokenModule`. thus you have to check/set these parameters

```json
{
 "ZentryToken" : {
    "gfToken": "0xaaef88cea01475125522e117bfe45cf32044e238",
    "owner": "0x9DE6DE21007312eeb6CD90500fFECafeC297B70D"
  },
  "xGFMigrator": {
    "merkleRoot": "",
    "stakedZentry": "",
    "owner": ""
  },
}
```

### Deployed addresses

| Contract                                       | Chain                                          | Address                                        |
| ---------------------------------------------- | ---------------------------------------------- | ---------------------------------------------- |
| Zentry Token                                   | ETH                                            | 0xdBB7a34Bf10169d6d2D0d02A6cbb436cF4381BFa     |
| GF Migrator                                    | ETH                                            | 0x9f28c9C2dA4A833cbFaAacbf7eB62267334d7149     |
| Sepolia Zentry Token                           | Sepolia ETH                                    | 0xDf9160b02c837C19746Ce9de2389e565e5372135     |

