// SPDX-License-Identifier: GPL

pragma solidity 0.8.11;
pragma abicoder v2;

import "../interfaces/IEmergencyMode.sol";
import "../interfaces/IERC20.sol";
import "../interfaces/IOperatorOwned.sol";

import "./BaseNativeToken.sol";
import "./GovToken.sol";

import "./LibGovernanceCalc.sol";

/// @dev default maxLockTime to use as the max amount that could be
///      locked up
uint256 constant MAX_LOCK_TIME = 365 days;

struct Lockup {
    /// @dev lockLength is the number of seconds the amount was locked up for
    uint256 lockLength;

    /// @dev fluid/fweth BPT token we're locking up
    uint256 bptAtLock;

    /// @dev lockTime is the timestamp the token was locked up at
    uint256 lockTime;
}

contract VEGovLockup is IEmergencyMode, IOperatorOwned {
    address private operator_;

    address private emergencyCouncil_;

    bool private noEmergencyMode_;

    IERC20 private voteToken_;

    mapping(address => Lockup[]) private lockups_;

    constructor(address _emergencyCouncil, IERC20 _voteToken) {
        emergencyCouncil_ = _emergencyCouncil;
        voteToken_ = _voteToken;

        noEmergencyMode_ = true;
    }

    function voteToken() public view returns (IERC20) {
        return voteToken_;
    }

    function operator() public view returns (address) {
        return operator_;
    }

    function updateOperator(address _newOperator) public {
        require(msg.sender == operator(), "only operator");
        operator_ = _newOperator;
    }

    function noEmergencyMode() public view returns (bool) {
        return noEmergencyMode_;
    }

    function emergencyCouncil() public view returns (address) {
        return emergencyCouncil_;
    }

    function enableEmergencyMode() public {
        require(msg.sender == emergencyCouncil(), "only council");
        noEmergencyMode_ = false;
    }

    function disableEmergencyMode() public {
        require(msg.sender == emergencyCouncil(), "only council");
        noEmergencyMode_ = true;
    }

    function trackNewDeposit(
        address _spender,
        uint256 _lockLength,
        uint256 _bptAtLock,
        uint256 _lockTime
    ) internal {
        Lockup memory lockup;

        lockup.lockLength = _lockLength;
        lockup.bptAtLock = _bptAtLock;
        lockup.lockTime = _lockTime;

        lockups_[_spender].push(lockup);
    }

    function currentVEGovAmount(
        uint256 _lockLength,
        uint256 _lockTime,
        uint256 _currentTime,
        uint256 _tokenAmount
    )
        public pure returns (uint256)
    {
        uint256 currentLockLength = _lockLength - _lockTime -_currentTime;
        return calcGovToVEGov(_tokenAmount, currentLockLength, MAX_LOCK_TIME);
    }

    function balanceOfUnderlying(address _spender) public view returns (uint256 amount) {
        for (uint256 i = 0; i < lockups_[_spender].length; i++)
            amount += lockups_[_spender][i].bptAtLock;

        return amount;
    }

    function balanceOf(address _spender) public view returns (uint256) {
        uint256 amounts;

        for (uint256 i = 0; i < lockups_[_spender].length; i++)
            amounts += currentVEGovAmount(
                lockups_[_spender][i].lockLength,
                lockups_[_spender][i].lockTime,
                block.timestamp, // solhint-disable-line not-rely-on-time
                lockups_[_spender][i].bptAtLock
            );

        return amounts;
    }

    function numberOfVotingPowers(address _spender) public view returns (uint256) {
        return lockups_[_spender].length;
    }

    /**
     * @notice deposit some token for the length given
     *
     * @param _bptAmount to take from the user to lock up
     *
     * @param _lockLength in seconds to lock the assets up for, used to
     *         calculate the lock time = lock length + block timestamp
     */
    function deposit(
        uint256 _bptAmount,
        uint256 _lockLength
    )
        public returns (uint256 newVEGov, uint256 powerNumber)
    {
        require(noEmergencyMode(), "emergency mode");

        require(_bptAmount > 0, "need bpt > 0");
        require(_lockLength > 0, "lock length = 0");

        require(_lockLength <= MAX_LOCK_TIME, "greater than max time");

        voteToken_.transferFrom(msg.sender, address(this), _bptAmount);

        trackNewDeposit(
            msg.sender,
            _lockLength,
            _bptAmount,
            block.timestamp // solhint-disable-line not-rely-on-time
        );

        newVEGov = balanceOf(msg.sender);

        powerNumber = numberOfVotingPowers(msg.sender);

        return (newVEGov, powerNumber);
    }

    function isPowerEmpty(uint256 _powerNumber) public view returns (bool) {
        return lockups_[msg.sender][_powerNumber].lockLength != 0;
    }

    function increaseAmount(uint256 _powerNumber, uint256 _bptAmount) public {
        require(noEmergencyMode(), "emergency mode");

        require(!isPowerEmpty(_powerNumber), "power doesn't exist");

        require(_bptAmount > 0, "need < 0");

        voteToken_.transferFrom(msg.sender, address(this), _bptAmount);

        lockups_[msg.sender][_powerNumber].bptAtLock += _bptAmount;
    }

    function increaseLockTime(uint256 _powerNumber, uint256 _extraTime) public {
        require(noEmergencyMode(), "emergency mode");

        require(!isPowerEmpty(_powerNumber), "power doesn't exist");

        lockups_[msg.sender][_powerNumber].lockLength += _extraTime;
    }
}
