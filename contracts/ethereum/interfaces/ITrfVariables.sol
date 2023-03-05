// SPDX-License-Identifier: GPL

// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

pragma solidity 0.8.16;
pragma abicoder v2;

/// @dev TrfVariables that the worker uses in it's configuration
///      (previously in the database)
struct TrfVariables {
    uint256 currentAtxTransactionMargin;
    uint256 defaultTransfersInBlock;
    uint256 spoolerInstantRewardThreshold;
    uint256 spoolerBatchedRewardThreshold;

    uint8 defaultSecondsSinceLastBlock;
    uint8 atxBufferSize;
}
