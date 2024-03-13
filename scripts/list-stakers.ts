import _ from "lodash";
import { ethers } from "hardhat";
import xGFABI from "./xGFABI.json";
import fs from "fs/promises";
import data from "./xGF-stakers.json";

// const poolAddress = "0x0974b3D99eD291aC4CD3f6059D24929e5e3Af5Ff"; // xGF
// const outFile = "scripts/xGF-stakers.json";

const poolAddress = "0x138Bc555cCf5763A63ff862d51B537162F3448e6"; // xGFETH
const outFile = "scripts/xGFETH-stakers.json";

async function main() {
  const logs = await ethers.provider.getLogs({
    fromBlock: 16368257,
    address: poolAddress,
    topics: [ethers.id("LogDeposit(address,uint256,uint256,uint256,uint256)")],
  });
  const iface = new ethers.Interface(xGFABI);
  const contract = new ethers.Contract(poolAddress, xGFABI, ethers.provider);

  const stakerList = new Set<string>();

  for (const log of logs) {
    const event = iface.parseLog(log);
    if (!event) return;

    const isDeposit = event.args[3].toString() === "1";
    const locker = event.args[0];

    if (isDeposit) {
      stakerList.add(locker);
    }
  }

  console.log("Total stakers:", stakerList.size);

  const chunks = _.chunk(Array.from(stakerList), 1);
  const results = [];

  await fs.writeFile(outFile, "[");

  for (let i = 0; i < chunks.length; i++) {
    console.log(`fetching chunk ${i + 1} of ${chunks.length}`);
    const chunk = chunks[i];
    const chunkRes = (
      await Promise.all(
        chunk.map(async (staker) => {
          const lockBalance = await contract.locks(staker);
          if (lockBalance.amount.toString() === "0") return;
          return {
            stakerAddress: staker,
            lockBalance: lockBalance.amount.toString(),
            end: lockBalance.end.toString(),
          };
        })
      )
    ).filter(Boolean);

    results.push(...chunkRes);
  }

  console.log("Total stakers with lock:", results.length);
  await fs.writeFile(outFile, JSON.stringify(results, null, 2));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
