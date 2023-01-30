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

    function getExchangeRate() public view returns (uint256) {
        return (block.timestamp - epochBlocktime_) * decayAmount_;
    }

    function realBalanceOf(address _spender) public view returns (uint256) {
        return balanceOf_[_spender];
    }

    function convertToRealBalance(uint256 _balance) public view returns (uint256) {
    	return _balance + getExchangeRate();
    }

    function convertFromRealBalance(uint256 _realAmount) public view returns (uint256) {
        uint256 exchangeRate = getExchangeRate();

        if (_realAmount < exchangeRate) {
            return 0;
        } else {
            return _realAmount - exchangeRate;
        }
    }

    function balanceOf(address _spender) public override view returns (uint256) {
        return convertBalance(balanceOf_[_spender]);
    }
}
