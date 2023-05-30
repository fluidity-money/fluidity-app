// SPDX-License-Identifier: GPL

pragma solidity 0.8.16;
pragma abicoder v2;

import "../BaseNativeToken.sol";

import "../../interfaces/IERC20.sol";

import "../../interfaces/ISushiswapStablePool.sol";

contract TestSushiswapStablePool is ISushiswapStablePool, BaseNativeToken {
    uint256 x;

    constructor() BaseNativeToken("Test", "test", 18) {
    }

    function mint(bytes calldata /* data */) external returns (uint256 liquidity) {
        return ++x;
    }

    function burn(bytes calldata /* data */) external returns (
        TokenAmount[] memory withdrawnAmounts
    ) {
        ++x;
        return new TokenAmount[](0);
    }

    function getReserves() external view returns (uint256 reserve0, uint256 reserve1) {
        return (x, x);
    }
}
