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

    /**
     * @notice emitted when a gauge resets
     * @param timestamp the timestamp of the reset
     */
    event UtilityGaugesReset(uint256 indexed timestamp);

    /**
     * @notice emitted when a user places votes into a gauge
     *
     * @param token the address of the token being voted for
     * @param gauge the name of the gauge being voted for
     * @param user the user voting
     * @param weight the amount of votes the user is placing
     * @param gaugeWeight the amount of votes that are now in the gauge in total
     * @param totalWeight the amount of votes that are now placed in total
     */
    event Voted(
        address indexed token,
        string indexed gauge,
        address indexed user,
        uint256 weight,
        uint256 gaugeWeight,
        uint256 totalWeight
    );

    /**
     * @notice emitted when a new gauge is added
     *
     * @param token the token the gauge is for
     * @param gauge the name of the utility the gauge is for
     */
    event NewGauge(address indexed token, string indexed gauge);

    /// @dev votes and reset info for the weights_ map
    struct GaugeWeight {
        uint256 weight;
        uint256 lastReset;
    }

    /// @dev votes and reset info for the userAmountVoted_ map
    struct UserVotes {
        uint256 votes;
        uint256 lastReset;
    }

    /**
    * @dev operator_ able to access the permissioned functions on this
    * UtilityGauges (note: not Operator)
    */
    address private operator_;

    IVEGovLockup private lockupSource_;

    /// @dev timestamp (!!) of the last reset
    uint256 public lastReset_;

    /// @dev token address => utility => voting
    mapping (address => mapping (string => GaugeWeight)) private weights_;

    /// @dev user address => voting
    mapping (address => UserVotes) private userAmountVoted_;

    /// @dev total number of votes placed
    uint256 private totalWeight_;

    /// @dev list of utility gauges in the weights_ map
    /// @dev strictly equal to the keys of weights_
    GaugeId[] private gaugesList_;

    constructor(address _operator, IVEGovLockup _lockupSource) {
        operator_ = _operator;
        lockupSource_ = _lockupSource;
    }

    /// @inheritdoc IOperatorOwned
    function operator() public view returns (address) {
        return operator_;
    }

    function lockupSource() public view returns (address) {
        return address(lockupSource_);
    }

    function updateOperator(address _newOperator) public {
        require(msg.sender == operator(), "only operator");
        require(_newOperator != address(0), "zero operator");

        emit IOperatorOwned.NewOperator(operator_, _newOperator);

        operator_ = _newOperator;
    }

    /// @dev updates the lastReset_ variable
    /// @dev must be called before lastReset_ or totalWeight_ are used!
    function _checkEpoch() internal {
        if (block.timestamp <= (lastReset_ + GAUGE_EPOCH_LENGTH)) {
            // nothing to do
            return;
        }

        // calculate how many epochs we're ahead by, and only move forward by that length
        // (round down to the number of epochs)

        // how much time we're ahead by
        uint256 delta = block.timestamp - lastReset_;
        // how many epochs we're ahead by
        uint256 deltaEpochs = delta / GAUGE_EPOCH_LENGTH;
        // how much time those epochs covered (rounded down)
        uint256 deltaEpochsTime = deltaEpochs * GAUGE_EPOCH_LENGTH;

        lastReset_ = lastReset_ + deltaEpochsTime;
        totalWeight_ = 0;

        emit UtilityGaugesReset(lastReset_);
    }

    /// @inheritdoc IUtilityGauges
    function balanceOf(address spender) public returns (uint256) {
        _checkEpoch();

        return _votesAvailableStale(spender);
    }

    /// @inheritdoc IUtilityGauges
    function votesAvailable() public returns (uint256) {
        return balanceOf(msg.sender);
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

    /// @inheritdoc IUtilityGauges
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

        emit Voted(token, gauge, msg.sender, weight, data.weight, totalWeight_);
    }

    function _getWeightStale(address token, string memory gauge) internal view returns (uint256) {
        GaugeWeight memory data = weights_[token][gauge];

        if (data.lastReset < lastReset_) {
            return 0;
        } else {
            return data.weight;
        }
    }

    /// @inheritdoc IUtilityGauges
    function getWeight(address token, string memory gauge) public returns (uint256, uint256) {
        _checkEpoch();

        uint256 weight = _getWeightStale(token, gauge);

        return (weight, totalWeight_);
    }

    /// @inheritdoc IUtilityGauges
    function getAllWeights() public returns (GaugeInfo[] memory, uint256, uint256, uint256) {
        _checkEpoch();

        GaugeInfo[] memory gauges = new GaugeInfo[](gaugesList_.length);

        for (uint i = 0; i < gaugesList_.length; i++) {
            gauges[i] = GaugeInfo({
                id: gaugesList_[i],
                votes: _getWeightStale(gaugesList_[i].token, gaugesList_[i].gauge)
            });
        }

        return (gauges, totalWeight_, lastReset_, lastReset_ + GAUGE_EPOCH_LENGTH);
    }

    /// @inheritdoc IUtilityGauges
    function addUtility(address token, string memory gauge) public {
        require(msg.sender == operator(), "operator only");
        _checkEpoch();

        GaugeWeight storage data = weights_[token][gauge];

        require(data.lastReset == 0, "utility gauge already exists");

        data.lastReset = lastReset_;

        gaugesList_.push(GaugeId({
            token: token,
            gauge: gauge
        }));

        emit NewGauge(token, gauge);
    }

    /// @inheritdoc IUtilityGauges
    function removeUtility(address token, string memory gauge) public {
        require(msg.sender == operator(), "operator only");
        _checkEpoch();

        GaugeWeight storage data = weights_[token][gauge];
        require(data.lastReset != 0, "utility gauge doesn't exist");

        // remove the gauge from the total weight
        uint gaugeWeight = _getWeightStale(token, gauge);
        totalWeight_ -= gaugeWeight;

        delete weights_[token][gauge];

        // for string comparison
        bytes32 gaugeNameId = keccak256(abi.encodePacked(gauge));

        // remove the id from our list
        for (uint i = 0; i < gaugesList_.length; i++) {
            GaugeId storage id = gaugesList_[i];

            if (id.token == token && keccak256(abi.encodePacked(id.gauge)) == gaugeNameId) {
                // swap the gauge being removed and the last gauge
                gaugesList_[i] = gaugesList_[gaugesList_.length - 1];

                // delete the last gauge
                gaugesList_.pop();

                return;
            }
        }

        // otherwise we didn't find the gauge in our list!
        revert("gauge not found in list!");
    }

    function updateLockupGauge(IVEGovLockup _newLockup) public {
        require(msg.sender == operator_, "only operator");

        lockupSource_ = _newLockup;
    }
}
