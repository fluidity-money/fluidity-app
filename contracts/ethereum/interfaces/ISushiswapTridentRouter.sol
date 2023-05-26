/// SPDX-License-Identifier: UNLICENSED

pragma solidity 0.8.16;
pragma abicoder v2;

struct ExactInputSingleParams {
    uint256 amountIn;
    uint256 amountOutMinimum;
    address pool;
    address tokenIn;
    bytes data;
}

interface ISushiswapTridentRouter {
    function exactInputSingleWithNativeToken(
        ExactInputSingleParams calldata _params
    ) external returns (uint256 amountOut);
}
