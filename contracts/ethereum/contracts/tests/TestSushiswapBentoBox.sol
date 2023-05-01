// SPDX-License-Identifier: GPL

pragma solidity 0.8.16;
pragma abicoder v2;

import "../../interfaces/IERC20.sol";

import "../../interfaces/ISushiswapBentoBox.sol";

contract TestSushiswapBentoBox is ISushiswapBentoBox {
    uint256 x;

    function deposit(
        IERC20 /* _token */,
        address /* _from */,
        address /* _to */,
        uint256 /* _amount */,
        uint256 /* _share */
    ) public payable returns (uint256 amountOut, uint256 shareOut) {
        ++x;
        return (x, x);
    }

    function withdraw(
        IERC20 /* _token */,
        address /* _from */,
        address /* _to */,
        uint256 /* _amount */,
        uint256 /* _share */
    ) public returns (
        uint256 amountOut,
        uint256 shareOut
    ) {
        ++x;
        return (x, x);
    }

    function balanceOf(
        IERC20 /* _token */,
        address /* _spender */
    ) public view returns (uint256) {
        return x;
    }
}
