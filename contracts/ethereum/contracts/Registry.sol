// SPDX-License-Identifier: GPL

pragma solidity ^0.8.11;
pragma abicoder v2;

import "@openzeppelin/contracts/proxy/beacon/IBeacon.sol";

import "../interfaces/ILiquidityProvider.sol";
import "../interfaces/IRegistry.sol";
import "../interfaces/IToken.sol";
import "../interfaces/IToken.sol";
import "../interfaces/ITotalRewardPool.sol";
import "../interfaces/ITrfVariables.sol";

struct FluidityClientChange {
    string name;
    bool overwrite;
    address token;
    IFluidClient client;
}

/// @dev return type from getUtilityVars
struct ScannedUtilityVars {
    UtilityVars vars;
    string name;
}

contract Registry is IRegistry, ITotalRewardPool {

    /// @dev RegistrationType is a uint8 in practice, so it can be updated
    /// with a contract upgrade if the ABI changes
    event RegistrationMade(uint8 type_, address indexed addr);

    /// @notice emitted when a fluidity client is updated
    event FluidityClientChanged(
        address indexed token,
        string indexed name,
        address oldClient,
        address newClient
    );

    /// @dev TrfVariablesUpdated in the code
    event TrfVariablesUpdated(TrfVariables old, TrfVariables new_);

    /**
    * @dev operator_ able to access the permissioned functions on this
    * Registry (note: not Operator)
    */
    address private operator_;

    /// @notice tokenBeacon_ to be used as a helpful guide for the DAO
    IBeacon public tokenBeacon_;

    /// @notice compoundLiquidityProviderBeacon_ as a helpful guide for the DAO
    IBeacon public compoundLiquidityProviderBeacon_;

    /// @notice aaveV2LiquidityProviderBeacon_ as a helpful guide for the DAO
    IBeacon public aaveV2LiquidityProviderBeacon_;

    /// @notice aaveV3LiquidityProviderBeacon_ as a helpful guide for the DAO
    IBeacon public aaveV3LiquidityProviderBeacon_;

    Registration[] private registrations_;

    /// @dev token => utility name => fluid client
    mapping(address => mapping(string => IFluidClient)) private fluidityClients_;

    mapping(address => TrfVariables) private trfVariables_;

    constructor(
        address _operator,
        IBeacon _tokenBeacon,

        IBeacon _compoundLiquidityProviderBeacon,
        IBeacon _aaveV2LiquidityProviderBeacon,
        IBeacon _aaveV3LiquidityProviderBeacon
    ) {
        operator_ = _operator;
        tokenBeacon_ = _tokenBeacon;

        compoundLiquidityProviderBeacon_ = _compoundLiquidityProviderBeacon;
        aaveV2LiquidityProviderBeacon_ = _aaveV2LiquidityProviderBeacon;
        aaveV3LiquidityProviderBeacon_ = _aaveV3LiquidityProviderBeacon;
    }

    function _register(uint8 _type, address _contract) internal {
        registrations_.push(Registration({
            type_: _type,
            addr: _contract
        }));

        emit RegistrationMade(_type, _contract);
    }

    function register(uint8 _type, address _contract) public {
        require(operator_ == address(0) || msg.sender == operator_, "not allowed");

        _register(_type, _contract);
    }

    function registerMany(Registration[] calldata _registrations) public {
        require(operator_ == address(0) || msg.sender == operator_, "not allowed");

        for (uint i = 0; i < _registrations.length; i++)
          _register(_registrations[i].type_, _registrations[i].addr);
    }

    function registrations() public view returns (Registration[] memory) {
        return registrations_;
    }

    /// @inheritdoc ITotalRewardPool
    function getTotalRewardPool() public returns (uint256 cumulative) {
        for (uint i = 0; i < registrations_.length; i++) {
            Registration storage registration = registrations_[i];

            if (registration.type_ != RegistrationTypeToken) continue;

            IToken token = IToken(registration.addr);

            uint256 amount = token.rewardPoolAmount();

            uint8 decimals = token.decimals();

            require(18 >= decimals, "decimals too high");

            cumulative += amount * (10 ** (18 - decimals));
        }

        return cumulative;
    }

    function getFluidityClient(
        address _token,
        string memory _clientName
    ) public view returns (IFluidClient) {
        return fluidityClients_[_token][_clientName];
    }

    function updateUtilityClients(FluidityClientChange[] memory _clients) public {
        require(msg.sender == operator_, "only operator");

        for (uint i = 0; i < _clients.length; i++) {
            FluidityClientChange memory change = _clients[i];

            address oldClient = address(getFluidityClient(change.token, change.name));

            // either the old client must be unset (setting a completely new client)
            // or the overwrite option must be set

            require(oldClient == address(0) || change.overwrite, "no override");

            fluidityClients_[change.token][change.name] = change.client;

            emit FluidityClientChanged(
                change.token,
                change.name,
                oldClient,
                address(change.client)
            );
        }
    }

    /// @notice update the trf variables for a specific token
    function updateTrfVariables(address _token, TrfVariables calldata _trf) public {
        require(msg.sender == operator_, "only operator");

        emit TrfVariablesUpdated(trfVariables_[_token], _trf);

        trfVariables_[_token] = _trf;
    }

    function getTrfVariables(address _token) public view returns (TrfVariables memory) {
        return trfVariables_[_token];
    }

    /**
     * @notice fetches utility vars for several contracts by name
     * @param _token the token for which to fetch utilities
     * @param _names the list of names of utilities to fetch for
     *
     * @return an array of utility vars
     */
    function getUtilityVars(
        address _token,
        string[] memory _names
    ) public returns (ScannedUtilityVars[] memory) {
        ScannedUtilityVars[] memory vars = new ScannedUtilityVars[](_names.length);

        for (uint i = 0; i < _names.length; i++) {
            string memory name = _names[i];

            vars[i].name = name;

            IFluidClient utility = fluidityClients_[_token][name];

            // reverts if utility == 0 !
            vars[i].vars = utility.getUtilityVars();
        }

        return vars;
    }
}
