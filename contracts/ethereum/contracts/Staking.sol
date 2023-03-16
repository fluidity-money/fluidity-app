// SPDX-License-Identifier: GPL

// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

pragma solidity 0.8.16;
pragma abicoder v2;

import "../interfaces/IEmergencyMode.sol";
import "../interfaces/IERC20.sol";
import "../interfaces/IStaking.sol";
import "../interfaces/IToken.sol";
import "../interfaces/ISaddleSwapV1.sol";
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
* - Concave
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

    // concave

    // uniswap
    uint256 uniswapV2FusdcProvided;
    uint256 uniswapV2UsdcProvided;
    uint256 uniswapV2WethProvided;
}

enum DepositType {
    SADDLE_FUSDC_USDC,
    SADDLE_FUSDC_WETH,

    UNISWAP_FUSDC_USDC,
    UNISWAP_FUSDC_WETH
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

    IUniswapV2Router02 private immutable uniswapV2Router_;

    mapping (address => Deposit[]) private deposits_;

    constructor(
        IERC20 _fUsdc,
        IERC20 _wEth,
        IERC20 _usdc,
        ISaddleSwapV1 _saddleSwapV1FusdcEth,
        ISaddleSwapV1 _saddleSwapV1FusdcUsdc,
        IUniswapV2Router02 _uniswapV2Router
    ) {
        fUsdc_ = _fUsdc;
        wEth_ = _wEth;
        usdc_ = _usdc;

        saddleSwapV1FusdcWeth_ = _saddleSwapV1FusdcEth;
        saddleSwapV1FusdcUsdc_ = _saddleSwapV1FusdcUsdc;
        uniswapV2Router_ = _uniswapV2Router;

        fUsdc_.safeApprove(address(saddleSwapV1FusdcWeth_), MAX_UINT256);
        wEth_.safeApprove(address(saddleSwapV1FusdcWeth_), MAX_UINT256);

        fUsdc_.safeApprove(address(saddleSwapV1FusdcUsdc_), MAX_UINT256);
        usdc_.safeApprove(address(saddleSwapV1FusdcUsdc_), MAX_UINT256);

        fUsdc_.safeApprove(address(_uniswapV2Router), MAX_UINT256);
        usdc_.safeApprove(address(_uniswapV2Router), MAX_UINT256);
        wEth_.safeApprove(address(_uniswapV2Router), MAX_UINT256);
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
        address _token0,
        address _token1,
        uint256 _token0Amount,
        uint256 _token1Amount
    ) internal returns (uint256 amountA, uint256 amountB, uint256 liquidity) {
        return uniswapV2Router_.addLiquidity(
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

        else if (_deposit.uniswapV2FusdcProvided > 0 && _deposit.uniswapV2UsdcProvided > 0) {
            emit DepositMade(
                _spender,
                _deposit.uniswapV2FusdcProvided,
                _deposit.uniswapV2UsdcProvided,
                DepositType.UNISWAP_FUSDC_USDC
            );
        }

        else if (_deposit.uniswapV2FusdcProvided > 0 && _deposit.uniswapV2WethProvided > 0) {
            emit DepositMade(
                _spender,
                _deposit.uniswapV2FusdcProvided,
                _deposit.uniswapV2WethProvided,
                DepositType.UNISWAP_FUSDC_WETH
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

            recordDeposit(_recipient, Deposit({
                lockupLength: _lockupLength,
                saddleFusdcProvided: _fUsdcAmount,
                saddleUsdcprovided: _usdcAmount
            }));
        }

        // or alternatively we supply fusdc/weth instead

        else if (_wEthAmount > 0) {
            wEth_.safeTransferFrom(msg.sender, address(this), _wEthAmount);

            depositToSaddle(saddleSwapV1FusdcWeth_, _fUsdcAmount, _wEthAmount);

            recordDeposit(_recipient, Deposit({
                lockupLength: _lockupLength,
                saddleFusdcProvided: _fUsdcAmount,
                saddleWethprovided: _wEthAmount
            }));
        }

        // if the user didn't supply anything, we revert

        else {
            revert("weth|usdc not supplied");
        }
    }

    function receiveUniswapV2Deposit(
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
                address(fUsdc_),
                address(usdc_),
                _fUsdcAmount,
                _usdcAmount
            );

            recordDeposit(_recipient, Deposit({
                lockupLength: _lockupLength,
                uniswapV2FusdcProvided: _fUsdcAmount,
                uniswapV2UsdcProvided: _usdcAmount
            }));
        }

        else if (_wEthAmount > 0) {
            usdc_.safeTransferFrom(msg.sender, address(this), _wEthAmount);

            depositToUniswapV2Router(
                address(fUsdc_),
                address(wEth_),
                _fUsdcAmount,
                _wEthAmount
            );

            recordDeposit(_recipient, Deposit({
                lockupLength: _lockupLength,
                uniswapV2FusdcProvided: _fUsdcAmount,
                uniswapV2WethProvided: _wEthAmount
            }));
        }

        else {
            revert("weth|usdc not supplied");
        }
    }
}
