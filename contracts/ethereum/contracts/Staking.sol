// SPDX-License-Identifier: GPL

// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

pragma solidity 0.8.16;
pragma abicoder v2;

import "../interfaces/IEmergencyMode.sol";
import "../interfaces/IERC20.sol";
import "../interfaces/ISaddleSwapV1.sol";
import "../interfaces/IStaking.sol";
import "../interfaces/IToken.sol";
import "../interfaces/IUniswapV2Router02.sol";

import "./openzeppelin/SafeERC20.sol";

/*
* Network(s): Ethereum & Arbitrum
*
* * Supported LP Tokens for assets:
* - fUSDC/ETH
* - fUSDC/USDC
*
* * In the following protocols:
* - Saddle
* - Camelot
* - SushiSwap
*/

uint256 constant MAX_UINT256 = 2 ** 256 - 1;

/// @notice Deposit made by a user
struct Deposit {
    // time the deposit was locked up for
    uint256 lockupLength;

    // saddle
    uint256 saddleFusdcProvided;
    uint256 saddleUsdcProvided;
    uint256 saddleWethProvided;

    // sushiswap
    uint256 sushiswapFusdcProvided;
    uint256 sushiswapUsdcProvided;
    uint256 sushiswapWethProvided;

    // camelot
    uint256 camelotFusdcProvided;
    uint256 camelotUsdcProvided;
    uint256 camelotWethProvided;
}

enum DepositType {
    SADDLE_FUSDC_USDC,
    SADDLE_FUSDC_WETH,

    SUSHISWAP_FUSDC_USDC,
    SUSHISWAP_FUSDC_WETH,

    CAMELOT_FUSDC_USDC,
    CAMELOT_FUSDC_WETH
}

