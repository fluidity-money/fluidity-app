// SPDX-License-Identifier: GPL

pragma solidity 0.8.16;
pragma abicoder v2;

import "../../interfaces/ISaddleSwap.sol";

contract TestSaddleSwap is ISaddleSwap {
    function swapStorage() public view returns (
        uint256 initialA,
        uint256 futureA,
        uint256 initialATime,
        uint256 futureATime,
        uint256 swapFee,
        uint256 adminFee,
        uint256 defaultWithdrawFee,
        IERC20 lpToken
    ) {
        return (
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            IERC20(address(this))
        );
    }

    function addLiquidity(
        uint256[] memory /* amounts */,
        uint256 /* minToMint */,
        uint256 /* deadline */
    ) public pure returns (uint256) {
        return 0;
    }

    function removeLiquidity(
        uint256 /* amount */,
        uint256[] calldata /* mintAmounts */,
        uint256 /* deadline */
    ) public pure returns (uint256[] memory x) {
        return x;
    }
}
