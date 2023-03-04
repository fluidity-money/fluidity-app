// SPDX-License-Identifier: GPL

pragma solidity 0.8.16;
pragma abicoder v2;

interface IAToken {
    function UNDERLYING_ASSET_ADDRESS() external view returns (address);
    function balanceOf(address _user) external view returns (uint256);
}
