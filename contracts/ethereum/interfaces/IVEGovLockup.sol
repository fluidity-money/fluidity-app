// SPDX-License-Identifier: GPL

pragma solidity 0.8.16;
pragma abicoder v2;

interface IVEGovLockup {
    function balanceOf(address _spender) external view returns (uint256);
    function totalSupply() external view returns (uint256);
}
