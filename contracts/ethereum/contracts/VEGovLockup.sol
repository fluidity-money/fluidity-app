// SPDX-License-Identifier: GPL

pragma solidity 0.8.11;
pragma abicoder v2;

import "./BaseNativeToken.sol";
import "./GovToken.sol";

import "./IERC20.sol";
import "./IEmergencyMode.sol";

import { calcGovToVEGov } from "./LibGovernanceCalc.sol";

/// @dev default maxLockTime to use as the max amount that could be
///      locked up
uint256 constant MAX_LOCKUP_TIME = 365 days;

struct Lockup {
    /// @dev lockLength is the number of seconds the amount was locked up for
    uint256 lockLength;

    /// @dev fluid/fweth BPT token we're locking up
    uint256 bptAtLock;

    /// @dev lockTime is the timestamp the token was locked up for
    uint256 lockTime;
}

contract VEGovLockup is IEmergencyMode {
    uint8 version_;

    address operator_;

    address emergencyCouncil_;

    bool noEmergencyMode_;

    IERC20 balancerPoolToken_;

    mapping(address => Lockup) lockups_;

    function init(
        address _operator,
        address _emergencyCouncil,
        IERC20 _balancerPoolToken
    )
        public
    {
        require(version_ == 0, "contract is already initialised");

        operator_ = _operator;
        emergencyCouncil_ = _emergencyCouncil;
        balancerPoolToken_ = _balancerPoolToken;
    }

    function operator() public view returns (address) {
        return operator_;
    }

    function operatorOrEmergencyCouncil() public view returns (bool) {
        return msg.sender == operator() || msg.sender == emergencyCouncil_;
    }

    function noEmergencyMode() public view returns (bool) {
        return noEmergencyMode_;
    }

    function enableEmergencyMode() public {
        require(operatorOrEmergencyCouncil(), "can't enable emergency mode!");
        noEmergencyMode_ = false;
    }

    function disableEmergencyMode() public {
        require(msg.sender == operator(), "only the operator account can use this");
        noEmergencyMode_ = true;
    }

    function hasLockedUp(address _user) public view returns (bool) {
        return lockups_[_user].lockLength > 0;
    }

    function trackDeposit(
        address _spender,
        uint256 _lockLength,
        uint256 _bptAtLock,
        uint256 _lockTime
    )
        internal
    {
        lockups_[_spender].lockLength = _lockLength;
        lockups_[_spender].bptAtLock = _bptAtLock;
        lockups_[_spender].lockTime = _lockTime;
    }

    function daysSinceLocked(
        uint256 _lockTime,
        uint256 _currentTime
    )
        public pure returns (uint256)
    {
        return _lockTime - _currentTime;
    }

    function currentVEGovAmount(
        uint256 _lockLength,
        uint256 _lockTime,
        uint256 _currentTime,
        uint256 _tokenAmount
    )
        public pure returns (uint256)
    {
        uint256 currentLockLength = _lockLength - daysSinceLocked(_lockTime, _currentTime);
        return calcGovToVEGov(_tokenAmount, currentLockLength, MAX_LOCKUP_TIME);
    }

    function lockLengthOf(address _spender) public view returns (uint256) {
        return lockups_[_spender].lockLength;
    }

    function lockTimeOf(address _spender) public view returns (uint256) {
        return lockups_[_spender].lockTime;
    }

    function currentVEGovAmountOfAtWith(
        address _spender,
        uint256 _time,
        uint256 _token
    )
        public view returns (uint256)
    {
        return currentVEGovAmount(
            lockLengthOf(_spender),
            lockTimeOf(_spender),
            _time,
            _token
        );
    }

    function balanceOfUnderlying(address _spender) public view returns (uint256) {
        return lockups_[_spender].bptAtLock;
    }

    function balanceOf(address _spender) public view returns (uint256) {
        return currentVEGovAmountOfAtWith(
            _spender,
            block.timestamp,
            balanceOfUnderlying(_spender)
        );
    }

    function canWithdraw(address _spender)
        public view returns (bool)
    {
        return balanceOf(_spender) == 0;
    }

    /**
     * @notice deposit some token for the length given
     *
     * @param _bptAmount to take from the user to lock up
     *
     * @param _lockLength in seconds to lock the assets up for, used to
     *         calculate the lock time = lock length + block timestamp
     */
    function deposit(uint256 _bptAmount, uint256 _lockLength) public returns (uint256) {
        require(noEmergencyMode(), "emergency mode");
        require(!hasLockedUp(msg.sender), "user locked up already");
        require(_bptAmount > 0, "more than 0 token needed for lockup");
        require(_lockLength > 0, "lock length = 0");

        balancerPoolToken_.transferFrom(msg.sender, address(this), _bptAmount);

        trackDeposit(
            msg.sender,
            _lockLength,
            _bptAmount,
            block.timestamp
        );

        return balanceOf(msg.sender);
    }

    function withdraw(uint256 _amount) public {
        require(canWithdraw(msg.sender));

        uint256 sendable = balanceOfUnderlying(msg.sender) - _amount;

        balancerPoolToken_.transfer(msg.sender, sendable);
    }
}
