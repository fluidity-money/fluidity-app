// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.16;

import "../../interfaces/IBalancerVault.sol";

contract TestBalancerVault is IBalancerVault {
    uint x;

    function joinPool(
        bytes32 /* poolId1 */,
        address /* sender1 */,
        address /* recipient1 */,
        JoinPoolRequest memory /* request1 */
    ) external payable {
        ++x;
        revert("test impl");
    }
}
