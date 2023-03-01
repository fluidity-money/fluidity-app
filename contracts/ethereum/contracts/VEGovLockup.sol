// SPDX-License-Identifier: GPL

pragma solidity 0.8.11;
pragma abicoder v2;

import "../interfaces/IERC20.sol";

/// @dev default maxLockTime to use as the max amount of time that could be locked up
uint256 constant MAX_LOCK_TIME = 100;

/// @dev FP_COEFFICIENT to use as the floating point coefficient
uint256 constant FP_COEFFICIENT = 1e6;

struct Lockup {
	uint256 lockTime;
	uint256 bptLocked;
	uint256 lockTimestamp;
}

contract VEGovLockup {
	IERC20 private token_;

	mapping (address => Lockup) lockups_;

	function swag(IERC20 _token) public {
		token_ = _token;
	}

	function getLockTime(address _spender) public view returns (uint256) {
		return lockups_[_spender].lockTime;
	}

	function getBPTLocked(address _spender) public view returns (uint256) {
		return lockups_[_spender].bptLocked;
	}

	function getLockTimestamp(address _spender) public view returns (uint256) {
		return lockups_[_spender].lockTimestamp;
	}

	function getVEFluidBalance(uint256 _bptLocked, uint256 _lockTime) public pure returns (uint256) {
		return FP_COEFFICIENT * (_bptLocked * _lockTime) / MAX_LOCK_TIME;
	}

	/// @notice veFluidBalanceAtLock for the VE gov that the user receives at lock
	function getVEFluidBalanceAtLock(address _spender) public view returns (uint256) {
		return getVEFluidBalance(getBPTLocked(_spender), getLockTime(_spender));
	}

	/// @notice bptDecay to calculate how much bpt you get back per second
	function getBPTDecay(address _spender) public view returns (uint256) {
		return FP_COEFFICIENT * getBPTLocked(_spender) / getLockTime(_spender);
	}

	/// @notice veFluidDecayPerSecond to calculate how much VE Fluid you burn per second
	function getVEFluidDecayPerSecond(address _spender) public view returns (uint256) {
		return  FP_COEFFICIENT * getBPTLocked(_spender) / MAX_LOCK_TIME;
	}

	function getSecondsSinceLock(address _spender) public view returns (uint256) {
		return block.timestamp - getLockTimestamp(_spender);
	}

	/// @notice balanceOf the user's balance (the current VEFluid)
	function balanceOf(address _spender) public view returns (uint256) {
		uint256 veFluidBalanceAtLock = getVEFluidBalanceAtLock(_spender);
		uint256 veFluidDecayPerSecond = getVEFluidDecayPerSecond(_spender);
		uint256 secondsSinceLock = getSecondsSinceLock(_spender);

		return veFluidBalanceAtLock - (veFluidDecayPerSecond * secondsSinceLock);
	}

	function timestamp() public view returns (uint256) {
		return block.timestamp;
	}

	/// @notice createLock for the user with the amount given (only one position!)
	function createLock(uint256 _amount, uint256 _lockTime) public returns (uint256) {
		require(_amount > 0, "amount = 0");
		require(_lockTime > 0, "lock time = 0");
		require(_lockTime < MAX_LOCK_TIME, "lock time too great");

		bool rc = token_.transferFrom(msg.sender, address(this), _amount);

		require(rc, "failed to transfer");

		require(lockups_[msg.sender].bptLocked == 0, "already locked");

		lockups_[msg.sender].lockTime = _lockTime;
		lockups_[msg.sender].bptLocked = _amount;
		lockups_[msg.sender].lockTimestamp = block.timestamp;

		return block.timestamp;
	}

	function getLockExists(address _spender) public view returns (bool) {
		return lockups_[_spender].lockTime > 0;
	}

	function increaseBptAmount(uint256 _amount) public returns (uint256) {
		require(_amount > 0, "amount = 0");
		require(getLockExists(msg.sender), "lock doesn't exist");

		uint256 newLockTimestamp = block.timestamp;

		// subtracts the previous time that it was locked up from the locked up time

		uint256 newLockTime =
			getLockTimestamp(msg.sender) + getLockTime(msg.sender) - newLockTimestamp;

		require(newLockTime <= MAX_LOCK_TIME, "too long");

		bool rc = token_.transferFrom(msg.sender, address(this), _amount);

		require(rc, "failed to transfer tokens");

		uint256 newBptLocked = getBPTLocked(msg.sender) + _amount;

		lockups_[msg.sender] = Lockup({
			lockTime: newLockTime,
			bptLocked: newBptLocked,
			lockTimestamp: newLockTimestamp
		});

		return block.timestamp;
	}

	function increaseLockTime(uint256 _extraLockTime) public {
		require(_extraLockTime > 0, "extra lock time = 0");
		require(getLockExists(msg.sender), "lock doesn't exist");

		uint256 newLockTimestamp = block.timestamp;

		uint256 newLockTime =
			newLockTimestamp -
			getLockTimestamp(msg.sender) -
			getLockTime(msg.sender) +
			_extraLockTime;

		require(newLockTime <= MAX_LOCK_TIME, "too long");

		lockups_[msg.sender].lockTime = newLockTime;
	}
}
