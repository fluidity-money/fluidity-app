// SPDX-License-Identifier: GPL

// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

pragma solidity 0.8.11;
pragma abicoder v2;

import "./IFluidClient.sol";
import "./ILiquidityProvider.sol";

interface IToken {
    /// @notice emitted when a reward is quarantined for being too large
    event BlockedReward(
        address indexed winner,
        uint amount,
        uint startBlock,
        uint endBlock
    );

    /// @notice emitted when a blocked reward is released
    event UnblockReward(
        bytes32 indexed originalRewardTx,
        address indexed winner,
        uint amount,
        uint startBlock,
        uint endBlock
    );

    /// @notice emitted when an underlying token is wrapped into a fluid asset
    event MintFluid(address indexed addr, uint amount);

    /// @notice emitted when a fluid token is unwrapped to its underlying asset
    event BurnFluid(address indexed addr, uint amount);

    /// @notice emitted when a new operator takes over the contract management
    event OperatorChanged(address indexed oldOperator, address indexed newOperator);

    /// @notice emitted when restrictions
    event MaxUncheckedRewardLimitChanged(uint amount);

    /// @notice global mint limit changed by setRestrictions
    /// @notice deprecated, mint limits no longer exist
    event GlobalMintLimitChanged(uint amount);

    /// @notice user mint limits changed by setRestrictions
    /// @notice deprecated, mint limits no longer exist
    event UserMintLimitChanged(uint amount);

    /// @notice updating the reward quarantine before manual signoff
    /// @notice by the multisig (with updateRewardQuarantineThreshold)
    event RewardQuarantineThresholdUpdated(uint amount);

    /// @notice emitted when the mint limits are enabled or disabled
    /// @notice by enableMintLimits
    /// @notice deprecated, mint limits no longer exist
    event MintLimitsStateChanged(bool indexed status);

    /**
     * @notice initialiser function - sets the contract's data
     * @dev we pass in the metadata explicitly instead of sourcing from the
     * @dev underlying token because some underlying tokens don't implement
     * @dev these methods
     *
     * @param _liquidityProvider the `LiquidityProvider` contract address. Should have this contract as its owner.
     * @param _decimals the fluid token's decimals (should be the same as the underlying token's)
     * @param _name the fluid token's name
     * @param _symbol the fluid token's symbol
     * @param _emergencyCouncil address that can activate emergency mode
     * @param _operator address that can release quarantine payouts and activate emergency mode
     * @param _oracle address that can call the reward function
     */
    function init(
        address _liquidityProvider,
        uint8 _decimals,
        string memory _name,
        string memory _symbol,
        address _emergencyCouncil,
        address _operator,
        address _oracle
    )
        external;

    function op() external view returns (address);

    /**
     * @notice update the operator account to a new address
     * @param newOperator the address of the new operator to change to
     */
    function updateOperator(address newOperator) external;

    /**
     * @notice getter for the RNG oracle provided by `workerConfig_`
     * @return the address of the trusted oracle
     * @dev individual oracles are now recorded in the operator, this now should return the registry contract
     */
    function oracle() external view returns (address);

    /// @notice updates the reward quarantine threshold if called by the operator
    function updateRewardQuarantineThreshold(uint _maxUncheckedReward) external;

    /**
     * @notice wraps `amount` of underlying tokens into fluid tokens
     * @notice requires you to have called the ERC20 `approve` method
     * @notice targeting this contract first on the underlying asset
     *
     * @param amount the number of tokens to wrap
     * @return the number of tokens wrapped
     */
    function erc20In(uint amount) external returns (uint);

    /**
     * @notice wraps the `amount` given and transfers the tokens to `receiver`
     *
     * @param recipient of the wrapped assets
     * @param amount to wrap and send to the recipient
     */
    function erc20InFor(address recipient, uint256 amount) external;

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
    function mintLimitsEnabled() external pure returns (bool);

    /*
     * @notice returns the mint limit per user
     * @notice mint limits no longer exist, this always `uint256.max`
     */
    function userMintLimit() external pure returns (uint);

    /*
     * @notice returns the remaining global mint limit
     * @notice mint limits no longer exist, this always `uint256.max`
     */
    function remainingGlobalMintLimit() external pure returns (uint);

    /**
     * @notice return the max unchecked reward that's currently set
     */
    function maxUncheckedReward() external view returns (uint);

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
    function userAmountMinted(address /* account */) external pure returns (uint);

    /// @notice upgrade the underlying ILiquidityProvider to a new source
    function upgradeLiquidityProvider(ILiquidityProvider newPool) external;

    /// @notice drain the reward pool of the amount given without touching any principal amounts
    /// @dev this is intended to only be used to retrieve initial
    ///      liquidity provided by the team OR by the DAO to allocate funds
    function drainRewardPool(address _recipient, uint256 _amount) external;
}
