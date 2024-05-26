// SPDX-License-Identifier: GPL

// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

pragma solidity 0.8.16;
pragma abicoder v2;

import "../interfaces/ILiquidityProvider.sol";
import "../interfaces/IToken.sol";

import "./openzeppelin/SafeERC20.sol";

contract AutoIncreaseLiquidityProvider is ILiquidityProvider {
    using SafeERC20 for IERC20;

    /// @dev for migrations
    uint256 private version_;

    /// @dev token being invested
    IERC20 public underlying_;

    /// @dev fluid token
    IToken public fluid_;

    /// @dev deploymentTs of this contract
    uint256 public deploymentTs_;

    /// @dev amount to increase the prize pool by per second
    uint256 public increaseAmount_;

    /// @dev amountTaken_ from the pool so far
    uint256 public amountTaken_;

    /**
     * @notice initialiser function
     *
     * @param _underlying token that's being supported, ie USDC
     * @param _token address of the fluid token
     * @param _increaseAmount to increase the amount in the prize pool by every second
     */
    function init(
        address _underlying,
        address _token,
        uint256 _increaseAmount
    ) external {
        require(version_ == 0, "contract is already initialised");
        require(_token != address(0), "token is empty");

        version_ = 1;

        fluid_ = IToken(_token);
        increaseAmount_ = _increaseAmount;
        deploymentTs_ = block.timestamp;
        underlying_ = IERC20(_underlying);
    }

    /// @inheritdoc ILiquidityProvider
    function addToPool(uint /* _amount */) external view {
    }

    /// @inheritdoc ILiquidityProvider
    function takeFromPool(uint _amount) external {
        require(msg.sender == address(fluid_), "only the owner can use this");
        amountTaken_ += _amount;
        underlying_.safeTransfer(msg.sender, _amount);
    }

    /// @inheritdoc ILiquidityProvider
    function totalPoolAmount() external view returns (uint) {
        uint secsSince = block.timestamp - deploymentTs_;
        uint256 fluidBalance = (secsSince * increaseAmount_) - amountTaken_;
        return fluidBalance;
    }

    function owner_() public view returns (address) {
        return address(fluid_);
    }
}
