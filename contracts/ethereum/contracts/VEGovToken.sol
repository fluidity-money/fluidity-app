// SPDX-License-Identifier: GPL
pragma solidity 0.8.11;
pragma abicoder v2;

import "./BaseNativeToken.sol";
import "./GovToken.sol";

contract VEGovToken is BaseNativeToken {
    /// @dev decayAmount_ to take from everyone's tokens as time progresses
    uint256 decayAmount_;

    /// @dev epochBlockTime_ to use in the calculation of the decay amount
    uint256 epochBlocktime_;

    GovToken govToken_;

    /// @dev balanceOf_ is used to maintain the balances that are
    ///      reduced by the exchange rate (the actual value here is used to
    ///      calculate the amount that can be redeemed by a user into the
    ///      governance token)
    mapping(address => uint256) private balanceOf_;

    function calculateGovToVEGov(uint256 _fluidAmount, uint256 _lockTime, uint256 _maxLockTime) public pure returns (uint256) {
        return (_fluidAmount * _lockTime) / _maxLockTime;
    }

    function calculateLinearDecay(uint256 _VEFluidAtLock, uint256 _lockTime, uint256 _timeSinceLockInDays) public pure returns (uint256) {
        return ((_VEFluidAtLock / _lockTime) * _timeSinceLockInDays) + _VEFluidAtLock;
    }

    function calculateMaxLiquidityBack(uint256 _timeSinceLockInDays, uint256 _lockTime) public pure returns (uint256) {
        return _timeSinceLockInDays / _lockTime;
    }

    function realBalanceOf(address _spender) public view returns (uint256) {
        return balanceOf_[_spender];
    }

    function convertToRealBalance(uint256 _balance) public view returns (uint256) {
    	return _balance + getExchangeRate();
    }
}
