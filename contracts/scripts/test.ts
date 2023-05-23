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
    const validatorAddr1 = validators[0].operator_address;
    const validatorAddr2 = validators[1].operator_address;
    const validatorAddr3 = validators[2].operator_address;
    const validatorAddrs = [validatorAddr1, validatorAddr2, validatorAddr3];

    const MultiStaker = await ethers.getContractFactory("MultiStaker");

    const multiStaker = MultiStaker.attach(
      process.env.CONTRACT_ADDRESS ?? "" // the address where your contract is deployed
    );

    const tokensToDelegate = "10";
    const tokensPerValidator = ethers.utils
      .parseEther(tokensToDelegate)
      .div(validatorAddrs.length);

    // Stake tokens
    const amounts = Array(validatorAddrs.length).fill(tokensPerValidator);
    console.log(amounts);

    let stakeRes = await multiStaker.stakeTokens(validatorAddrs, amounts);
    console.log("Staked tokens, completion times: ", stakeRes);
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
