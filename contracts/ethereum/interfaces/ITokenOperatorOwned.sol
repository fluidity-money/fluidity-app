// SPDX-License-Identifier: GPL

pragma solidity ^0.8.11;
pragma abicoder v2;

import "./IToken.sol";
import "./IOperatorOwned.sol";

interface ITokenOperatorOwned is IToken, IOperatorOwned {
    // solhint-disable-empty-line
}
