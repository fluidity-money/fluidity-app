pragma solidity 0.8.11;
pragma abicoder v2;

import "./openzeppelin/Address.sol";

contract WorkerConfig {
    using Address for address;

    /// @notice emitted when the rng oracles are the process of being signed off
    /// @notice by the new operator account
    event OracleChanging(address oldOracle, address newOracle);

    /// @notice emitted when the rng oracles are changed to a new address
    event OracleChanged(address oldOracle, address newOracle);

    bool private initialised_;

    address private operator_;

    address private emergencyCouncil_;

    bool private noGlobalEmergency_;

    address[] private rngOracles_;

    address[] private pendingOracles_;

    /**
     * @notice intialise the worker config for each of the tokens in the map
     *
     * @param _operator to use that can update the worker config
     * @param _rngOracles address array to identify the rng oracle config per token
     */
    function init(
        address _operator,
        address _emergencyCouncil,
        address[] memory _rngOracles
    ) public {
        require(!initialised_, "contract is already initialised");
        initialised_ = true;

        operator_ = _operator;

        emergencyCouncil_ = _emergencyCouncil;

        noGlobalEmergency_ = true;

        rngOracles_ = _rngOracles;
    }

    function noGlobalEmergency() public view returns (bool) {
        return noGlobalEmergency_;
    }

    /// @notice starts an update for the trusted oracle to a new address
    function updateOracles(address[] memory newOracles) public {
        require(noGlobalEmergency(), "emergency mode!");
        require(msg.sender == operator_, "only operator account can use this");

        pendingOracles_ = newOracles;

        for (uint i = 0; i < rngOracles_.length; i++) {
             emit OracleChanging(rngOracles_[i], pendingOracles_[i]);
        }
    }

    /// @notice finishes an update of the oracle address
    /// @notice must be used by the multisig account
    function acceptUpdateOracle(address[] memory newOracles) public {
        require(noGlobalEmergency_, "global emergency");
        require(msg.sender == operator_, "only the operator account can use this");

        /*
        bytes memory oraclesHashed = abi.encodePacked(newOracles);

        bytes memory pendingOraclesHashed = abi.encodePacked(pendingOracles_);

        require(oraclesHashed == pendingOraclesHashed,
            "passed new oracles don't match pending"); */

        for (uint i = 0; i < rngOracles_.length; i++) {
            emit OracleChanged(rngOracles_[i], pendingOracles_[i]);
        }

        rngOracles_ = newOracles;
    }

    function getWorkerAddress(uint tokenNumber) public view returns (address) {
        return rngOracles_[tokenNumber];
    }
}
