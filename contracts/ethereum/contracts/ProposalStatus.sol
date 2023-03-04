// SPDX-License-Identifier: GPL

pragma solidity 0.8.16;
pragma abicoder v2;

enum ProposalStatus {
    UNFINISHED,
    FROZEN,
    SUCCEEDED,
    EXECUTED,
    FAILED,
    KILLED
}
