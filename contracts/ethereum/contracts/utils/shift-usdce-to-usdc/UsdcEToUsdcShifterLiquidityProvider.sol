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

import "hardhat/console.sol";

uint256 constant MAX_UINT256 = type(uint256).max;

interface IUniswapV3SwapRouter {
    struct ExactInputSingleParams {
        address tokenIn;
        address tokenOut;
        uint24 fee;
        address recipient;
        uint256 deadline;
        uint256 amountIn;
        uint256 amountOutMinimum;
        uint160 sqrtPriceLimitX96;
    }

    function exactInputSingle(
        ExactInputSingleParams calldata _params
    ) external returns (uint256 amountOut);
}

/**
 * UsdcEToUsdcShifterLiquidityProvider takes usdce assets provided with
 * addToPool, uses Uniswap to swap them, then changes the underlying to
 * point to usdc. Intended to be deployed, used and cast aside in one big
 * transaction. Includes a rescue function * JUST IN CASE * something
 * weird happens (this should be set to the gnosis safe).
*/
contract UsdcEToUsdcShifterLiquidityProvider is ILiquidityProvider {
    using SafeERC20 for IERC20;

    /**
     * @notice rescuer_ that should be used if the contract for some
     *         reason is not able to work properly but executes anyway.
     *         may be used by the caller to transfer ownership after
     */
    address immutable public rescuer_;

    /// @notice deadline_ to enforce that this transaction happens by
    uint256 immutable public deadline_;

    /// @notice router_ to use to swap the assets over
    IUniswapV3SwapRouter immutable public router_;

    /// @notice owner_ of the liquidityprovider (Token) address
    address immutable public owner_;

    /// @notice usdce_ address to use as the bridged version of USDC
    IERC20 immutable public usdce_;

    /// @notice usdc_ to point to as the version recently deployed by circle
    IERC20 immutable public usdc_;

    /// @notice hasShifted_ over the asset from usdce to usdc?
    bool private hasShifted_;

    constructor(
        address _rescuer,
        uint256 _deadline,
        IUniswapV3SwapRouter _router,
        address _owner,
        IERC20 _usdce,
        IERC20 _usdc
    ) {
        rescuer_ = _rescuer;
        deadline_ = _deadline;
        router_ = _router;
        owner_ = _owner;
        usdce_ = _usdce;
        usdc_ = _usdc;

        usdce_.safeApprove(address(router_), MAX_UINT256);
        usdc_.safeApprove(address(router_), MAX_UINT256);
    }

    /// @notice underlying_ quotes a different token depending on whether it
    ///         has transferred usdce to usdc
    function underlying_() public view returns (IERC20) {
        return hasShifted_ ? usdc_ : usdce_ ;
    }

    function rescue(Token _token) public {
        require(msg.sender == rescuer_, "only rescuer");
        usdce_.safeTransfer(rescuer_, usdce_.balanceOf(address(this)));
        usdc_.safeTransfer(rescuer_, usdc_.balanceOf(address(this)));
        _token.updateOperator(rescuer_);
    }

    function addToPool(uint256 _amount) public {
        require(msg.sender == owner_, "only owner");

        console.logBytes(abi.encodeWithSelector(IUniswapV3SwapRouter.exactInputSingle.selector,
            IUniswapV3SwapRouter.ExactInputSingleParams({
                tokenIn: address(usdce_),
                tokenOut: address(usdc_),
                fee: 3,
                recipient: address(this),
                deadline: MAX_UINT256,
                amountIn: _amount,
                amountOutMinimum: 0, // presumably enforced by the callee given the context
                sqrtPriceLimitX96: 0 // TODO
            }))
        );

        console.log("router address", address(router_));

        router_.exactInputSingle(IUniswapV3SwapRouter.ExactInputSingleParams({
            tokenIn: address(usdce_),
            tokenOut: address(usdc_),
            fee: 3,
            recipient: address(this),
            deadline: deadline_,
            amountIn: _amount,
            amountOutMinimum: 0, // presumably enforced by the callee given the context
            sqrtPriceLimitX96: 0 // TODO
        }));

        hasShifted_ = true;
    }

    function totalPoolAmount() external view returns (uint256) {
        require(hasShifted_, "hasn't shifted");
        return usdc_.balanceOf(address(this));

    }

    function takeFromPool(uint256 _amount) public {
        require(msg.sender == owner_, "only owner");
        require(hasShifted_, "hasn't shifted");

        usdc_.safeTransfer(owner_, _amount);
    }
}
