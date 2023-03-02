// SPDX-License-Identifier: GPL

pragma solidity 0.8.11;
pragma abicoder v2;

/**
 * @notice TestDAOUpdates to test the DAO is able to submit simple
 *         function calls to this contract
 */
contract TestDAOUpdates {
    uint256 private amount_;

    address private operator_;

    constructor(address _operator) {
        operator_ = _operator;
    }

    function updateAmount(uint256 _newAmount) public {
        require(msg.sender == operator_, "only operator");

        amount_ = _newAmount;
    }

    function amount() public view returns (uint256) {
        return amount_;
    }
}
