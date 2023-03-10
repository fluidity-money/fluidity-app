// SPDX-License-Identifier: MIT

pragma solidity 0.8.16;

import "./IEIP712.sol";

/// @dev EIP721_PERMIT_SELECTOR that's needed for ERC2612
// keccak("Permit(address owner,address spender,uint256 value,uint256 nonce,uint256 deadline)")
bytes32 constant EIP721_PERMIT_SELECTOR =
  0x6e71edae12b1b97f4d1f60370fef10105fa2faae0126114a169c64845d6126c9;

interface IERC2612 is IEIP712 {
    function permit(address owner, address spender, uint value, uint deadline, uint8 v, bytes32 r, bytes32 s) external;
    function nonces(address owner) external view returns (uint);
}
