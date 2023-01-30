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

    function calculateExchangeRate() public view returns (uint256) {
        return epochBlocktime_ - block.timestamp * decayAmount_;
    }

    function balanceOf(address _spender) public override view returns (uint256) {
        uint256 exchangeRate = calculateExchangeRate();

        if (balanceOf_[_spender] < exchangeRate) {
            return 0;
        } else {
            return balanceOf_[_spender] - exchangeRate;
        }
    }
}
