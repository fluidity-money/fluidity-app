// SPDX-License-Identifier: GPL

// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

pragma solidity 0.8.16;
pragma abicoder v2;

import "./openzeppelin/SafeERC20.sol";

import "../interfaces/IRegistry.sol";
import "../interfaces/IEmergencyMode.sol";
import "../interfaces/ITokenInPermit.sol";
import "../interfaces/ITokenOperatorOwned.sol";
import "../interfaces/IOperatorOwned.sol";

import "../interfaces/IERC20ERC2612.sol";

uint256 constant MaxUint256 = type(uint256).max;

/**
 * PermitRouterV1 lets users approve as much as they want to the router,
 * then use that to erc20In, presumably benefitting from the reduced
 * surface featured in this router. alternatively, they can send a blob
 * which would be sent to the underlying's permit function.
*/
contract PermitRouterV1 is IEIP712, ITokenInPermit, IEmergencyMode, IOperatorOwned {
    using SafeERC20 for IERC20;

    address private operator_;

    bool private noEmergencyMode_;

    IRegistry public immutable registry_;

    bytes32 private initialDomainSeparator_;

    uint256 private initialChainId_;

    address private immutable emergencyCouncil_;

    /// @dev fAssetToUnderlyings_ the consumer should know which
    ///      underlying tokens support this - this is in the form of address
    ///      since we convert it to ERC2612
    mapping (IToken => address) fAssetToUnderlyings_;

    /// @dev nonce_ used if the end user tries to erc20InPermit
    mapping (address => uint256) nonce_;

    /// @notice guard_ to use for the reentrancy guard check
    bool private guard_;

    constructor(
        address _operator,
        address _emergencyCouncil,
        IRegistry _registry
    ) {
        operator_ = _operator;
        noEmergencyMode_ = true;
        emergencyCouncil_ = _emergencyCouncil;
        registry_ = _registry;
        initialChainId_ = block.chainid;
        initialDomainSeparator_ = _computeDomainSeparator();
    }

    /// @notice scanRegistry to rebuild the database of which fassets are
    ///         able to be used as an extra precaution
    function scanRegistry() public {
        // to prevent abuse/until a better approach comes up
        require(msg.sender == operator_, "only operator");

        ITokenOperatorOwned[] memory tokens = registry_.tokens();

        for (uint i = 0; i < tokens.length; ++i) {
            IToken token = tokens[i];
            fAssetToUnderlyings_[token] = address(token.underlyingToken());
            IERC20(fAssetToUnderlyings_[token]).safeApprove(address(token), MaxUint256);
        }
    }

    function disableFAsset(IToken _token) public {
        require(
            msg.sender == operator_ ||
            msg.sender == emergencyCouncil_,
            "only operator/emergency council"
        );

        IERC20(fAssetToUnderlyings_[_token]).safeApprove(address(_token), 0);

        fAssetToUnderlyings_[_token] = address(0);
    }

    /* ~~~~~~~~~~ IMPLEMENTS ITokenInPermit ~~~~~~~~~~ */

    function _hashErc20InPermitHash(
        IERC20 _fAsset,
        uint256 _erc20AmountIn,
        uint256 _nonce,
        uint256 _deadline
    ) internal pure returns (bytes32) {
        return keccak256(abi.encode(
            keccak256("ERC20InPermit(address fAsset,uint256 erc20AmountIn,uint256 nonce,uint256 deadline)"),
            address(_fAsset),
            _erc20AmountIn,
            _nonce,
            _deadline
        ));
    }

    /// @inheritdoc ITokenInPermit
    function hashErc20InPermitHash(
        Erc20InPermit calldata _args
    ) external pure returns (bytes32) {
        return _hashErc20InPermitHash(
            _args.fAsset,
            _args.erc20AmountIn,
            _args.nonce,
            _args.deadline
        );
    }

    function _reentrancyGuard(bool _state) internal {
        require(guard_ != _state, "reentrancy blocked");
        guard_ = _state;
    }

    /// @inheritdoc ITokenInPermit
    function erc20InUnderlyingPermit(
        address _owner,
        IToken _fAsset,
        uint256 _erc20AmountIn,
        uint256 _deadline,
        uint8 _v,
        bytes32 _r,
        bytes32 _s
    ) external returns (uint256 amountIn) {
        require(noEmergencyMode_, "emergency mode");

        _reentrancyGuard(true);

        IERC20ERC2612 underlying = IERC20ERC2612(fAssetToUnderlyings_[_fAsset]);

        require(address(underlying) != address(0), "fasset not tracked");

        underlying.permit(
            _owner, // owner
            address(this), // spender
            _erc20AmountIn, // erc20 in amount
            _deadline, // deadline
            _v,
            _r,
            _s
        );

        underlying.transferFrom(_owner, address(this), _erc20AmountIn);

        amountIn = _fAsset.erc20InTo(_owner, _erc20AmountIn);

        _reentrancyGuard(false);

        return amountIn;
    }

    /// @inheritdoc ITokenInPermit
    function erc20InPermit(
        address _owner,
        IToken _fAsset,
        uint256 _erc20AmountIn,
        uint256 _deadline,
        uint8 _v,
        bytes32 _r,
        bytes32 _s
    ) public returns (uint256 amountOut) {
        require(noEmergencyMode_, "emergency mode");

        _reentrancyGuard(true);

        address signer = ecrecover(
            keccak256(abi.encodePacked(
                "\x19\x01",
                DOMAIN_SEPARATOR(),
                _hashErc20InPermitHash(
                    _fAsset,
                    _erc20AmountIn,
                    nonce_[_owner]++,
                    _deadline
                )
            )),
            _v,
            _r,
            _s
        );

        require(signer == _owner, "invalid signature");

        require(_deadline > block.timestamp, "exceeded deadline");

        IERC20 underlying = IERC20(address(fAssetToUnderlyings_[_fAsset]));

        require(address(underlying) != address(0), "fasset not tracked");

        underlying.safeTransferFrom(_owner, address(this), _erc20AmountIn);

        amountOut = _fAsset.erc20InTo(_owner, _erc20AmountIn);

        _reentrancyGuard(false);

        return amountOut;
    }

    /* ~~~~~~~~~~ IMPLEMENTS EIP712 ~~~~~~~~~~ */

    function _computeDomainSeparator() internal view returns (bytes32) {
        return keccak256(
            abi.encode(
                keccak256("EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)"),
                keccak256("PermitRouterV1"),
                keccak256("1"),
                block.chainid,
                address(this)
            )
        );
    }

    function DOMAIN_SEPARATOR() public view returns (bytes32) {
        return
            block.chainid == initialChainId_
                ? initialDomainSeparator_
                : _computeDomainSeparator();
    }

    /* ~~~~~~~~~~ IMPLEMENTS IOperator ~~~~~~~~~~ */

    function operator() public view returns (address) {
        return operator_;
    }

    function updateOperator(address _newOperator) public {
        require(msg.sender == operator_, "only operator");
        emit NewOperator(operator_, _newOperator);
        operator_ = _newOperator;
    }

    /* ~~~~~~~~~~ IMPLEMENTS IEmergencyMode ~~~~~~~~~~ */

    function noEmergencyMode() public view returns (bool) {
        return noEmergencyMode_;
    }

    function enableEmergencyMode() public {
        require(
            msg.sender == emergencyCouncil_ ||
            msg.sender == operator_,
            "not emergency council"
        );

        emit Emergency(true);

        noEmergencyMode_ = false;
    }

    function disableEmergencyMode() public {
        require(msg.sender == operator_, "only operator");
        emit Emergency(false);
        noEmergencyMode_ = true;
    }

    function emergencyCouncil() public view returns (address) {
        return emergencyCouncil_;
    }
}
