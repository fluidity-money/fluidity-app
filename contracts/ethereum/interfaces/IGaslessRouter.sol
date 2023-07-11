// SPDX-License-Identifier: GPL

// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

pragma solidity 0.8.16;
pragma abicoder v2;

import "./IToken.sol";

interface IGaslessRouter {
    /**
     * @notice gasless erc20In for EOAs if the underlying asset supports permit
     * @dev vrs should be signature of (owner, amount in, the
     *      deadline, the address of the token) - this is given to the
     *      underlying IERC2612 contract
     * @param _owner of the token
     * @param _amountIn to wrap in with erc20In
     * @param _deadline to have this transaction execute by
     * @param _v
     * @param _r
     * @param _s
     */
    function erc20InGasless(
        address _owner,
        uint256 _amountIn,
        uint256 _deadline,
        IToken _token,
        uint8 _v,
        bytes32 _r,
        bytes32 _s
    ) external returns (uint256 amountIn);
}
