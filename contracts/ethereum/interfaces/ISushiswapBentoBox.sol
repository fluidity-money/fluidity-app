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

    function transfer(
        IERC20 _token,
        address _from,
        address _to,
        uint256 _share
    ) external;

    function balanceOf(
        IERC20 _token,
        address _spender
    ) external view returns (uint256);
}
