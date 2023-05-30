/// SPDX-License-Identifier: UNLICENSED

pragma solidity 0.8.16;
pragma abicoder v2;

import "../../interfaces/ISushiswapTridentRouter.sol";

contract TestSushiswapTridentRouter is ISushiswapTridentRouter {
    uint x;

    function exactInputSingleWithNativeToken(
        ExactInputSingleParams calldata /* _params */
    ) external returns (uint256 /* amountOut */) {
        ++x;
        revert("test impl");
    }
}
