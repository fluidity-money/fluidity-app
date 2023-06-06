// SPDX-License-Identifier: GPL

// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

pragma solidity 0.8.16;
pragma abicoder v2;

/// @notice TestCamelotPair does not implement ICamelotPair
contract TestCamelotPair {
    function balanceOf(address /* _spender */) public pure returns (uint256) {
        revert("test client");
    }
}
