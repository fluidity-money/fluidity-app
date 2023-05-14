// SPDX-License-Identifier: UNLICENSED

pragma solidity 0.8.16;
pragma abicoder v2;

import "./ISushiswapStablePoolFactory.sol";
import "./ISushiswapStablePool.sol";

interface ISushiswapMasterDeployer {
  function deployPool(
      ISushiswapStablePoolFactory _factory,
      bytes calldata _deployData
   ) external returns (ISushiswapStablePool);
}
