import { ethers } from "hardhat";
import "@nomiclabs/hardhat-ethers";

async function main() {
  // Check if contract name was provided
  if (process.argv.length < 3) {
    throw new Error("No contract name provided");
  }

  const contractName = process.argv[2];

  const Contract = await ethers.getContractFactory(contractName);
  const contract = await Contract.deploy();

  await contract.deployed();

  console.log(`${contractName} deployed to ${contract.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
