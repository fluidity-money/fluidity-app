// SPDX-License-Identifier: GPL

pragma solidity ^0.8.11;
pragma abicoder v2;

interface IOperatorOwned {
    event NewOperator(address old, address new_);

    function operator() external view returns (address);

    /**
     * @notice update the operator account to a new address
     * @param _newOperator the address of the new operator to change to
     */
    function updateOperator(address _newOperator) external;
}