contract Staking {
    using SafeERC20 for IERC20;

    event DepositMade(
        address indexed recipient,
        uint256 token0,
        uint256 token1,
        DepositType depositType
    );

    uint8 private version_;

    IERC20 private immutable fUsdc_;

    IERC20 private immutable wEth_;

    IERC20 private immutable usdc_;

    ISaddleSwapV1 private immutable saddleSwapV1FusdcWeth_;

    ISaddleSwapV1 private immutable saddleSwapV1FusdcUsdc_;

    IUniswapV2Router02 private immutable sushiswapRouter_;

    IUniswapV2Router02 private immutable camelotRouter_;

    mapping (address => Deposit[]) private deposits_;

    constructor(
        IERC20 _fUsdc,
        IERC20 _wEth,
        IERC20 _usdc,
        ISaddleSwapV1 _saddleSwapV1FusdcEth,
        ISaddleSwapV1 _saddleSwapV1FusdcUsdc,
        IUniswapV2Router02 _sushiswapRouter,
        IUniswapV2Router02 _camelotRouter
    ) {
        fUsdc_ = _fUsdc;
        wEth_ = _wEth;
        usdc_ = _usdc;

        saddleSwapV1FusdcWeth_ = _saddleSwapV1FusdcEth;
        saddleSwapV1FusdcUsdc_ = _saddleSwapV1FusdcUsdc;
        sushiswapRouter_ = _sushiswapRouter;
        camelotRouter_ = _camelotRouter;

        fUsdc_.safeApprove(address(saddleSwapV1FusdcWeth_), MAX_UINT256);
        wEth_.safeApprove(address(saddleSwapV1FusdcWeth_), MAX_UINT256);

        fUsdc_.safeApprove(address(saddleSwapV1FusdcUsdc_), MAX_UINT256);
        usdc_.safeApprove(address(saddleSwapV1FusdcUsdc_), MAX_UINT256);

        fUsdc_.safeApprove(address(sushiswapRouter_), MAX_UINT256);
        usdc_.safeApprove(address(sushiswapRouter_), MAX_UINT256);
        wEth_.safeApprove(address(sushiswapRouter_), MAX_UINT256);

        fUsdc_.safeApprove(address(camelotRouter_), MAX_UINT256);
        usdc_.safeApprove(address(camelotRouter_), MAX_UINT256);
        wEth_.safeApprove(address(camelotRouter_), MAX_UINT256);
    }

    function depositToSaddle(
        ISaddleSwapV1 _saddlePool,
        uint256 _token0Amount,
        uint256 _token1Amount
    ) internal {
        uint256[] memory amounts = new uint256[](2);
        amounts[0] = _token0Amount;
        amounts[1] = _token1Amount;

        _saddlePool.addLiquidity(
            amounts,
            0,
            block.timestamp + 1 hours
        );
    }

    function depositToConcave(
        address _token0,
        address _token1,
        uint256 _token0Amount,
        uint256 _token1Amount
    ) internal {

    }

    function depositToUniswapV2Router(
        IUniswapV2Router02 _router,
        address _token0,
        address _token1,
        uint256 _token0Amount,
        uint256 _token1Amount
    ) internal returns (uint256 amountA, uint256 amountB, uint256 liquidity) {
        return _router.addLiquidity(
            _token0,
            _token1,
            _token0Amount,
            _token1Amount,
            0,
            0,
            address(this),
            block.timestamp + 1 hours
        );
    }

    function recordDeposit(address _spender, Deposit memory _deposit) internal {
        deposits_[_spender].push(_deposit);

        if (_deposit.saddleFusdcProvided > 0 && _deposit.saddleUsdcProvided > 0) {
            emit DepositMade(
                _spender,
                _deposit.saddleFusdcProvided,
                _deposit.saddleUsdcProvided,
                DepositType.SADDLE_FUSDC_USDC
            );
        }

        else if (_deposit.saddleFusdcProvided > 0 && _deposit.saddleWethProvided > 0) {
            emit DepositMade(
                _spender,
                _deposit.saddleFusdcProvided,
                _deposit.saddleWethProvided,
                DepositType.SADDLE_FUSDC_WETH
            );
        }

        else if (_deposit.sushiswapFusdcProvided > 0 && _deposit.sushiswapUsdcProvided > 0) {
            emit DepositMade(
                _spender,
                _deposit.sushiswapFusdcProvided,
                _deposit.sushiswapUsdcProvided,
                DepositType.SUSHISWAP_FUSDC_USDC
            );
        }

        else if (_deposit.sushiswapFusdcProvided > 0 && _deposit.sushiswapWethProvided > 0) {
            emit DepositMade(
                _spender,
                _deposit.sushiswapFusdcProvided,
                _deposit.sushiswapWethProvided,
                DepositType.SUSHISWAP_FUSDC_WETH
            );
        }

        else if (_deposit.camelotFusdcProvided > 0 && _deposit.camelotUsdcProvided > 0) {
            emit DepositMade(
                _spender,
                _deposit.camelotFusdcProvided,
                _deposit.camelotUsdcProvided,
                DepositType.CAMELOT_FUSDC_USDC
            );
        }

        else if (_deposit.camelotFusdcProvided > 0 && _deposit.camelotWethProvided > 0) {
            emit DepositMade(
                _spender,
                _deposit.camelotFusdcProvided,
                _deposit.camelotWethProvided,
                DepositType.CAMELOT_FUSDC_WETH
            );
        }

        else {
            revert("unusual pair to track deposit");
        }
    }

    function requireAmountsTransferFusdc(
        uint256 _lockupLength,
        uint256 _fUsdcAmount
    ) internal {
        require(_fUsdcAmount > 0, "fusdc amount is 0");
        require(_lockupLength > 0, "lockup length = 0");
        fUsdc_.safeTransferFrom(msg.sender, address(this), _fUsdcAmount);
    }

    function saddleDeposit(
        uint256 _lockupLength,
        uint256 _fUsdcAmount,
        uint256 _usdcAmount,
        uint256 _wethAmount
    ) internal pure returns (Deposit memory) {
        return Deposit({
            lockupLength: _lockupLength,
            saddleFusdcProvided: _fUsdcAmount,
            saddleUsdcProvided: _usdcAmount,
            saddleWethProvided: _wethAmount,
            camelotFusdcProvided: 0,
            camelotUsdcProvided: 0,
            camelotWethProvided: 0,
            sushiswapFusdcProvided: 0,
            sushiswapUsdcProvided: 0,
            sushiswapWethProvided: 0
        });
    }

    function receiveSaddleDeposit(
        address _recipient,
        uint256 _lockupLength,
        uint256 _fUsdcAmount,
        uint256 _usdcAmount,
        uint256 _wEthAmount
    ) public {
        requireAmountsTransferFusdc(_lockupLength, _fUsdcAmount);

        // if the user's deposited usdc, we take that and supply it to
        // saddle with fusdc

        if (_usdcAmount > 0) {
            usdc_.safeTransferFrom(msg.sender, address(this), _usdcAmount);

            depositToSaddle(saddleSwapV1FusdcUsdc_, _fUsdcAmount, _usdcAmount);

            recordDeposit(_recipient, saddleDeposit(
                _lockupLength,
                _fUsdcAmount,
                _usdcAmount,
                0
            ));
        }

        // or alternatively we supply fusdc/weth instead

        else if (_wEthAmount > 0) {
            wEth_.safeTransferFrom(msg.sender, address(this), _wEthAmount);

            depositToSaddle(saddleSwapV1FusdcWeth_, _fUsdcAmount, _wEthAmount);

            recordDeposit(_recipient, saddleDeposit(
                _lockupLength,
                _fUsdcAmount,
                0,
                _wEthAmount
            ));
        }

        // if the user didn't supply anything, we revert

        else {
            revert("weth|usdc not supplied");
        }
    }

    function sushiswapDeposit(
        uint256 _lockupLength,
        uint256 _fUsdcAmount,
        uint256 _usdcAmount,
        uint256 _wethAmount
    ) internal pure returns (Deposit memory) {
        return Deposit({
            lockupLength: _lockupLength,
            saddleFusdcProvided: 0,
            saddleUsdcProvided: 0,
            saddleWethProvided: 0,
            camelotFusdcProvided: 0,
            camelotUsdcProvided: 0,
            camelotWethProvided: 0,
            sushiswapFusdcProvided: _fUsdcAmount,
            sushiswapUsdcProvided: _usdcAmount,
            sushiswapWethProvided: _wethAmount
        });
    }

    function receiveSushiswapDeposit(
        address _recipient,
        uint256 _lockupLength,
        uint256 _fUsdcAmount,
        uint256 _usdcAmount,
        uint256 _wEthAmount
    ) public {
        requireAmountsTransferFusdc(_lockupLength, _fUsdcAmount);

        if (_usdcAmount > 0) {
            usdc_.safeTransferFrom(msg.sender, address(this), _usdcAmount);

            depositToUniswapV2Router(
                sushiswapRouter_,
                address(fUsdc_),
                address(usdc_),
                _fUsdcAmount,
                _usdcAmount
            );

            recordDeposit(_recipient,sushiswapDeposit(
                _lockupLength,
                _fUsdcAmount,
                _usdcAmount,
                0
            ));
        }

        else if (_wEthAmount > 0) {
            usdc_.safeTransferFrom(msg.sender, address(this), _wEthAmount);

            depositToUniswapV2Router(
                sushiswapRouter_,
                address(fUsdc_),
                address(wEth_),
                _fUsdcAmount,
                _wEthAmount
            );

            recordDeposit(_recipient, sushiswapDeposit(
                _lockupLength,
                _fUsdcAmount,
                0,
                _wEthAmount
            ));
        }

        else {
            revert("weth|usdc not supplied");
        }
    }

    function camelotDeposit(
        uint256 _lockupLength,
        uint256 _fUsdcAmount,
        uint256 _usdcAmount,
        uint256 _wethAmount
    ) internal pure returns (Deposit memory) {
        return Deposit({
            lockupLength: _lockupLength,
            saddleFusdcProvided: 0,
            saddleUsdcProvided: 0,
            saddleWethProvided: 0,
            camelotFusdcProvided: 0,
            camelotUsdcProvided: 0,
            camelotWethProvided: 0,
            sushiswapFusdcProvided: _fUsdcAmount,
            sushiswapUsdcProvided: _usdcAmount,
            sushiswapWethProvided: _wethAmount
        });
    }

    function receiveCamelotDeposit(
        address _recipient,
        uint256 _lockupLength,
        uint256 _fUsdcAmount,
        uint256 _usdcAmount,
        uint256 _wEthAmount
    ) public {
        requireAmountsTransferFusdc(_lockupLength, _fUsdcAmount);

        if (_usdcAmount > 0) {
            usdc_.safeTransferFrom(msg.sender, address(this), _usdcAmount);

            depositToUniswapV2Router(
                camelotRouter_,
                address(fUsdc_),
                address(usdc_),
                _fUsdcAmount,
                _usdcAmount
            );

            recordDeposit(_recipient, camelotDeposit(
                _lockupLength,
                _fUsdcAmount,
                _usdcAmount,
                0
            ));
        }

        else if (_wEthAmount > 0) {
            usdc_.safeTransferFrom(msg.sender, address(this), _wEthAmount);

            depositToUniswapV2Router(
                camelotRouter_,
                address(fUsdc_),
                address(wEth_),
                _fUsdcAmount,
                _wEthAmount
            );

            recordDeposit(_recipient, camelotDeposit(
                _lockupLength,
                _fUsdcAmount,
                0,
                _wEthAmount
            ));
        }

        else {
            revert("weth|usdc not supplied");
        }
    }
}
