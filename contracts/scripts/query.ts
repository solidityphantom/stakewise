import { ethers } from "hardhat";
import "@nomiclabs/hardhat-ethers";
import fs from "fs";
import * as dotenv from "dotenv";
dotenv.config();

async function main() {
  try {
    const data = fs.readFileSync("./data/sorted_validators.json", "utf-8");
    const validators = JSON.parse(data).validators;
    const validatorAddr1 = validators[5].operator_address;
    const validatorAddr2 = validators[6].operator_address;

    const MultiStaker = await ethers.getContractFactory("MultiStaker");

    const multiStaker = MultiStaker.attach(
      process.env.CONTRACT_ADDRESS ?? "" // the address where your contract is deployed
    );

    // Get delegation
    // const delegation1 = await multiStaker.getDelegation(validatorAddr1);
    // const delegation2 = await multiStaker.getDelegation(validatorAddr2);
    // console.log(
    //   "Delegation 1: ",
    //   ethers.utils.formatUnits(delegation1[1][1], 18)
    // );
    // console.log(
    //   "Delegation 2: ",
    //   ethers.utils.formatUnits(delegation2[1][1], 18)
    // );

    // Get delegators
    const delegators = await multiStaker.getDelegatorValidators();
    console.log("Delegators: ", delegators);
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
