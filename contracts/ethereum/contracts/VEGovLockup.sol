// SPDX-License-Identifier: GPL

pragma solidity 0.8.11;
pragma abicoder v2;

import "./balancer/IVault.sol";
import "./balancer/IAsset.sol";
import "./balancer/WeightedPoolUserData.sol";
import "./balancer/Helpers.sol";

import "./BaseNativeToken.sol";
import "./GovToken.sol";

import "./IEmergencyMode.sol";

import { calcGovToVEGov } from "./LibGovernanceCalc.sol";

struct Lockup {
    /// @dev lockTime that the token was locked at
    uint256 lockTime;

    /// @dev maxLockTime to lock the tokens up for (ie, one year)
    uint256 maxLockTime;

    /// @dev fluidAtLock locked up by the user at the time of locking
    uint256 fluidAtLock;

    /// @dev fwEthAtLock locked up by the user at the time of locking
    uint256 fwEthAtLock;
}

contract VEGovLockup is IEmergencyMode {
    uint8 version_;

    address operator_;

    address emergencyCouncil_;

    bool noEmergencyMode_;

    GovToken govToken_;

    IERC20 fwEthToken_;

    IVault vault_;

    bytes32 vaultPoolId_;

    mapping(address => Lockup) lockups_;

    function init(
        address _operator,
        address _emergencyCouncil,
        GovToken _govToken,
        IERC20 _fwEthToken
    )
        public
    {
        require(version_ == 0, "contract is already initialised");

        require(
            _govToken.decimals() == _fwEthToken.decimals(),
            "inconsistent tokens"
        );

        operator_ = _operator;
        emergencyCouncil_ = _emergencyCouncil;
        govToken_ = _govToken;
        fwEthToken_ = _fwEthToken;
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
        return lockups_[_user].lockTime > 0;
    }

    function trackAmount(
        address _spender,
        uint256 _lockTime,
        uint256 _maxLockTime,
        uint256 _fluidAtLock,
        uint256 _fwEthAtLock
    )
        internal
    {
        lockups_[_spender].lockTime = _lockTime;
        lockups_[_spender].maxLockTime = _maxLockTime;
        lockups_[_spender].fluidAtLock = _fluidAtLock;
        lockups_[_spender].fwEthAtLock = _fwEthAtLock;
    }

    function balanceOf(address _spender) public view returns (uint256) {
        Lockup storage lockup = lockups_[_spender];

        return calcGovToVEGov(
            lockup.fluidAtLock,
            lockup.lockTime,
            lockup.maxLockTime
        );
    }

/**
 * @notice deposit 80% fluid token, 20% fwETH, locking the amounts up and then
 *         multiplying the deposited fluid assets amount by the vote escrow
 *         multiplier. then quote the user the amount of ve tokens they have
 *
 * @param _fluidTokenAmount to take as 80% of the deposit to calculate the amounts
 * @param _fwEthAmount to use as the 20% to deposit the amounts in balancer
 * @param _maxLockTime to lock up the tokens for the maximum amount of time for
 *
 * @returns the amount of ve tokens the user has
 */
    function deposit(
        uint256 _govTokenAmount,
        uint256 _fwEthAmount,
        uint256 _maxLockTime
    )
        public returns (uint256)
    {
        require(noEmergencyMode(), "emergency mode");

        // 20% of the provided tokens must be in fw eth (assuming
        // the decimals are the same for gov token and fweth)

        require(_fluidTokenAmount > 0, "gov token 0");
        require(_fwEthAmount > 0, "fwEth token 0");

        require(!hasLockedUp(msg.sender), "user locked up already");

        require(
            _fluidTokenAmount + _fwEthAmount == _fwEthAmount * 5,
            "20% liquidity fweth needed"
        );

        require(_maxLockTime > 0, "max lock time 0");

        govToken_.transferFrom(msg.sender, address(this), _fluidTokenAmount);
        fwEthToken_.transferFrom(msg.sender, address(this), _fwEthAmount);

        uint256[] memory amountsIn = new uint256[](2);

        amountsIn[0] = _fluidTokenAmount;
        amountsIn[1] = _fwEthAmount;

        uint256 minBptAmountOut = 0;

        bytes memory userData = abi.encode(
            WeightedPoolUserData.JoinKind.EXACT_TOKENS_IN_FOR_BPT_OUT,
            amountsIn,
            minBptAmountOut
        );

        (IERC20[] memory tokens, , ) = vault_.getPoolTokens(vaultPoolId_);

        IVault.JoinPoolRequest memory request = IVault.JoinPoolRequest({
            assets: _asIAsset(tokens),
            maxAmountsIn: amountsIn,
            userData: userData,
            fromInternalBalance: false
        });

        address addressThis = address(this);

        vault_.joinPool(vaultPoolId_, addressThis, addressThis, request);

        // give the user their amounts and return what they received

        uint256 lockTime = block.timestamp;

        uint256 veGovAmount = calcGovToVEGov(
            _fluidTokenAmount,
            lockTime,
            _maxLockTime
        );

        trackAmount(
            msg.sender,
            lockTime,
            _maxLockTime,
            _fluidTokenAmount,
            _fwEthAmount
        );

        return veGovAmount;
    }
}
