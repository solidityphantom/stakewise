// SPDX-License-Identifier: MIT
pragma solidity >=0.8.17;

import "./Staking.sol";
import "./Distribution.sol";

contract MultiStaker {
    string[] private stakingMethods = [
        MSG_DELEGATE,
        MSG_UNDELEGATE,
        MSG_REDELEGATE,
        MSG_CANCEL_UNDELEGATION
    ];
    string[] private distributionMethods = [MSG_WITHDRAW_DELEGATOR_REWARD];

    /// @dev Approves the required transactions for delegation and withdrawal of staking rewards transactions.
    /// @dev This creates a Cosmos Authorization Grants for the given methods.
    /// @dev This emits an Approval event.
    function approveRequiredMethods() public {
        bool success = STAKING_CONTRACT.approve(
            msg.sender,
            type(uint256).max,
            stakingMethods
        );
        require(success, "Failed to approve delegate method");
        success = DISTRIBUTION_CONTRACT.approve(
            msg.sender,
            distributionMethods
        );
        require(success, "Failed to approve withdraw delegator rewards method");
    }

    /// @dev Approves a list of Cosmos staking transactions with a specific amount of tokens denominated in aevmos.
    /// @dev This creates a Cosmos Authorization Grant for the given methods.
    /// @dev This emits an Approval event.
    /// @param _methods The message type URLs of the methods to approve.
    /// @param _amount The amount of tokens approved to be spent in aevmos.
    function approveStakingMethods(
        string[] calldata _methods,
        uint256 _amount
    ) public {
        bool success = STAKING_CONTRACT.approve(msg.sender, _amount, _methods);
        require(success, "Failed to approve staking methods");
    }

    /// @dev Approves all staking transactions with the maximum amount of tokens.
    /// @dev This creates a Cosmos Authorization Grant for the given methods.
    /// @dev This emits an Approval event.
    function approveAllStakingMethodsWithMaxAmount() public {
        bool success = STAKING_CONTRACT.approve(
            msg.sender,
            type(uint256).max,
            stakingMethods
        );
        require(success, "Failed to approve staking methods");
    }

    /// @dev stake a given amount of tokens. Returns the completion time of the staking transaction.
    /// @dev This emits an Delegate event.
    /// @param _validatorAddrs The array of validator addresses.
    /// @param _amounts The array of amounts of tokens to stake in aevmos.
    /// @return completionTimes The completion times of the staking transactions.
    function stakeTokens(
        string[] memory _validatorAddrs,
        uint256[] memory _amounts
    ) public returns (int64[] memory completionTimes) {
        require(
            _validatorAddrs.length == _amounts.length,
            "Address and amount arrays must have the same length"
        );

        completionTimes = new int64[](_validatorAddrs.length);
        for (uint256 i = 0; i < _validatorAddrs.length; i++) {
            completionTimes[i] = STAKING_CONTRACT.delegate(
                msg.sender,
                _validatorAddrs[i],
                _amounts[i]
            );
        }
        return completionTimes;
    }

    /// @dev stake a given amount of tokens. Returns the completion time of the staking transaction.
    /// @dev This emits an Delegate event.
    /// @param _validatorAddrs The array of validator addresses.
    /// @param _amounts The array of amounts of tokens to stake in aevmos.
    /// @return completionTimes The completion times of the staking transactions.
    function safeStakeTokens(
        string[] memory _validatorAddrs,
        uint256[] memory _amounts
    ) public returns (int64[] memory completionTimes) {
        require(
            _validatorAddrs.length == _amounts.length,
            "Address and amount arrays must have the same length"
        );

        uint256 totalAmount = 0;
        for (uint256 i = 0; i < _amounts.length; i++) {
            totalAmount += _amounts[i];
        }

        uint256 remainingAllowance = STAKING_CONTRACT.allowance(
            address(this),
            msg.sender,
            MSG_DELEGATE
        );

        require(
            totalAmount <= remainingAllowance,
            "Total staking amount exceeds remaining allowance"
        );

        completionTimes = new int64[](_validatorAddrs.length);
        for (uint256 i = 0; i < _validatorAddrs.length; i++) {
            completionTimes[i] = STAKING_CONTRACT.delegate(
                msg.sender,
                _validatorAddrs[i],
                _amounts[i]
            );
        }
        return completionTimes;
    }

    /// @dev redelegate a given amount of tokens. Returns the completion times of the redelegate transactions.
    /// @dev This emits Redelegate events.
    /// @param _validatorSrcAddrs The array of source validator addresses.
    /// @param _validatorDstAddrs The array of destination validator addresses.
    /// @param _amounts The array of amounts of tokens to redelegate in aevmos.
    /// @return completionTimes The completion times of the redelegate transactions.
    function redelegateTokens(
        string[] memory _validatorSrcAddrs,
        string[] memory _validatorDstAddrs,
        uint256[] memory _amounts
    ) public returns (int64[] memory completionTimes) {
        require(
            _validatorSrcAddrs.length == _validatorDstAddrs.length &&
                _validatorSrcAddrs.length == _amounts.length,
            "Address and amount arrays must have the same length"
        );

        completionTimes = new int64[](_validatorSrcAddrs.length);
        for (uint256 i = 0; i < _validatorSrcAddrs.length; i++) {
            completionTimes[i] = STAKING_CONTRACT.redelegate(
                msg.sender,
                _validatorSrcAddrs[i],
                _validatorDstAddrs[i],
                _amounts[i]
            );
        }
        return completionTimes;
    }

    /// @dev unstake a given amount of tokens. Returns the completion times of the unstaking transactions.
    /// @dev This emits Undelegate events.
    /// @param _validatorAddrs The array of validator addresses.
    /// @param _amounts The array of amounts of tokens to unstake in aevmos.
    /// @return completionTimes The completion times of the unstaking transactions.
    function unstakeTokens(
        string[] memory _validatorAddrs,
        uint256[] memory _amounts
    ) public returns (int64[] memory completionTimes) {
        require(
            _validatorAddrs.length == _amounts.length,
            "Address and amount arrays must have the same length"
        );

        completionTimes = new int64[](_validatorAddrs.length);
        for (uint256 i = 0; i < _validatorAddrs.length; i++) {
            completionTimes[i] = STAKING_CONTRACT.undelegate(
                msg.sender,
                _validatorAddrs[i],
                _amounts[i]
            );
        }
        return completionTimes;
    }

    /// @dev cancel unbonding delegations. Returns the completion times of the unbonding delegation cancellation transactions.
    /// @dev This emits CancelUnbondingDelegation events.
    /// @param _validatorAddrs The array of validator addresses.
    /// @param _amounts The array of amounts of tokens to cancel the unbonding delegation in aevmos.
    /// @param _creationHeights The array of creation heights of the unbonding delegations.
    /// @return completionTimes The completion times of the unbonding delegation cancellation transactions.
    function cancelUnbondingDelegation(
        string[] memory _validatorAddrs,
        uint256[] memory _amounts,
        uint256[] memory _creationHeights
    ) public returns (int64[] memory completionTimes) {
        require(
            _validatorAddrs.length == _amounts.length &&
                _validatorAddrs.length == _creationHeights.length,
            "Address and amount arrays must have the same length"
        );

        completionTimes = new int64[](_validatorAddrs.length);
        for (uint256 i = 0; i < _validatorAddrs.length; i++) {
            completionTimes[i] = STAKING_CONTRACT.cancelUnbondingDelegation(
                msg.sender,
                _validatorAddrs[i],
                _amounts[i],
                _creationHeights[i]
            );
        }
        return completionTimes;
    }

    /// @dev withdraw delegation rewards from the specified validator addresses
    /// @dev This emits an WithdrawDelegatorRewards event.
    /// @param _validatorAddrs The array of validator addresses.
    /// @return amounts The array of Coin amounts withdrawn.
    function withdrawRewards(
        string[] memory _validatorAddrs
    ) public returns (Coin[][] memory amounts) {
        amounts = new Coin[][](_validatorAddrs.length);
        for (uint256 i = 0; i < _validatorAddrs.length; i++) {
            amounts[i] = DISTRIBUTION_CONTRACT.withdrawDelegatorRewards(
                msg.sender,
                _validatorAddrs[i]
            );
        }
        return amounts;
    }

    /// ================================
    ///             QUERIES
    /// ================================

    /// @dev Returns the remaining number of tokens that spender will be allowed to spend
    /// on behalf of the owner through staking. This is zero by default.
    /// @return remaining The remaining number of tokens available to be spent in aevmos.
    function getAllowance() public view returns (uint256 remaining) {
        return
            STAKING_CONTRACT.allowance(address(this), msg.sender, MSG_DELEGATE);
    }

    /// @dev Returns the delegation information for a given validator for the msg sender.
    /// @param _validatorAddr The address of the validator.
    /// @return shares and balance. The delegation information for a given validator for the msg sender.
    function getDelegation(
        string memory _validatorAddr
    ) public view returns (uint256 shares, Coin memory balance) {
        return STAKING_CONTRACT.delegation(msg.sender, _validatorAddr);
    }

    /// @dev Returns the delegation rewards for a given validator for the msg sender.
    /// @param _validatorAddr The address of the validator.
    /// @return rewards The delegation rewards corresponding to the msg sender.
    function getDelegationRewards(
        string memory _validatorAddr
    ) public view returns (DecCoin[] memory rewards) {
        return
            DISTRIBUTION_CONTRACT.delegationRewards(msg.sender, _validatorAddr);
    }

    /// @dev Returns the unbonding delegation information for a given validator for the msg sender.
    /// @param _validatorAddr The address of the validator.
    /// @return entries The unbonding delegation entries for a given validator for the msg sender.
    function getUnbondingDelegation(
        string memory _validatorAddr
    ) public view returns (UnbondingDelegationEntry[] memory entries) {
        return STAKING_CONTRACT.unbondingDelegation(msg.sender, _validatorAddr);
    }

    /// @dev Queries all validators, that a given address has delegated to.
    /// @return validators The addresses of all validators, that were delegated to by the given address.
    function getDelegatorValidators()
        public
        view
        returns (string[] memory validators)
    {
        return DISTRIBUTION_CONTRACT.delegatorValidators(msg.sender);
    }
}
