// SPDX-License-Identifier: GPL

pragma solidity 0.8.11;
pragma abicoder v2;

/// @notice calcGovToVEGov
/// @param _tokenAmount to lock up
/// @param _lockLength is the amount of time the user is locking the token for (ie, 10 days)
/// @param _maxLockLength in example, is 1 year that we can lock it up for
function calcGovToVEGov(
    uint256 _tokenAmount,
    uint256 _lockLength,
    uint256 _maxLockLength
)
    pure returns (uint256)
{
    // ie, 1000, 365 days, 365 days = 1000
    // (FLUID * lock time) / max lock time
    return (_tokenAmount * _lockLength) / _maxLockLength;
}
