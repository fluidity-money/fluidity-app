// SPDX-License-Identifier: GPL

pragma solidity 0.8.16;
pragma abicoder v2;

import "@openzeppelin/contracts/proxy/beacon/BeaconProxy.sol";

import "../../interfaces/aave/IAToken.sol";

import "../../interfaces/compound/CTokenInterfaces.sol";

import "../../interfaces/IEmergencyMode.sol";
import "../../interfaces/ILiquidityProvider.sol";
import "../../interfaces/IRegistry.sol";
import "../../interfaces/IToken.sol";
import "../../interfaces/ITokenOperatorOwned.sol";
import "../../interfaces/ITrfVariables.sol";

import {
    LendingPoolAddressesProviderInterface as AaveV2LendingPoolAddressesProviderInterface
} from "../../interfaces/aaveV2/ATokenInterfaces.sol";

import {
    PoolAddressesProviderInterface as AaveV3PoolAddressesProviderInterface
} from "../../interfaces/aaveV3/ATokenInterfaces.sol";

import { Token } from "../Token.sol";

import "../Executor.sol";

import "../CompoundLiquidityProvider.sol";

import "../AaveV2LiquidityProvider.sol";

import "../AaveV3LiquidityProvider.sol";

/// @dev selector for the token's init function
bytes4 constant TOKEN_INIT_SELECTOR = Token.init.selector;

/// @dev selector for compound's liquidity provider init function
bytes4 constant LIQUIDITY_PROVIDER_COMPOUND_INIT_SELECTOR =
    CompoundLiquidityProvider.init.selector;

/// @dev selector for aave v2's liquidity provider init function
/// @dev
bytes4 constant LIQUIDITY_PROVIDER_AAVEV2_INIT_SELECTOR =
    AaveV2LiquidityProvider.init.selector;

/// @dev selector for aave v3's liquidity provider init function
/// @dev keccak(init(address,address,address))
bytes4 constant LIQUIDITY_PROVIDER_AAVEV3_INIT_SELECTOR =
    AaveV3LiquidityProvider.init.selector;

/// @dev TokenCreationArguments for when running out of stack space
struct TokenCreationArguments {
    ILiquidityProvider liquidityProvider;
    string fluidTokenName;
    string fluidSymbol;
    address emergencyCouncil;
    address oracle;
    uint8 decimals;
}

struct CompoundLiquidityProviderCreationArguments {
    CErc20Interface cToken;
}

struct AaveV2LiquidityProviderCreationArguments {
    AaveV2LendingPoolAddressesProviderInterface addressProvider;
    IAToken aToken;
}

struct AaveV3LiquidityProviderCreationArguments {
    AaveV3PoolAddressesProviderInterface addressProvider;
    IAToken aToken;
}

