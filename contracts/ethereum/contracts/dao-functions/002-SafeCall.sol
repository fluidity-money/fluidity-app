// SPDX-License-Identifier: GPL

pragma solidity ^0.8.11;
pragma abicoder v2;

function safeCallOptionalReturn(
    address _target,
    bytes memory _calldata
) returns (bytes memory returndata) {
    bool rc;

    (rc, returndata) = _target.call(_calldata);

    if (!rc) {
        assembly {
            revert(add(32, returndata), mload(returndata))
        }
    }

    return returndata;
}

function safeCallIgnoreRevert(
    address _target,
    bytes memory _calldata
) returns (bytes memory returndata) {
    (, returndata) = _target.call(_calldata);
    return returndata;
}
