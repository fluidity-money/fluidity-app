// SPDX-License-Identifier: GPL

// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

pragma solidity ^0.8.11;
pragma abicoder v1;

import "./compound/CTokenInterfaces.sol";
import "./LiquidityProvider.sol";
import "./openzeppelin/SafeERC20.sol";

contract CompoundLiquidityProvider is LiquidityProvider {
    using SafeERC20 for IERC20;

    /// @dev for migrations
    uint256 private version_;

    /// @dev address that owns this pool
    address public owner_;

    /// @dev token being invested
    IERC20 public underlying_;

    CErc20Interface public compoundToken_;

    /**
     * @notice initialiser function
     *
     * @param compoundToken address of the compound cToken
     * @param owner address of the account that owns this pool
     */
    function init(
        address compoundToken,
        address owner
    ) external {
        require(version_ == 0, "contract is already initialized");
        version_ = 1;

        owner_ = owner;

        compoundToken_ = CErc20Interface(compoundToken);

        underlying_ = IERC20(compoundToken_.underlying());
        underlying_.safeApprove(address(compoundToken_), type(uint).max);
    }

    /// @inheritdoc LiquidityProvider
    function addToPool(uint amount) external {
        require(msg.sender == owner_, "only the owner can use this");

        uint mintRes = compoundToken_.mint(amount);
        require(mintRes == 0, "compound mint failed");
    }

    /// @inheritdoc LiquidityProvider
    function takeFromPool(uint amount) external {
        require(msg.sender == owner_, "only the owner can use this");

        uint redeemRes = compoundToken_.redeemUnderlying(amount);
        require(redeemRes == 0, "compound redeem failed");

        underlying_.safeTransfer(msg.sender, amount);
    }

    /// @inheritdoc LiquidityProvider
    function totalPoolAmount() external returns (uint) {
        return compoundToken_.balanceOfUnderlying(address(this));
    }
}
