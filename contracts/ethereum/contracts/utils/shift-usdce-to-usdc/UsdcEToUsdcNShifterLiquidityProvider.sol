// SPDX-License-Identifier: GPL

// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

pragma solidity 0.8.16;
pragma abicoder v2;

import "../../openzeppelin/SafeERC20.sol";

import "../../../contracts/Token.sol";

import "../../../interfaces/IERC20.sol";
import "../../../interfaces/ILiquidityProvider.sol";

import "./IWombatRouter.sol";
import "./IWombatPool2.sol";

import "./IGMXSwapRouter.sol";

import "hardhat/console.sol";

uint256 constant MAX_UINT256 = type(uint256).max;

/**
 * UsdcEToUsdcNShifterLiquidityProvider takes usdce assets provided with
 * addToPool, uses Uniswap to swap them, then changes the underlying to
 * point to usdc. Intended to be deployed, used and cast aside in one big
 * transaction. Includes a rescue function * JUST IN CASE * something
 * weird happens (this should be set to the gnosis safe).
*/
contract UsdcEToUsdcNShifterLiquidityProvider is ILiquidityProvider {
    using SafeERC20 for IERC20;

    /**
     * @notice rescuer_ that should be used if the contract for some
     *         reason is not able to work properly but executes anyway.
     *         may be used by the caller to transfer ownership after
     */
    address immutable public rescuer_;

    /// @notice deadline_ to enforce that this transaction happens by
    uint256 immutable public deadline_;

    IGMXSwapRouter public swapRouter_ = IGMXSwapRouter(0xaBBc5F99639c9B6bCb58544ddf04EFA6802F4064);

    /// @notice owner_ of the liquidityprovider (Token) address
    address immutable public owner_;

    /// @notice usdce_ address to use as the bridged version of USDC
    IERC20 immutable public usdce_ = IERC20(0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8);

    /// @notice usdcn_ to point to as the version recently deployed by circle
    IERC20 immutable public usdcn_ = IERC20(0xaf88d065e77c8cC2239327C5EDb3A432268e5831);

    /// @notice hasShifted_ over the asset from usdce to usdc?
    bool private hasShifted_;

    constructor(
        address _rescuer,
        uint256 _deadline,
        address _owner
    ) {
        rescuer_ = _rescuer;
        deadline_ = _deadline;
        owner_ = _owner;
        usdce_.safeApprove(address(swapRouter_), MAX_UINT256);
        usdcn_.safeApprove(address(swapRouter_), MAX_UINT256);
    }

    /// @notice underlying_ quotes a different token depending on whether it
    ///         has transferred usdce to usdc
    function underlying_() public view returns (IERC20) {
        return hasShifted_ ? usdcn_ : usdce_ ;
    }

    function rescue(Token _token) public {
        require(msg.sender == rescuer_, "only rescuer");
        usdce_.safeTransfer(rescuer_, usdce_.balanceOf(address(this)));
        usdcn_.safeTransfer(rescuer_, usdcn_.balanceOf(address(this)));
        _token.updateOperator(rescuer_);
    }

    function addToPool(uint256 _amount) public {
        require(msg.sender == owner_, "only owner");

        address[] memory tokenIn = new address[](2);
        tokenIn[0] =  address(usdce_);
        tokenIn[1] = address(usdcn_);

        swapRouter_.swap(
            tokenIn,
            _amount,
            0,
            address(this)
        );

        hasShifted_ = true;
    }

    function totalPoolAmount() external view returns (uint256) {
        require(hasShifted_, "hasn't shifted");
        return usdcn_.balanceOf(address(this));
    }

    function takeFromPool(uint256 _amount) public {
        require(msg.sender == owner_, "only owner");
        require(hasShifted_, "hasn't shifted");

        usdcn_.safeTransfer(owner_, _amount);
    }
}
