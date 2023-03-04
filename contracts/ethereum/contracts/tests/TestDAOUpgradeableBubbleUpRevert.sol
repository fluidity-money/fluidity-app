// SPDX-License-Identifier: GPL

pragma solidity 0.8.11;
pragma abicoder v2;

contract TestDAOUpgradeableBubbleUpRevert {
    function callMe() public pure {
        require(false, "uhoh!");
    }
}
