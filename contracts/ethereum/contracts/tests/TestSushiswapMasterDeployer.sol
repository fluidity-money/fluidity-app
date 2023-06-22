// SPDX-License-Identifier: GPL

pragma solidity 0.8.16;
pragma abicoder v2;

import "../../interfaces/ISushiswapPoolFactory.sol";
import "../../interfaces/ISushiswapPool.sol";
import "../../interfaces/ISushiswapMasterDeployer.sol";

contract TestSushiswapMasterDeployer is ISushiswapMasterDeployer {
    uint x;

    function deployPool(
      ISushiswapPoolFactory /* _factory */,
      bytes calldata /* _deployData */
   ) external returns (ISushiswapPool) {
       ++x;
       revert("test impl");
   }
}
