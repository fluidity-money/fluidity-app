// SPDX-License-Identifier: GPL

// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

pragma solidity 0.8.16;
pragma abicoder v2;

interface ILootboxConfirmAddressOwnership {
    /// @notice emitted when an address is confirmed
    event AddressConfirmed(address indexed addr, address indexed owner);

    /**
     * @notice confirms that you own the calling address
     *
     * @param addr your address
     */
    function confirmSame(address addr) external;


    /**
     * @notice confirms that you own another address
     *
     * @param addr the address you own
     * @param owner your address
     * @param _v signature v of the EIP712 payload, signed by `addr`
     * @param _r signature r of the EIP712 payload, signed by `addr`
     * @param _s signature s of the EIP712 payload, signed by `addr
     */
    function confirm(address addr, address owner, uint8 _v, bytes32 _r, bytes32 _s) external;
}
