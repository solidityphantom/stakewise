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
    const validatorSrcAddr = validators[1].operator_address;
    const validatorDstAddr = validators[2].operator_address;
    const validatorAddrs = [validatorAddr, validatorSrcAddr, validatorDstAddr];

    const MultiStaker = await ethers.getContractFactory("MultiStaker");

    const multiStaker = MultiStaker.attach(
      process.env.CONTRACT_ADDRESS ?? "" // the address where your contract is deployed
    );

    // Withdraw rewards
    let withdrawRes = await multiStaker.withdrawRewards(validatorAddrs);
    console.log("Withdrawn rewards: ", withdrawRes);
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
