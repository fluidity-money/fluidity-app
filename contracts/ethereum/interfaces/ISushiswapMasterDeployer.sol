// SPDX-License-Identifier: UNLICENSED

pragma solidity 0.8.16;
pragma abicoder v2;

import "./ISushiswapPoolFactory.sol";
import "./ISushiswapPool.sol";

interface ISushiswapMasterDeployer {
  function deployPool(
      ISushiswapPoolFactory _factory,
      bytes calldata _deployData
   ) external returns (ISushiswapPool);
}
