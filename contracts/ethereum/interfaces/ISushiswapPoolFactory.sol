// SPDX-License-Identifier: GPL

pragma solidity 0.8.16;
pragma abicoder v2;

interface ISushiswapPoolFactory {
    function deployPool(bytes memory _deployData) external returns (address pool);
}
