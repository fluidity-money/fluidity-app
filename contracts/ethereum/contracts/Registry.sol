// SPDX-License-Identifier: GPL

pragma solidity ^0.8.11;
pragma abicoder v2;

import "../interfaces/ILiquidityProvider.sol";
import "../interfaces/IOperatorOwned.sol";
import "../interfaces/IRegistry.sol";
import "../interfaces/IToken.sol";
import "../interfaces/ITokenOperatorOwned.sol";
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

contract Registry is IRegistry, ITotalRewardPool, IOperatorOwned {

    /// @notice emitted when a fluidity client is updated
    event FluidityClientChanged(
        address indexed token,
        string indexed name,
        address oldClient,
        address newClient
    );

    /// @dev TrfVariablesUpdated in the code
    event TrfVariablesUpdated(TrfVariables old, TrfVariables new_);

    uint8 private version_;

    /**
    * @dev operator_ able to access the permissioned functions on this
    * Registry (note: not Operator)
    */
    address private operator_;

    ITokenOperatorOwned[] private tokens_;

    ILiquidityProvider[] private liquidityProviders_;

    /// @dev token => utility name => fluid client
    mapping(address => mapping(string => IFluidClient)) private fluidityClients_;

    mapping(address => TrfVariables) private trfVariables_;

    function init(address _operator) public {
        require(version_ == 0, "already deployed");

        operator_ = _operator;

        version_ = 1;
    }

    function _registerToken(ITokenOperatorOwned _token) internal {
        tokens_.push(_token);
    }

    function registerToken(ITokenOperatorOwned _token) public {
        require(operator_ == address(0) || msg.sender == operator_, "not allowed");
        _registerToken(_token);
    }

    function registerManyTokens(ITokenOperatorOwned[] calldata _tokens) public {
        require(operator_ == address(0) || msg.sender == operator_, "not allowed");

        for (uint i = 0; i < _tokens.length; i++)
          _registerToken(_tokens[i]);
    }

    function _registerLiquidityProvider(ILiquidityProvider _lp) internal {
        liquidityProviders_.push(_lp);
    }

    function registerLiquidityProvider(ILiquidityProvider _lp) public {
        require(operator_ == address(0) || msg.sender == operator_, "not allowed");
        _registerLiquidityProvider(_lp);
    }

    function registerManyLiquidityProviders(ILiquidityProvider[] calldata _lps) public {
        require(operator_ == address(0) || msg.sender == operator_, "not allowed");

        for (uint i = 0; i < _lps.length; i++)
          _registerLiquidityProvider(_lps[i]);
    }

    function tokens() public view returns (ITokenOperatorOwned[] memory) {
        return tokens_;
    }

    /// @inheritdoc ITotalRewardPool
    function getTotalRewardPool() public returns (uint256 cumulative) {
        for (uint i = 0; i < tokens_.length; i++) {
            IToken token = tokens_[i];

            uint256 amount = token.rewardPoolAmount();

            uint8 decimals = token.decimals();

            require(18 >= decimals, "decimals too high");

            cumulative += amount * (10 ** (18 - decimals));
        }

        return cumulative;
    }

    function operator() public view returns (address) {
        return operator_;
    }

    function updateOperator(address _newOperator) public {
        require(msg.sender == operator(), "only operator");
        operator_ = _newOperator;
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
