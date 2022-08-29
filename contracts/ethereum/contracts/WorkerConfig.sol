pragma solidity 0.8.11;
pragma abicoder v2;

import "./openzeppelin/Address.sol";

contract WorkerConfig {
    using Address for address;

    struct OracleUpdate {
        address contractAddr;
        address newOracle;
    }

    /// @notice emitted when the rng oracles are changed to a new address
    event OracleChanged(address contractAddr, address oldOracle, address newOracle);

    /// @notice emitted when an emergency is declared!
    event Emergency();

    bool private initialised_;

    address private operator_;

    address private emergencyCouncil_;

    bool private noGlobalEmergency_;

    mapping(address => address) private oracles_;

    /**
     * @notice intialise the worker config for each of the tokens in the map
     *
     * @param _operator to use that can update the worker config
     * @param _emergencyCouncil to use that can set emergency mode
     */
    function init(
        address _operator,
        address _emergencyCouncil
    ) public {
        require(!initialised_, "contract is already initialised");
        initialised_ = true;

        operator_ = _operator;

        emergencyCouncil_ = _emergencyCouncil;

        noGlobalEmergency_ = true;
    }

    function noGlobalEmergency() public view returns (bool) {
        return noGlobalEmergency_;
    }

    /// @notice starts an update for the trusted oracle to a new address
    function updateOracles(OracleUpdate[] memory newOracles) public {
        require(noGlobalEmergency(), "emergency mode!");
        require(msg.sender == operator_, "only operator account can use this");

        for (uint i = 0; i < newOracles.length; i++) {
            OracleUpdate memory oracle = newOracles[i];

            emit OracleChanged(oracle.contractAddr, oracles_[oracle.contractAddr], oracle.newOracle);

            oracles_[oracle.contractAddr] = oracle.newOracle;
        }
    }

    function getWorkerAddress(address contractAddr) public view returns (address) {
        require(noGlobalEmergency(), "emergency mode!");

        return oracles_[contractAddr];
    }

    function getWorkerAddress() public view returns (address) {
        require(noGlobalEmergency(), "emergency mode!");

        return oracles_[msg.sender];
    }

    function enableEmergencyMode() public {
        bool authorised = msg.sender == operator_ || msg.sender == emergencyCouncil_;
        require(authorised, "only the operator or emergency council can use this");

        noGlobalEmergency_ = false;
        emit Emergency();
    }
}
