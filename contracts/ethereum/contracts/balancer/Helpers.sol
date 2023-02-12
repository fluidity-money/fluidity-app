// SPDX-License-Identifier: GPL

pragma solidity 0.8.11;
pragma abicoder v2;

import "../IERC20.sol";

import "./IAsset.sol";

function _asIAsset(IERC20[] memory tokens) pure returns (IAsset[] memory assets) {
    // solhint-disable-next-line no-inline-assembly
    assembly {
        assets := tokens
    }
}