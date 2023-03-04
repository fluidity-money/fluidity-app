// SPDX-License-Identifier: GPL

pragma solidity 0.8.16;
pragma abicoder v2;

/**
 * @notice TestDAOUpgradeableV1 is intended to be used with a beacon
 *         proxy/proxy admin combo to test if the DAO supports code
 *         upgrade properly (after upgrading to V2)
 */
contract TestDAOUpgradeableV1 {
    uint8 private version_;

    string private hidden_;

    address private operator_;

    function init(address _operator) public {
        require(version_ == 0, "already initialised");

        operator_ = _operator;

        version_ = 1;
    }

    function setHidden(string memory _hidden) public {
        require(msg.sender == operator_, "only operator");

        hidden_ = _hidden;
    }
}
