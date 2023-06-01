// SPDX-License-Identifier: UNLICENSED

pragma solidity 0.8.16;
pragma abicoder v2;

import "../../interfaces/IERC20.sol";
import "../../interfaces/ISushiswapBentoBox.sol";

contract TestSushiswapBentoBox is ISushiswapBentoBox {
    uint x;

    function deposit(
        IERC20 /* _token */,
        address /* _from */,
        address /* _to */,
        uint256 /* _amount */,
        uint256 /* _share */
    ) external payable returns (uint256 amountOut, uint256 shareOut ) {
        ++x;
        amountOut = x;
        shareOut = x;
        revert("test impl");
    }

    function withdraw(
        IERC20 /* _token */,
        address /* _from */,
        address /* _to */,
        uint256 /* _amount */,
        uint256 /* _share */
    ) external returns (uint256 /* amountOut */, uint256 /* shareOut */) {
        ++x;
        revert("test impl");
    }

    function transfer(
        IERC20 /* _token */,
        address /* _from */,
        address /* _to */,
        uint256 /* _share */
    ) external {
        ++x;
        revert("test impl");
    }

    function balanceOf(
        IERC20 /* _token */,
        address /* _spender */
    ) external view returns (uint256) {
        return x;
    }
}
