// SPDX-License-Identifier: GPL

pragma solidity 0.8.16;
pragma abicoder v2;

interface IVEGovLockup {
    function getPastVotes(address _spender, uint256 _timepoint) external view returns (uint256);
    function mint(address _recipient, uint256 _amount, uint256 _lockTime) external;
    function burn(address _recipient, uint256 _tokenId) external returns (uint256);
    function getPastTotalSupply(uint256 _timepoint) external view returns (uint256);
}
