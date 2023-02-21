// SPDX-License-Identifier: GPL

// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

pragma solidity ^0.8.11;
pragma abicoder v2;

import "../interfaces/ILiquidityProvider.sol";
import "../interfaces/aave/IAToken.sol";
import "../interfaces/aaveV3/ATokenInterfaces.sol";

import "./openzeppelin/SafeERC20.sol";

/// @title Liquidity provider using aave V3 pools
contract AaveV3LiquidityProvider is ILiquidityProvider {
    using SafeERC20 for IERC20;

    /// @dev for migrations
    uint256 private version_;

    /// @dev the owner of this pool
    address public owner_;

    /// @dev token being invested
    IERC20 public underlying_;

    PoolAddressesProviderInterface public poolAddresses_;

    IAToken public aToken_;

    /**
     * @notice initialiser function
     *
     * @param _addressProvider address of the aave
     *         LendingPoolAddressesProvider contract
     *
     * @param _aToken address of the aToken
     * @param _owner address of the account that owns this pool
     */
    function init(
        address _addressProvider,
        address _aToken,
        address _owner
    ) external {
        require(version_ == 0, "contract is already initialized");

        version_ = 1;

        owner_ = _owner;

        poolAddresses_ = PoolAddressesProviderInterface(_addressProvider);

        aToken_ = IAToken(_aToken);

        underlying_ = IERC20(aToken_.UNDERLYING_ASSET_ADDRESS());
    }

    /// @inheritdoc ILiquidityProvider
    function addToPool(uint _amount) external {
        require(msg.sender == owner_, "only the owner can use this");

        PoolInterface pool = PoolInterface(poolAddresses_.getPool());

        underlying_.safeApprove(address(pool), _amount);

        pool.supply(address(underlying_), _amount, address(this), 0);
    }

    /// @inheritdoc ILiquidityProvider
    function takeFromPool(uint _amount) external {
        require(msg.sender == owner_, "only the owner can use this");

        PoolInterface pool = PoolInterface(poolAddresses_.getPool());

        uint realAmount = pool.withdraw(address(underlying_), _amount, address(this));

        require(
            _amount == realAmount,
            "amount aave withdrew was different to requested"
        );

        underlying_.safeTransfer(msg.sender, realAmount);
    }

    /// @inheritdoc ILiquidityProvider
    function totalPoolAmount() external view returns (uint) {
        return aToken_.balanceOf(address(this));
    }
}
