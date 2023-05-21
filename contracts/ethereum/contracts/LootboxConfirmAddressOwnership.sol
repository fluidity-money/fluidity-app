// SPDX-License-Identifier: GPL

// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

pragma solidity 0.8.16;
pragma abicoder v2;

import "../interfaces/ILootboxConfirmAddressOwnership.sol";

contract LootboxConfirmAddressOwnership is ILootboxConfirmAddressOwnership {
    bytes32 constant CONFIRM_SELECTOR = keccak256("confirm(address addr, address owner)");

    // address => owner
    mapping(address => address) private addresses_;

    function confirmSame(address addr) public {
        require(addr == msg.sender, "wrong address");

        require(addresses_[addr] == address(0), "already confirmed");

        addresses_[addr] = addr;

    }

    function confirm(address addr, address owner, uint8 _v, bytes32 _r, bytes32 _s) public {
        address recoveredAddress = ecrecover(
            keccak256(
                abi.encodePacked(
                    "\x19Ethereum Signed Message:\n32",
                    keccak256(abi.encodePacked(
                        "fluidity.lootbox.confirm.address.ownership",
                        addr,
                        owner
                    ))
                )
            ),
            _v,
            _r,
            _s
        );

        require(recoveredAddress != address(0), "invalid signer");

        require(recoveredAddress == addr, "invalid signer");

        require(addresses_[recoveredAddress] == address(0), "already confirmed");
        addresses_[recoveredAddress] = owner;

        emit AddressConfirmed(addr, owner);
    }
}
