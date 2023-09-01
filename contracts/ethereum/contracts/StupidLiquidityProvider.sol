// SPDX-License-Identifier: GPL

// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

pragma solidity 0.8.16;
pragma abicoder v2;

import "../interfaces/ILiquidityProvider.sol";
import "../interfaces/IToken.sol";

import "./openzeppelin/SafeERC20.sol";

contract StupidLiquidityProvider is ILiquidityProvider {
    using SafeERC20 for IERC20;

    /// @dev for migrations
    uint256 private version_;

    /// @dev token being invested
    IERC20 public underlying_;

    /// @dev fluid token
    IToken public fluid_;

    /**
     * @notice initialiser function
     *
     * @param _underlying token that's being supported, ie USDC
     * @param _token address of the fluid token
     */
    function init(
        address _underlying,
        address _token
    ) external {
        require(version_ == 0, "contract is already initialised");
        require(_token != address(0), "token is empty");

        version_ = 1;

        fluid_ = IToken(_token);

        underlying_ = IERC20(_underlying);
    }

    /// @inheritdoc ILiquidityProvider
    function addToPool(uint /* _amount */) external view {
        require(msg.sender == address(fluid_), "only the owner can use this");
    }

    /// @inheritdoc ILiquidityProvider
    function takeFromPool(uint _amount) external {
        require(msg.sender == address(fluid_), "only the owner can use this");
        underlying_.safeTransfer(msg.sender, _amount);
    }

    /// @inheritdoc ILiquidityProvider
    function totalPoolAmount() external returns (uint) {
        uint fluidBalance = fluid_.balanceOf(address(this));

        fluid_.burnFluidWithoutWithdrawal(fluidBalance);

        return underlying_.balanceOf(address(this));
    }

    function owner_() public view returns (address) {
        return address(fluid_);
    }
}
