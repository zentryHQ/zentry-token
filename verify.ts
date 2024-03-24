import { run } from "hardhat";

const GF_TOKEN_ADDRESS = "0xaaef88cea01475125522e117bfe45cf32044e238";
const ZENTRY_TOKEN_ADDRESS = "0xdBB7a34Bf10169d6d2D0d02A6cbb436cF4381BFa";
const MIGRATOR_CONTRACT_ADDRESS = "0x9f28c9C2dA4A833cbFaAacbf7eB62267334d7149";

if (!GF_TOKEN_ADDRESS) throw "⛔️ GF contract address not provided";
if (!ZENTRY_TOKEN_ADDRESS) throw "⛔️ Zentry contract address not provided";
if (!MIGRATOR_CONTRACT_ADDRESS) throw "⛔️ Migrator contract address not provided";

const verifyContract = async ():Promise<void> => {
    await verify(ZENTRY_TOKEN_ADDRESS, []);
    await verify(MIGRATOR_CONTRACT_ADDRESS, [GF_TOKEN_ADDRESS, ZENTRY_TOKEN_ADDRESS]);
    console.log('\n✅ contracts verified!');
}

const verify = async (contractAddress: string, args: any[]) => {
  console.log(`\nverify contract ${contractAddress}`);

  try {
    await run("verify:verify", {
        address: contractAddress,
        constructorArguments: args,
    });
  } catch (e: any) {
    if (e.message.toLowerCase().includes("already verified")) {
        console.log("already verified!");
    } else {
        console.log(e);
    }
  }
}

verifyContract()
  .then(() => process.exit(0))
  .catch((error) => {
      console.log(error);
      process.exit(1);
  });