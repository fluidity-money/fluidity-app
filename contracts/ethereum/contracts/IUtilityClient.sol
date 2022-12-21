// SPDX-License-Identifier: GPL

// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

pragma solidity ^0.8.11;
pragma abicoder v2;

import "./Token.sol";

struct UtilityWinner {
    address utility;
    Winner[] winners;
}

/// @title callbacks for liquidity mining
interface IUtilityClient {
    /**
     * @notice getter for the operator (can trigger utility mining payouts
     * @return address of the operator
     */
    function operator_() external returns (address);

    /**
     * @notice utility mining callback, called when a winner occurs with a matching name
     */
    function utilityMine(UtilityWinner calldata reward) external;
}
