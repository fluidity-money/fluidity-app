// SPDX-License-Identifier: GPL

pragma solidity ^0.8.11;
pragma abicoder v2;

import "@openzeppelin/contracts/proxy/beacon/IBeacon.sol";

import "./IToken.sol";
import "./ILiquidityProvider.sol";
import "./IToken.sol";
import "./IRegistry.sol";

import "./TrfVariables.sol";

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

contract Registry is IRegistry {

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

    function operatorNotRequiredOrIsOperator() public view returns (bool) {
        return operator_ == address(0) || msg.sender == operator_;
    }

    function _register(uint8 _type, address _contract) internal {
        registrations_.push(Registration({
            type_: _type,
            addr: _contract
        }));

        emit RegistrationMade(_type, _contract);
    }

    function register(uint8 _type, address _contract) public {
        require(operatorNotRequiredOrIsOperator(), "not allowed");

        _register(_type, _contract);
    }

    function registerMany(Registration[] calldata _registrations) public {
        require(operatorNotRequiredOrIsOperator(), "not allowed");

        for (uint i = 0; i < _registrations.length; i++)
          _register(_registrations[i].type_, _registrations[i].addr);
    }

    function registrations() public view returns (Registration[] memory) {
        return registrations_;
    }

    /// @inheritdoc IRegistry
    function getRewardPools() public returns (RewardPool[] memory) {

        // Create 13 items for the RewardPool, assuming that the values
        // will be (1e6, 1e7, 1e8, 1e9, 1e10, 1e11, 1e12, 1e13, 1e14, 1e15, 1e16,
        // 1e17, 1e18)

        RewardPool[] memory rewardPools = new RewardPool[](13);

        for (uint i = 0; i < registrations_.length; i++) {
            Registration storage registration = registrations_[i];

            if (registration.type_ != RegistrationTypeToken) continue;

            IToken token = IToken(registration.addr);

            uint8 decimals = token.decimals();

            uint pos;

            if (decimals == 6) pos = 0;
            else if (decimals == 7) pos = 1;
            else if (decimals == 8) pos = 2;
            else if (decimals == 9) pos = 3;
            else if (decimals == 10) pos = 4;
            else if (decimals == 11) pos = 5;
            else if (decimals == 12) pos = 6;
            else if (decimals == 13) pos = 7;
            else if (decimals == 14) pos = 8;
            else if (decimals == 15) pos = 9;
            else if (decimals == 16) pos = 10;
            else if (decimals == 17) pos = 11;
            else if (decimals == 18) pos = 12;
            else revert("registry upgrade");

            rewardPools[pos].decimals = decimals;
            rewardPools[pos].amount += token.rewardPoolAmount();
        }

        return rewardPools;
    }

    function getFluidityClient(
        address _token,
        string memory _clientName
    ) public view returns (IFluidClient) {
        return fluidityClients_[_token][_clientName];
    }

    function updateUtilityClients(FluidityClientChange[] memory _clients) public {
        require(msg.sender == operator_, "only the operator account can use this");

        for (uint i = 0; i < _clients.length; i++) {
            FluidityClientChange memory change = _clients[i];

            address oldClient = address(getFluidityClient(change.token, change.name));

            // either the old client must be unset (setting a completely new client)
            // or the overwrite option must be set

            require(
                oldClient == address(0) || change.overwrite,
                "trying to overwrite a client without the overwrite option set!"
            );

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
        require(msg.sender == operator_, "only operator account can use this");

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
