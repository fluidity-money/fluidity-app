// SPDX-License-Identifier: GPL
pragma solidity 0.8.11;
pragma abicoder v2;

import "./BaseNativeToken.sol";
import "./GovToken.sol";

import "@balancer-labs/v2-interfaces/contracts/solidity-utils/helpers/BalancerErrors.sol";
import "@balancer-labs/v2-interfaces/contracts/solidity-utils/openzeppelin/IERC20.sol";
import "@balancer-labs/v2-interfaces/contracts/pool-weighted/WeightedPoolUserData.sol";
import "@balancer-labs/v2-interfaces/contracts/vault/IVault.sol";
import "@balancer-labs/v2-interfaces/contracts/vault/IAsset.sol";

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

contract VEGovLockup {
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

    function noEmergencyMode() public view returns (bool) {
    	return _noEmergencyMode;
    }

    function lockup(uint256 _govTokenAmount, uint256 _fwEthAmount, uint256 _maxLockTime) {
    	require(noEmergencyMode(), "emergency mode");

		// 20% of the provided tokens must be in fw eth (assuming
		// the decimals are the same for gov token and fweth)

		require(_govTokenAmount > 0, "gov token 0");
		require(_fwEthAmount > 0, "fwEth token 0");

    	require(
    		(_govTokenAmount + _fwEthAmount) * 0.2 == _fwEthAmount,
    		"20% liquidity fweth needed"
    	);

    	require(_maxLockTime > 0, "max lock time 0");

    	govToken_.transferFrom(msg.sender, address(this), _govTokenAmount);
    	fwEthToken_.transferFrom(msg.sender, address(this), _fwEthAmount);

        bytes memory userData = abi.encode(
            WeightedPoolUserData.JoinKind.EXACT_TOKENS_IN_FOR_BPT_OUT,
            amountsIn,
            minBptAmountOut
        );

        (IERC20[] memory tokens, , ) = vault_.getPoolTokens(vaultPoolId_);

        // knowing that this is reentrant possibly

    	IVault.JoinPoolRequest memory request = IVault.JoinPoolRequest({
            assets: _asIAsset(tokens),
            maxAmountsIn: amountsIn,
            userData: userData,
            fromInternalBalance: false
        });

        address addressThis = address(this);

        vault_.joinPool(vaultPoolId_, addressThis, addressThis, request);
    }

    function calculateGovToVEGov(
        uint256 _fluidAmount,
        uint256 _lockTime,
        uint256 _maxLockTime
    )
        public pure returns (uint256)
    {
    	// (FLUID * lock time) / max lock time
        return (_fluidAmount * _lockTime) / _maxLockTime;
    }

    function calculateLinearDecay(
        uint256 _VEFluidAtLock,
        uint256 _lockTime,
        uint256 _timeSinceLockInDays
    )
        public pure returns (uint256)
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
        public pure returns (uint256)
    {
        return _timeSinceLockInDays / _lockTime;
    }
}
