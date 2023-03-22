// SPDX-License-Identifier: GPL

// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

pragma solidity 0.8.16;
pragma abicoder v2;

import "../interfaces/IUtilityGauges.sol";
import "../interfaces/IVEGovLockup.sol";
import "../interfaces/IOperatorOwned.sol";

contract UtilityGauges is IUtilityGauges, IOperatorOwned {
    uint256 constant GAUGE_EPOCH_LENGTH = 7 days;

    event UtilityGaugesReset(uint256 indexed timestamp);
    event Voted(
        address indexed token,
        string indexed gauge,
        address indexed user,
        uint256 weight,
        uint256 gaugeWeight
    );
    event NewGauge(address indexed token, string indexed gauge);

    struct GaugeWeight {
        uint256 weight;
        uint256 lastReset;
    }

    struct UserVotes {
        uint256 votes;
        uint256 lastReset;
    }

    uint8 private version_;

    /**
    * @dev operator_ able to access the permissioned functions on this
    * UtilityGauges (note: not Operator)
    */
    address private operator_;

    IVEGovLockup lockupSource_;

    uint256 lastReset_;

    /// @dev token address => utility => voting
    mapping (address => mapping (string => GaugeWeight)) weights_;

    mapping (address => UserVotes) userAmountVoted_;

    uint256 totalWeight_;

    function init(address _operator, IVEGovLockup _lockupSource) public {
        require(version_ == 0, "already deployed");

        operator_ = _operator;
        lockupSource_ = _lockupSource;

        version_ = 1;
    }

    function operator() public view returns (address) {
        return operator_;
    }

    function updateOperator(address _newOperator) public {
        require(msg.sender == operator(), "only operator");
        require(_newOperator != address(0), "zero operator");

        operator_ = _newOperator;
    }

    /// @dev updates the lastReset_ variable
    /// @dev must be called before lastReset_ or totalWeight_ are used!
    function _checkEpoch() internal {
        if (block.timestamp > lastReset_ + GAUGE_EPOCH_LENGTH) {
            // calculate how many epochs we're ahead by, and only move forward by that length

            // how much time we're ahead by
            uint256 delta = block.timestamp - lastReset_;
            // how many epochs we're ahead by
            uint256 deltaEpochs = delta / GAUGE_EPOCH_LENGTH;
            // how much time those epochs covered
            uint256 deltaEpochsTime = deltaEpochs * GAUGE_EPOCH_LENGTH;

            lastReset_ = lastReset_ + deltaEpochsTime;
            totalWeight_ = 0;

            emit UtilityGaugesReset(lastReset_);
        }
    }

    function votesAvailable(address spender) public returns (uint256) {
        _checkEpoch();

        return _votesAvailableStale(spender);
    }

    function votesAvailable() public returns (uint256) {
        return votesAvailable(msg.sender);
    }

    /// @dev gets the amount of user votes without updating the global epoch
    /// @dev only use this if you're sure _checkEpoch() has been called this block
    function _votesAvailableStale(address spender) internal returns (uint256) {
        UserVotes storage votes = userAmountVoted_[spender];

        if (votes.lastReset < lastReset_) {
            votes.votes = 0;
            votes.lastReset = lastReset_;
        }

        uint256 votesSpent = votes.votes;
        uint256 totalVotesAvailable = lockupSource_.balanceOf(spender);

        if (votesSpent > totalVotesAvailable) {
            return 0;
        }

        return totalVotesAvailable - votesSpent;
    }

    /**
     * @notice adds votes to a token/utility pair
     *
     * @param token the address of the fluid token
     * @param gauge the name of the utility
     * @param weight the number of votes to add
     */
    function vote(address token, string memory gauge, uint256 weight) public {
        _checkEpoch();

        require(_votesAvailableStale(msg.sender) >= weight, "not enough votes");

        GaugeWeight storage data = weights_[token][gauge];

        require(data.lastReset != 0, "utility gauge doesn't exist");

        if (data.lastReset < lastReset_) {
            data.weight = weight;
            data.lastReset = lastReset_;
        } else {
            data.weight += weight;
        }

        userAmountVoted_[msg.sender].votes += weight;
        totalWeight_ += weight;

        emit Voted(token, gauge, msg.sender, weight, data.weight);
    }

    /**
     * @notice gets the ratio of votes in a specific gauge
     *
     * @param token the address of the fluid token
     * @param gauge the name of the utility
     *
     * @return pair of (number of votes in that utility, number of votes total)
     */
    function getWeight(address token, string memory gauge) public returns (uint256, uint256) {
        _checkEpoch();

        GaugeWeight memory data = weights_[token][gauge];

        uint256 weight;

        if (data.lastReset < lastReset_) {
            weight = 0;
        } else {
            weight = data.weight;
        }

        return (weight, totalWeight_);
    }

    /**
     * @notice operator only, adds a new utility to be voted on
     *
     * @param token the address of the fluid token
     * @param gauge the name of the utility
     */
    function addUtility(address token, string memory gauge) public {
        require(msg.sender == operator(), "operator only");

        GaugeWeight storage data = weights_[token][gauge];

        require(data.lastReset == 0, "utility gauge already exists");

        data.lastReset = lastReset_;

        emit NewGauge(token, gauge);
    }
}
