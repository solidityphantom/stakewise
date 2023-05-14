import { ethers } from "hardhat";
import "@nomiclabs/hardhat-ethers";
import * as dotenv from "dotenv";
dotenv.config();

async function main() {
  try {
    const MultiStaker = await ethers.getContractFactory("MultiStaker");

    const multiStaker = MultiStaker.attach(process.env.CONTRACT_ADDRESS ?? "");

    const allowance = await multiStaker.getAllowance();
    console.log("allowance: ", allowance);
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
