// SPDX-License-Identifier: GPL

// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

pragma solidity ^0.8.11.0;
pragma abicoder v2;

import "../interfaces/compound/CTokenInterfaces.sol";
import "../interfaces/ILiquidityProvider.sol";

import "./openzeppelin/SafeERC20.sol";

contract CompoundLiquidityProvider is ILiquidityProvider {
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
     * @param _compoundToken address of the compound cToken
     * @param _owner address of the account that owns this pool
     */
    function init(
        address _compoundToken,
        address _owner
    ) external {
        require(version_ == 0, "contract is already initialised");

        version_ = 1;

        owner_ = _owner;

        compoundToken_ = CErc20Interface(_compoundToken);

        underlying_ = IERC20(compoundToken_.underlying());

        underlying_.safeApprove(address(compoundToken_), type(uint).max);
    }

    /// @inheritdoc ILiquidityProvider
    function addToPool(uint _amount) external {
        require(msg.sender == owner_, "only the owner can use this");

        uint mintRes = compoundToken_.mint(_amount);

        require(mintRes == 0, "compound mint failed");
    }

    /// @inheritdoc ILiquidityProvider
    function takeFromPool(uint _amount) external {
        require(msg.sender == owner_, "only the owner can use this");

        uint redeemRes = compoundToken_.redeemUnderlying(_amount);

        require(redeemRes == 0, "compound redeem failed");

        underlying_.safeTransfer(msg.sender, _amount);
    }

    /// @inheritdoc ILiquidityProvider
    function totalPoolAmount() external returns (uint) {
        return compoundToken_.balanceOfUnderlying(address(this));
    }
}
