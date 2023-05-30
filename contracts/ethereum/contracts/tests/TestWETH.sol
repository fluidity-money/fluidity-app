// SPDX-License-Identifier: UNLICENSED

pragma solidity 0.8.16;
pragma abicoder v2;

import "../../interfaces/IWETH.sol";

contract TestWETH is IWETH {
  uint x;

  function deposit() external payable {
    ++x;
    revert("test impl");
  }

  function withdraw(uint /* y */) external {
    ++x;
    revert("test impl");
  }

  function approve(address /* y */, uint256 /* z */) external returns (bool) {
    ++x;
    revert("test impl");
  }

  function transfer(address /* y */, uint256 /* z */) external returns (bool) {
      ++x;
      revert("test impl");
  }

  function balanceOf(address /* y */) external view returns (uint256) {
    return x;
  }

  function decimals() external view returns (uint8) {
    return uint8(x);
  }
}