contract DAOUtilityV1 {

    function defaultEthereumTrfVariables() public pure returns (TrfVariables memory) {
        return TrfVariables({
            currentAtxTransactionMargin: 0,
            defaultTransfersInBlock: 0,
            spoolerInstantRewardThreshold: 1,
            spoolerBatchedRewardThreshold: 1,
            defaultSecondsSinceLastBlock: 13,
            atxBufferSize: 10
        });
    }

    function defaultArbitrumTrfVariables() public pure returns (TrfVariables memory) {
        return TrfVariables({
            currentAtxTransactionMargin: 0,
            defaultTransfersInBlock: 0,
            spoolerInstantRewardThreshold: 1,
            spoolerBatchedRewardThreshold: 1,
            defaultSecondsSinceLastBlock: 1,
            atxBufferSize: 10
        });
    }

    /**
     * @notice deployNewToken and register it with Registry
     * @param _args to get the arguments to create the token with
     * @param _trfVariables to use for the trf variables
     * @param _executor to use to configure the token configuration for the deployed asset
     *
     * @dev uses the sender address as the operator/emergency council!
     */
    function deployNewToken(
        TokenCreationArguments memory _args,
        IBeacon _beacon,
        TrfVariables memory _trfVariables,
        IRegistry _registry,
        Executor _executor
    ) public returns (IToken) {
        BeaconProxy beaconProxy = new BeaconProxy(
            address(_beacon),
            abi.encodeWithSelector(
                TOKEN_INIT_SELECTOR,
                address(_args.liquidityProvider), // _liquidityProvider
                _args.decimals,                   // _decimals
                _args.fluidTokenName,             // _name
                _args.fluidSymbol,                // _symbol
                _args.emergencyCouncil,           // _emergencyCouncil
                address(this),                    // _operator
                address(_executor)                // _oracle
            )
         );

         // check that the setup went okay

         ITokenOperatorOwned token = ITokenOperatorOwned(address(beaconProxy));

         require(
             token.decimals() == _args.decimals,
             "decimals in deploy not consistent"
         );

         // register the token

         _registry.registerToken(token);

         // set up the variables for the TRF

         _registry.updateTrfVariables(address(beaconProxy), _trfVariables);

         // start to set up the operator for the token deployed

         _executor.updateOracle(address(beaconProxy), address(_args.oracle));

         return token;
    }

    /**
     * @notice deployNewCompoundLiquidityProvider and register it with Registry
     * @param _args to destructure to use in the creation of the CompoundLiquidityProvider
     * @param _beacon to use to source the implementation address
     * @param _registry to use to register the token deployment
     */
    function deployNewCompoundLiquidityProvider(
        CompoundLiquidityProviderCreationArguments memory _args,
        IBeacon _beacon,
        IRegistry _registry
    ) public returns (ILiquidityProvider) {
        BeaconProxy beaconProxy = new BeaconProxy(
            address(_beacon),
            abi.encodeWithSelector(
                LIQUIDITY_PROVIDER_COMPOUND_INIT_SELECTOR,
                address(_args.cToken),
                address(this)
            )
         );

         // check that the implementation deployment went okay

         ILiquidityProvider lp = ILiquidityProvider(address(beaconProxy));

         require(lp.totalPoolAmount() == 0, "implementation didn't get created");

         // register the liquidity provider

         _registry.registerLiquidityProvider(lp);

         return lp;
    }

    /**
     * @notice deployNewAaveV2LiquidityProvider and register it with Registry
     * @param _args to use in the creation of the liquidity provider for AAVE v2
     * @param _beacon to use to source the implementation address
     * @param _registry to use to register the token deployment
     */
    function deployNewAaveV2LiquidityProvider(
        AaveV2LiquidityProviderCreationArguments memory _args,
        IBeacon _beacon,
        IRegistry _registry
    ) public returns (ILiquidityProvider) {
        BeaconProxy beaconProxy = new BeaconProxy(
            address(_beacon),
            abi.encodeWithSelector(
                LIQUIDITY_PROVIDER_AAVEV2_INIT_SELECTOR,
                address(_args.addressProvider),
                address(_args.aToken),
                address(this)
            )
         );

         // check that the setup went okay

         ILiquidityProvider lp = ILiquidityProvider(address(beaconProxy));

         require(lp.totalPoolAmount() == 0, "implementation didn't get created");

         // register the liquidity provider

         _registry.registerLiquidityProvider(lp);

         return lp;
    }

    /**
     * @notice deployNewAaveV3LiquidityProvider and register it with Registry
     * @param _args to destructure in the creation of the AAVE v3 LiquidityProvider
     * @param _beacon to use to source the implementation address
     * @param _registry to use to register the token deployment
     *
     * @dev WARNING! untested
     */
    function deployNewAaveV3LiquidityProvider(
        AaveV3LiquidityProviderCreationArguments memory _args,
        IBeacon _beacon,
        IRegistry _registry
    ) public returns (ILiquidityProvider) {
        BeaconProxy beaconProxy = new BeaconProxy(
            address(_beacon),
            abi.encodeWithSelector(
                LIQUIDITY_PROVIDER_AAVEV3_INIT_SELECTOR,
                address(_args.addressProvider),
                address(_args.aToken),
                address(this)
            )
         );

         // check that the setup went okay

         ILiquidityProvider lp = ILiquidityProvider(address(beaconProxy));

         require(lp.totalPoolAmount() == 0, "implementation didn't get created");

         // register the liquidity provider

         _registry.registerLiquidityProvider(lp);

         return lp;
    }

    function deployNewCompoundToken(
        IBeacon _tokenBeacon,
        IBeacon _compoundBeacon,
        IRegistry _registry,

        // compound liquidity provider arguments
        CompoundLiquidityProviderCreationArguments memory _lpArgs,

        // token arguments
        TokenCreationArguments memory _tokenArgs,

        // registry arguments
        TrfVariables memory _trfVariables,
        Executor _executor
    ) public returns (ILiquidityProvider, IToken) {
        ILiquidityProvider lp = deployNewCompoundLiquidityProvider(
            _lpArgs,
            _compoundBeacon,
            _registry
        );

        _tokenArgs.liquidityProvider = lp;

        IToken token = deployNewToken(
            _tokenArgs,
            _tokenBeacon,
            _trfVariables,
            _registry,
            _executor
        );

        return (lp, token);
    }

    function deployNewAaveV2Token(
        IBeacon _tokenBeacon,
        IBeacon _aaveV2LiquidityProviderBeacon,
        IRegistry _registry,

        // aave v2 liquidity provider arguments
        AaveV2LiquidityProviderCreationArguments memory _lpArgs,

        // token arguments
        TokenCreationArguments memory _tokenArgs,

        // registry arguments
        TrfVariables memory _trfVariables,
        Executor _executor
    ) public returns (ILiquidityProvider, IToken) {
        ILiquidityProvider lp = deployNewAaveV2LiquidityProvider(
            _lpArgs,
            _aaveV2LiquidityProviderBeacon,
            _registry
        );

        _tokenArgs.liquidityProvider = lp;

        IToken token = deployNewToken(
            _tokenArgs,
            _tokenBeacon,
            _trfVariables,
            _registry,
            _executor
        );

        return (lp, token);
    }

    function deployNewAaveV3Token(
        IBeacon _tokenBeacon,
        IBeacon _aaveV3LiquidityProviderBeacon,
        IRegistry _registry,

        // aave v3 liquidity provider arguments
        AaveV3LiquidityProviderCreationArguments memory _lpArgs,

        // token arguments
        TokenCreationArguments memory _tokenArgs,

        // registry arguments
        TrfVariables memory _trfVariables,
        Executor _executor
    ) public returns (ILiquidityProvider, IToken) {
        ILiquidityProvider lp = deployNewAaveV3LiquidityProvider(
            _lpArgs,
            _aaveV3LiquidityProviderBeacon,
            _registry
        );

        _tokenArgs.liquidityProvider = lp;

        IToken token = deployNewToken(
            _tokenArgs,
            _tokenBeacon,
            _trfVariables,
            _registry,
            _executor
        );

        return (lp, token);
    }

    function deployNewCompoundTokenWithDefaultEthTrfVars(
        IBeacon _tokenBeacon,
        IBeacon _compoundBeacon,
        IRegistry _registry,

        // compound liquidity provider arguments
        CompoundLiquidityProviderCreationArguments memory _lpArgs,

        // token arguments
        TokenCreationArguments memory _tokenArgs,

        // registry arguments
        Executor _executor
    ) public returns (ILiquidityProvider, IToken) {
        return deployNewCompoundToken(
            _tokenBeacon,
            _compoundBeacon,
            _registry,
            _lpArgs,
            _tokenArgs,
            defaultEthereumTrfVariables(),
            _executor
        );
    }

    function deployNewAaveV2TokenWithDefaultEthTrfVars(
        IBeacon _tokenBeacon,
        IBeacon _aaveV2LiquidityProviderBeacon,
        IRegistry _registry,

        // aave v2 liquidity provider arguments
        AaveV2LiquidityProviderCreationArguments memory _lpArgs,

        // token arguments
        TokenCreationArguments memory _tokenArgs,

        // registry arguments
        Executor _executor
    ) public returns (ILiquidityProvider, IToken) {
        return deployNewAaveV2Token(
            _tokenBeacon,
            _aaveV2LiquidityProviderBeacon,
            _registry,
            _lpArgs,
            _tokenArgs,
            defaultEthereumTrfVariables(),
            _executor
        );
    }

    function deployNewAaveV3TokenWithDefaultEthTrfVars(
        IBeacon _tokenBeacon,
        IBeacon _aaveV3LiquidityProviderBeacon,
        IRegistry _registry,

        // aave v3 liquidity provider arguments
        AaveV3LiquidityProviderCreationArguments memory _lpArgs,

        // token arguments
        TokenCreationArguments memory _tokenArgs,

        // registry arguments
        Executor _executor
    ) public returns (ILiquidityProvider, IToken) {
        return deployNewAaveV3Token(
            _tokenBeacon,
            _aaveV3LiquidityProviderBeacon,
            _registry,
            _lpArgs,
            _tokenArgs,
            defaultEthereumTrfVariables(),
            _executor
        );
    }

    function deployNewCompoundTokenWithDefaultArbTrfVars(
        IBeacon _tokenBeacon,
        IBeacon _compoundBeacon,
        IRegistry _registry,

        // compound liquidity provider arguments
        CompoundLiquidityProviderCreationArguments memory _lpArgs,

        // token arguments
        TokenCreationArguments memory _tokenArgs,

        // registry arguments
        Executor _executor
    ) public returns (ILiquidityProvider, IToken) {
        return deployNewCompoundToken(
            _tokenBeacon,
            _compoundBeacon,
            _registry,
            _lpArgs,
            _tokenArgs,
            defaultArbitrumTrfVariables(),
            _executor
        );
    }

    function deployNewAaveV2TokenWithDefaultArbTrfVars(
        IBeacon _tokenBeacon,
        IBeacon _aaveV2LiquidityProviderBeacon,
        IRegistry _registry,

        // aave v2 liquidity provider arguments
        AaveV2LiquidityProviderCreationArguments memory _lpArgs,

        // token arguments
        TokenCreationArguments memory _tokenArgs,

        // registry arguments
        Executor _executor
    ) public returns (ILiquidityProvider, IToken) {
        return deployNewAaveV2Token(
            _tokenBeacon,
            _aaveV2LiquidityProviderBeacon,
            _registry,
            _lpArgs,
            _tokenArgs,
            defaultArbitrumTrfVariables(),
            _executor
        );
    }

    function deployNewAaveV3TokenWithDefaultArbTrfVars(
        IBeacon _tokenBeacon,
        IBeacon _aaveV3LiquidityProviderBeacon,
        IRegistry _registry,

        // aave v3 liquidity provider arguments
        AaveV3LiquidityProviderCreationArguments memory _lpArgs,

        // token arguments
        TokenCreationArguments memory _tokenArgs,

        // registry arguments
        Executor _executor
    ) public returns (ILiquidityProvider, IToken) {
        return deployNewAaveV3Token(
            _tokenBeacon,
            _aaveV3LiquidityProviderBeacon,
            _registry,
            _lpArgs,
            _tokenArgs,
            defaultArbitrumTrfVariables(),
            _executor
        );
    }

    function updateTrfVariables(
        IRegistry _registry,
        address _token,
        uint256 _currentAtxTransactionMargin,
        uint256 _defaultTransfersInBlock,
        uint256 _spoolerInstantRewardThreshold,
        uint256 _spoolerBatchedRewardThreshold,
        uint8 _defaultSecondsSinceLastBlock,
        uint8 _atxBufferSize
    ) public {
        TrfVariables memory variables = TrfVariables({
            currentAtxTransactionMargin: _currentAtxTransactionMargin,
            defaultTransfersInBlock: _defaultTransfersInBlock,
            spoolerInstantRewardThreshold: _spoolerInstantRewardThreshold,
            spoolerBatchedRewardThreshold: _spoolerBatchedRewardThreshold,
            defaultSecondsSinceLastBlock: _defaultSecondsSinceLastBlock,
            atxBufferSize: _atxBufferSize
        });

        _registry.updateTrfVariables(_token, variables);
    }

    /// @notice disableAddresses given using `enableEmergencyMode()`
    function disableAddresses(IEmergencyMode[] calldata _addresses) public {
        for (uint256 i = 0; i < _addresses.length; ++i)
            _addresses[i].enableEmergencyMode();
    }

    /// @notice enableAddresses given using `enableEmergencyMode()`
    function enableAddresses(IEmergencyMode[] calldata _addresses) public {
        for (uint256 i = 0; i < _addresses.length; ++i)
            _addresses[i].disableEmergencyMode();
    }
}
