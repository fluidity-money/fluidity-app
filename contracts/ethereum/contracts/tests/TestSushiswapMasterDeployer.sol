// SPDX-License-Identifier: GPL

pragma solidity 0.8.16;
pragma abicoder v2;

import "../../interfaces/ISushiswapStablePoolFactory.sol";
import "../../interfaces/ISushiswapStablePool.sol";
import "../../interfaces/ISushiswapMasterDeployer.sol";

contract TestSushiswapMasterDeployer is ISushiswapMasterDeployer {
    uint x;

    function deployPool(
      ISushiswapStablePoolFactory /* _factory */,
      bytes calldata /* _deployData */
   ) external returns (ISushiswapStablePool) {
       ++x;
       revert("test impl");
   }
}
