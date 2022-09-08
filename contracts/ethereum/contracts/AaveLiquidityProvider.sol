// SPDX-License-Identifier: GPL

// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

pragma solidity ^0.8.11;
pragma abicoder v1;

import "./aave/ATokenInterfaces.sol";
import "./LiquidityProvider.sol";
import "./openzeppelin/SafeERC20.sol";

/// @title Liquidity provider using aave
contract AaveLiquidityProvider is LiquidityProvider {
    using SafeERC20 for IERC20;

    /// @dev for migrations
    uint256 private version_;

    /// @dev the owner of this pool
    address public owner_;

    /// @dev token being invested
    IERC20 public underlying_;
    LendingPoolAddressesProviderInterface public lendingPoolAddresses_;
    ATokenInterface public aToken_;

    /**
     * @notice initialiser function
     *
     * @param addressProvider address of the aave LendingPoolAddressesProvider contract
     * @param aToken address of the aToken
     * @param owner address of the account that owns this pool
     */
    function init(
        address addressProvider,
        address aToken,
        address owner
    ) external {
        require(version_ == 0, "contract is already initialized");
        version_ = 1;

        owner_ = owner;

        lendingPoolAddresses_ = LendingPoolAddressesProviderInterface(addressProvider);
        aToken_ = ATokenInterface(aToken);

        underlying_ = IERC20(aToken_.UNDERLYING_ASSET_ADDRESS());
    }

    /// @inheritdoc LiquidityProvider
    function addToPool(uint amount) external {
        require(msg.sender == owner_, "only the owner can use this");
        LendingPoolInterface lendingPool = LendingPoolInterface(lendingPoolAddresses_.getLendingPool());
        underlying_.safeApprove(address(lendingPool), amount);

        lendingPool.deposit(address(underlying_), amount, address(this), 0);
    }

    /// @inheritdoc LiquidityProvider
    function takeFromPool(uint amount) external {
        require(msg.sender == owner_, "only the owner can use this");
        LendingPoolInterface lendingPool = LendingPoolInterface(lendingPoolAddresses_.getLendingPool());

        uint realAmount = lendingPool.withdraw(address(underlying_), amount, address(this));
        require(amount == realAmount, "amount aave withdrew was different to requested");
        underlying_.safeTransfer(msg.sender, realAmount);
    }

    /// @inheritdoc LiquidityProvider
    function totalPoolAmount() external view returns (uint) {
        return aToken_.balanceOf(address(this));
    }
}
