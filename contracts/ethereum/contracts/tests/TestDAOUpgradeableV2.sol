// SPDX-License-Identifier: GPL

pragma solidity 0.8.11;
pragma abicoder v2;

/**
 * @notice TestDAOUpgradeableV2 is intended to be used with a beacon
 *         proxy/proxy admin combo to test if the DAO supports code
 *         upgrade properly - should be upgraded to from V1
 */
contract TestDAOUpgradeableV2 {
    uint8 private version_;

    string private hidden_;

    address private operator_;

    function init(address _operator) public {
        require(version_ == 0, "already initialised");

        operator_ = _operator;

        version_ = 1;
    }

    function getHidden() public view returns (string memory) {
        return hidden_;
    }
}
