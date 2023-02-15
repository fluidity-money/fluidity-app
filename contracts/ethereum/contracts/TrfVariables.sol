// SPDX-License-Identifier: GPL

pragma solidity ^0.8.11;
pragma abicoder v2;

struct TrfVariables {
    uint256 currentAtxTransactionMargin;
    uint256 defaultTransfersInBlock;
    uint256 spoolerInstantRewardThreshold;
    uint256 spoolerBatchedRewardThreshold;

    uint8 defaultSecondsSinceLastBlock;
    uint8 atxBufferSize;
}
