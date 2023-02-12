// SPDX-License-Identifier: GPL

pragma solidity 0.8.11;
pragma abicoder v2;

function calcGovToVEGov(
    uint256 _fluidAmount,
    uint256 _lockTime,
    uint256 _maxLockTime
)
    pure returns (uint256)
{
    // (FLUID * lock time) / max lock time
    return (_fluidAmount * _lockTime) / _maxLockTime;
}

function calculateLinearDecay(
    uint256 _VEFluidAtLock,
    uint256 _lockTime,
    uint256 _timeSinceLockInDays
)
    pure returns (uint256)
{
    // ((veFLUID at lock / lock time) * x) + veFLUID at lock
    return ((_VEFluidAtLock / _lockTime) * _timeSinceLockInDays) + _VEFluidAtLock;
}

/// @notice calculateMaxLiquidityBackInPercentage to calculate
///         the percentage of liquidity to return to the user
function calculateMaxLiquidityBackInPercentage(
    uint256 _timeSinceLockInDays,
    uint256 _lockTime
)
    pure returns (uint256)
{
    return _timeSinceLockInDays / _lockTime;
}
