import { expect } from "chai";
import { ethers } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";

describe("MultiStaker", function () {
  async function deployMultiStakerFixture() {
    // Contracts are deployed using the first signer/account by default
    const [owner] = await ethers.getSigners();

    const MultiStaker = await ethers.getContractFactory("MultiStaker");
    const multiStaker = await MultiStaker.deploy();

    const validatorAddresses = ["address1", "address2"];
    const amounts = [100, 200];

    return { multiStaker, owner, validatorAddresses, amounts };
  }

  describe("Staking", function () {
    it("Should stake the correct amounts", async function () {
      const { multiStaker, validatorAddresses, amounts } = await loadFixture(
        deployMultiStakerFixture
      );

      const completionTimes = await multiStaker.stakeTokens(
        validatorAddresses,
        amounts
      );

      //   for (let i = 0; i < validatorAddresses.length; i++) {
      //     const { shares, balance } = await multiStaker.getDelegation(
      //       validatorAddresses[i]
      //     );

      //     expect(balance).to.equal(amounts[i]);
      //     // Add expectations for completionTimes[i] and shares if applicable
      //   }
      // });
    });

    //   describe("Reward Withdrawal", function () {
    //     it("Should withdraw the correct rewards", async function () {
    //       const { multiStaker, validatorAddresses } = await loadFixture(
    //         deployMultiStakerFixture
    //       );

    //       const rewardsBefore = [];
    //       for (let i = 0; i < validatorAddresses.length; i++) {
    //         rewardsBefore[i] = await multiStaker.getDelegationRewards(
    //           validatorAddresses[i]
    //         );
    //       }

    //       const withdrawnRewards = await multiStaker.withdrawRewards(
    //         validatorAddresses
    //       );

    //       for (let i = 0; i < validatorAddresses.length; i++) {
    //         const rewardsAfter = await multiStaker.getDelegationRewards(
    //           validatorAddresses[i]
    //         );

    //         expect(rewardsAfter).to.equal(rewardsBefore[i] - withdrawnRewards[i]);
    //       }
    //     });
  });
});
