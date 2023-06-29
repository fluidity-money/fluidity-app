// SPDX-License-Identifier: GPL

pragma solidity 0.8.16;
pragma abicoder v2;

import "../UniswapOracleUtilityClient.sol";
import "../uniswap/UniswapLibraries.sol";

import "forge-std/Test.sol";

contract TestUniswapOracleUM is Test {
    IERC20 constant weth_ = IERC20(address(0x0082af49447d8a07e3bd95bd0d56f35241523fbab1));
    IERC20 constant uni_ = IERC20(address(0x00fa7f8980b0f1e64a2062791cc3b0871572f1f7f0));

    IUniswapV3Pool constant wethUsdcPool_ = IUniswapV3Pool(address(0x00c31e54c7a869b9fcbecc14363cf510d1c41fa443));
    UniswapOracleOverrideUtilityClient private wethUsdc_;

    IUniswapV3Pool constant uniDaiPool_ = IUniswapV3Pool(address(0x008e3d89dc3cd1252a4d50d6d4a42a1f10f1d1922a));
    UniswapOracleOverrideUtilityClient private uniDai_;

    function setUp() public {
        uint fork = vm.createFork(
            vm.envString("FLU_ETHEREUM_FORKNET_URL_ARBITRUM"),
            105988133
        );
        vm.selectFork(fork);

        require(wethUsdcPool_.token0() == address(weth_), "weth usdc pool should have weth as token0");
        require(uniDaiPool_.token1() == address(uni_), "uni dai pool should have uni as token1");

        wethUsdc_ = new UniswapOracleOverrideUtilityClient(
            weth_,
            1,
            1,
            address(0),
            address(0),
            address(0),
            address(0),
            wethUsdcPool_,
            3600
        );

        uniDai_ = new UniswapOracleOverrideUtilityClient(
            uni_,
            1,
            1,
            address(0),
            address(0),
            address(0),
            address(0),
            uniDaiPool_,
            3600
        );
    }

    function testUniswapOracle() public {
        UtilityVars memory v = wethUsdc_.getUtilityVars();
        // 1mil usdc to weth
        uint wethAmount = FullMath.mulDiv(1000000, v.exchangeRateNum, v.exchangeRateDenom);
        require(wethAmount > 540*10**18, "weth amount too low");
        require(wethAmount < 550*10**18, "weth amount too high");

        v = uniDai_.getUtilityVars();
        // 1mil dai to UNI
        uint uniAmount = FullMath.mulDiv(1000000, v.exchangeRateNum, v.exchangeRateDenom);
        console.logUint(uniAmount);
        require(uniAmount > 200000*10**18, "uni amount too low");
        require(uniAmount < 210000*10**18, "uni amount too high");
    }
}
