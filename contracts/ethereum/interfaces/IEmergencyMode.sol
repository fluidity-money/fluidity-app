// SPDX-License-Identifier: GPL

pragma solidity ^0.8.11;
pragma abicoder v2;

interface IEmergencyMode {
    /// @notice emitted when the contract enters emergency mode!
    event Emergency(bool indexed status);

    /**
     * @notice enables emergency mode preventing the swapping in of tokens,
     * @notice and setting the rng oracle address to null
     */
    function enableEmergencyMode() external;

    /**
     * @notice disables emergency mode, following presumably a contract upgrade
     * @notice (operator only)
     */
    function disableEmergencyMode() external;

    /**
     * @notice emergency mode status (true if everything is okay)
     */
    function noEmergencyMode() external view returns (bool);
}
