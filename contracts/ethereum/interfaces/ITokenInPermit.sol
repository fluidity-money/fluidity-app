// SPDX-License-Identifier: GPL

// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

pragma solidity 0.8.16;
pragma abicoder v2;

import "./IToken.sol";

interface ITokenInPermit {
    struct Erc20InPermit {
        IERC20 fAsset;
        uint256 erc20AmountIn;
        uint256 nonce;
        uint256 deadline;
    }

    /// @notice hashErc20InPermitHash for EIP712
    function hashErc20InPermitHash(
        Erc20InPermit calldata _permit
    ) external returns (bytes32);

    /**
     * @notice erc20InWithUnderlyingPermit, taking the arguments given and
     *         passing them to the permit function of the underlying token,
     *         the address that's signed for as the owner should be the fasset
     * @param _owner to send the tokens to and use the permit for
     * @param _fAsset to do the routing for
     * @param _erc20AmountIn to erc20In
     * @param _deadline to use as the deadline before rejecting this
     *        contract use (this is not checked by this contract, instead it's
     *        presumably checked by the underlying
     * @param _v to use for verifying the permit function under the hood
     * @param _r for ECDSA sig
     * @param _s for ECDSA sig
     */
    function erc20InWithUnderlyingPermit(
        address _owner,
        IToken _fAsset,
        uint256 _erc20AmountIn,
        uint256 _deadline,
        uint8 _v,
        bytes32 _r,
        bytes32 _s
    ) external returns (uint256 amountIn);

    /**
     * @notice erc20InPermit to wrap the user's assets, assuming
     *         that they max approved the underlying asset to this addr and we're
     *         using a signature from a EOA
     * @param _owner to verify signature for and send the amounts to
     * @param _fAsset to wrap with
     * @param _erc20AmountIn to use in the erc20In function
     * @param _deadline to process this transaction by or before
     * @param _v for ECDSA sig that contains every input here
     * @param _r for ECDSA sig
     * @param _s for ECDSA sig
     */
    function erc20InPermit(
        address _owner,
        IToken _fAsset,
        uint256 _erc20AmountIn,
        uint256 _deadline,
        uint8 _v,
        bytes32 _r,
        bytes32 _s
    ) external returns (uint256 amountIn);
}
