// SPDX-License-Identifier: GPL

// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

pragma solidity 0.8.11;
pragma abicoder v2;

import "./LiquidityProvider.sol";

/// @dev parameter for the batchReward function
struct Winner {
    address winner;
    uint256 amount;
}

interface IToken {
    function init(
        address _liquidityProvider,
        uint8 _decimals,
        string memory _name,
        string memory _symbol,
        address _emergencyCouncil,
        address _operator,
        address _workerConfig
    )
        external;

    function op() external view returns (address);

    /**
     * @notice update the operator account to a new address
     * @param newOperator the address of the new operator to change to
     */
    function updateOperator(address newOperator) external;

    function noEmergencyMode() external view returns (bool);

    /**
     * @notice getter for the RNG oracle provided by `workerConfig_`
     * @return the address of the trusted oracle
     */
    function oracle() external view returns (address);

    /**
     * @notice enables emergency mode preventing the swapping in of tokens,
     * @notice and setting the rng oracle address to null
     */
    function enableEmergencyMode() external;

    /**
     * @notice disables emergency mode, following presumably a contract upgrade
     * @notice (operator only)
     */
    function disableEmergencyMode(address _workerConfig) external;

    function updateWorkerConfig(address _workerConfig) external;

    /// @notice updates the reward quarantine threshold if called by the operator
    function updateRewardQuarantineThreshold(uint _maxUncheckedReward) external;

    /**
     * @notice wraps `amount` of underlying tokens into fluid tokens
     * @notice requires you to have called the ERC20 `approve` method
     * @notice targeting this contract first
     *
     * @param amount the number of tokens to wrap
     * @return the number of tokens wrapped
     */
    function erc20In(uint amount) external returns (uint);

    /**
     * @notice unwraps `amount` of fluid tokens back to underlying
     *
     * @param amount the number of fluid tokens to unwrap
     */
    function erc20Out(uint amount) external;

    /**
     * @notice calculates the size of the reward pool (the interest we've earned)
     *
     * @return the number of tokens in the reward pool
     */
    function rewardPoolAmount() external returns (uint);

    /** @notice pays out several rewards
     * @notice only usable by the trusted oracle account
     *
     * @param rewards the array of rewards to pay out
     */
    function batchReward(
        Winner[] memory rewards,
        uint firstBlock,
        uint lastBlock
    )
        external;

    /**
     * @notice admin function, unblocks a reward that was quarantined for being too large
     * @notice allows for paying out or removing the reward, in case of abuse
     *
     * @param user the address of the user who's reward was quarantined
     * @param amount the amount of tokens to release (in case multiple rewards were quarantined)
     * @param payout should the reward be paid out or removed?
     * @param firstBlock the first block the rewards include (should be from the BlockedReward event)
     * @param lastBlock the last block the rewards include
     */
    function unblockReward(
        bytes32 rewardTx,
        address user,
        uint amount,
        bool payout,
        uint firstBlock,
        uint lastBlock
    )
        external;

    /*
     * @notice returns whether mint limits are enabled
     * @notice mint limits no longer exist, this always `false`
     */
    function mintLimitsEnabled() external returns (bool);

    /*
     * @notice returns the mint limit per user
     * @notice mint limits no longer exist, this always `uint256.max`
     */
    function userMintLimit() external returns (uint);

    /*
     * @notice returns the remaining global mint limit
     * @notice mint limits no longer exist, this always `uint256.max`
     */
    function remainingGlobalMintLimit() external returns (uint);

    /**
     * @notice return the max unchecked reward that's currently set
     */
    function maxUncheckedReward() external returns (uint);

    /*
     * @notice return the current operator
     */
    function operator() external view returns (address);

    /*
     * @notice returns how much `account` has minted
     * @notice mint limits no longer exist, this always `0`
     *
     * @param the account to check
     */
    function userAmountMinted(address /* account */) external returns (uint);

    /*
     * @notice decimals that the token is supporting
     */
    function decimals() external returns (uint8);

    /// @notice upgrade the underlying LiquidityProvider to a new source
    function upgradeLiquidityProvider(LiquidityProvider newPool) external;
}
