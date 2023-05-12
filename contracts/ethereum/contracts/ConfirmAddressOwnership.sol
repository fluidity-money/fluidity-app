// SPDX-License-Identifier: GPL

// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

pragma solidity 0.8.16;
pragma abicoder v2;

contract ConfirmAddressOwnership {
    bytes32 constant CONFIRM_SELECTOR = keccak256("confirm(address addr, address owner)");

    event AddressConfirmed(address indexed addr, address indexed owner);

    // address => owner
    mapping(address => address) private addresses_;

    bytes32 private domainSeperator_;

    constructor(string memory id) {
        domainSeperator_ = keccak256(
            abi.encode(
                keccak256("EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)"),
                keccak256(bytes(id)),
                keccak256("1"),
                block.chainid,
                address(this)
            )
        );
    }

    function confirmSame(address addr) public {
        require(addr == msg.sender, "wrong address");

        require(addresses_[addr] == address(0), "already confirmed");

        addresses_[addr] = addr;

        emit AddressConfirmed(addr, addr);
    }

    function confirm(address addr, address owner, uint8 _v, bytes32 _r, bytes32 _s) public {
        address recoveredAddress = ecrecover(
            keccak256(getPayload(addr, owner)),
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

    function getPayload(address addr, address owner) public view returns (bytes memory) {
        return abi.encodePacked(
            "\x19\x01",
            domainSeperator_,
            keccak256(
                abi.encode(
                    CONFIRM_SELECTOR,
                    addr,
                    owner
                )
            )
        );
    }
}
