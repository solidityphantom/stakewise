import { ethers } from "hardhat";
import "@nomiclabs/hardhat-ethers";
import fs from "fs";
import * as dotenv from "dotenv";
dotenv.config();

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  try {
    const data = fs.readFileSync("./data/sorted_validators.json", "utf-8");
    const validators = JSON.parse(data).validators;

    const validatorAddr = validators[0].operator_address;

    const SimpleStaker = await ethers.getContractFactory("SimpleStaker");

    const simpleStaker = SimpleStaker.attach(
      process.env.CONTRACT_ADDRESS ?? "" // the address where your contract is deployed
    );

    // Approve required methods
    await simpleStaker.approveRequiredMethods();

    await sleep(10000); // Sleep for 10 seconds

    // Stake tokens
    const amount = ethers.utils.parseEther("10"); // put the amount you want to stake here
    const stakeRes = await simpleStaker.stakeTokens(validatorAddr, amount);
    console.log("Staked tokens, completion time: ", stakeRes);

    await sleep(10000); // Sleep for 10 seconds

    // Withdraw rewards
    const withdrawRes = await simpleStaker.withdrawRewards(validatorAddr);
    console.log("Withdrawn rewards: ", withdrawRes);

    await sleep(10000); // Sleep for 10 seconds

    // Get delegation
    const delegation = await simpleStaker.getDelegation(validatorAddr);
    console.log("Delegation: ", ethers.utils.formatUnits(delegation[1][1], 18));

    // Get delegation rewards
    const rewards = await simpleStaker.getDelegationRewards(validatorAddr);
    console.log("Rewards: ", ethers.utils.formatUnits(rewards[0][1]), 18);
  } catch (err) {
    console.error(err);
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
