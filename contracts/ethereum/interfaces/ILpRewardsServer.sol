// SPDX-License-Identifier: GPL

// Copyright 2023 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

pragma solidity 0.8.16;
pragma abicoder v2;

struct LpRewards {
    address token;
    uint amount;
}

interface ILpRewardsServer {
    function reward(address _user, LpRewards[] memory _rewards) external;
}
