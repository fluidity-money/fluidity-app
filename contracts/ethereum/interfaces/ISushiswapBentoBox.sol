// SPDX-License-Identifier: UNLICENSED

pragma solidity 0.8.16;
pragma abicoder v2;

import "./IERC20.sol";

interface ISushiswapBentoBox {
    function deposit(
        IERC20 _token,
        address _from,
        address _to,
        uint256 _amount,
        uint256 _share
    ) external payable returns (uint256 amountOut, uint256 shareOut);

    function withdraw(
        IERC20 _token,
        address _from,
        address _to,
        uint256 _amount,
        uint256 _share
    ) external returns (
        uint256 amountOut,
        uint256 shareOut
    );

    function balanceOf(
        IERC20 _token,
        address _spender
    ) external view returns (uint256);

    function toAmount(
        IERC20 _token,
        uint256 _share,
        bool _roundUp
    ) external view returns (uint256 amount);
}
