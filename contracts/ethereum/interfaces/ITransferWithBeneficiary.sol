// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

/// @title Interface for transferWithBeneficiary
interface ITransferWithBeneficiary {
    /**
     * @notice Make a token transfer that the *signer* is paying tokens but
     * benefits are given to the *beneficiary*
     * @param _token The contract address of the transferring token
     * @param _amount The amount of the transfer
     * @param _beneficiary The address that will receive benefits of this transfer
     * @param _data Extra data passed to the contract
     * @return Returns true for a successful transfer.
     */
    function transferWithBeneficiary(
        address _token,
        uint256 _amount,
        address _beneficiary,
        uint64 _data
    ) external returns (bool);
}
