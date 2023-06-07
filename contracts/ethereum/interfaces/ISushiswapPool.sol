// SPDX-License-Identifier: UNLICENSED

pragma solidity 0.8.16;
pragma abicoder v2;

import "./IERC20.sol";

struct TokenAmount {
    address token;
    uint256 amount;
}

interface ISushiswapPool is IERC20 {
    function mint(bytes calldata _data) external returns (uint256 liquidity);

    function burn(bytes calldata _data) external returns (
        TokenAmount[] memory withdrawnAmounts
    );

    function swap(bytes calldata _data) external returns (uint256 amountOut);

    function getNativeReserves() external view returns (
        uint256 reserve0,
        uint256 reserve1
    );
}
