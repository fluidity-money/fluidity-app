// SPDX-License-Identifier: GPL

pragma solidity ^0.8.11;
pragma abicoder v2;

import "@openzeppelin/contracts/proxy/beacon/BeaconProxy.sol";

import "./openzeppelin/IUpgradeableBeacon.sol";

import "./compound/CTokenInterfaces.sol";

import "./aave/IAToken.sol";

import {
    LendingPoolAddressesProviderInterface as AaveV2LendingPoolAddressesProviderInterface
} from "./aaveV2/ATokenInterfaces.sol";

import {
    PoolAddressesProviderInterface as AaveV3PoolAddressesProviderInterface
} from "./aaveV3/ATokenInterfaces.sol";

import "./ILiquidityProvider.sol";
import "./IEmergencyMode.sol";

import "./IRegistry.sol";

/// @dev selector for the token's init function
bytes4 constant TOKEN_INIT_SELECTOR =
  bytes4(keccak256("init(address,uint8,string,string,address,address,address)"));

/// @dev selector for compound's liquidity provider init function
bytes4 constant LIQUIDITY_PROVIDER_COMPOUND_INIT_SELECTOR =
  bytes4(keccak256("init(address,address)"));

/// @dev selector for aave v2's liquidity provider init function
/// @dev
bytes4 constant LIQUIDITY_PROVIDER_AAVEV2_INIT_SELECTOR =
  bytes4(keccak256("init(address,address,address)"));

/// @dev selector for aave v3's liquidity provider init function
/// @dev keccak(init(address,address,address))
bytes4 constant LIQUIDITY_PROVIDER_AAVEV3_INIT_SELECTOR = bytes4(keccak256("init(address,address,address)"));

contract DAOUtilityV1 {
    function upgradeBeacon(
        IUpgradeableBeacon _beacon,
        address _oldImplementation,
        address _newImplementation
    )
        public
    {
        require(address(_beacon) != address(0), "zero address");

        require(
            _beacon.implementation() == _oldImplementation,
            "old impl not consistent"
        );

        _beacon.upgradeTo(_newImplementation);
    }

    /**
     * @notice deployNewToken and register it with Registry
     * @param _beacon to use to source the implementation address
     * @param _registry to use to register the token deployment
     * @param _liquidityProvider to use to get the underlying yield for
     * @param _fluidTokenName to use as the name of the Fluid Asset
     * @param _fluidSymbol to use as the symbol for the Fluid Asset
     * @param _emergencyCouncil that is permitted to trigger the emergency features
     * @param _oracle that is permitted to call the trusted methods on the Token
     * @param _decimals to use for the underlying asset (and to set for this!)
     *
     * @dev uses the sender address as the operator/emergency council!
     */
    function deployNewToken(
        IBeacon _beacon,
        IRegistry _registry,
        ILiquidityProvider _liquidityProvider,
        string memory _fluidTokenName,
        string memory _fluidSymbol,
        address _emergencyCouncil,
        address _oracle,
        uint8 _decimals
    )
        public returns (address)
    {
        require(address(_beacon) != address(0), "beacon is null");
        require(address(_liquidityProvider) != address(0), "liquidity provider null");

        BeaconProxy beaconProxy = new BeaconProxy(
            address(_beacon),
            abi.encodeWithSelector(
                TOKEN_INIT_SELECTOR,
                address(_liquidityProvider),
                _decimals,
                _fluidTokenName,
                _fluidSymbol,
                _emergencyCouncil,
                address(this),
                _oracle
            )
         );

         // check that the setup went okay

         IERC20 token = IERC20(address(beaconProxy));

         require(
             token.decimals() == _decimals,
             "decimals in deploy not consistent"
         );

         // register the token

         _registry.register(RegistrationType.TOKEN, address(beaconProxy));

         return address(beaconProxy);
    }

    /**
     * @notice deployNewCompoundLiquidityProvider and register it with Registry
     * @param _cToken to use as the underlying for the pool
     * @param _beacon to use to source the implementation address
     * @param _registry to use to register the token deployment
     */
    function deployNewCompoundLiquidityProvider(
        CErc20Interface _cToken,
        IBeacon _beacon,
        IRegistry _registry
    )
        public returns (address)
    {
        require(address(_beacon) != address(0), "beacon is null");

        BeaconProxy beaconProxy = new BeaconProxy(
            address(_beacon),
            abi.encodeWithSelector(
                LIQUIDITY_PROVIDER_COMPOUND_INIT_SELECTOR,
                address(_cToken),
                address(this)
            )
         );

         // check that the implementation deployment went okay

         ILiquidityProvider lp = ILiquidityProvider(address(beaconProxy));

         require(lp.totalPoolAmount() == 0, "implementation didn't get created");

         // register the liquidity provider

         _registry.register(RegistrationType.TOKEN, address(beaconProxy));

         return address(beaconProxy);
    }

    /**
     * @notice deployNewAaveV2LiquidityProvider and register it with Registry
     * @param _addressProvider to get the lending pool with
     * @param _beacon to use to source the implementation address
     * @param _registry to use to register the token deployment
     */
    function deployNewAaveV2LiquidityProvider(
        AaveV2LendingPoolAddressesProviderInterface _addressProvider,
        IAToken _aToken,
        IBeacon _beacon,
        IRegistry _registry
    )
        public returns (address)
    {
        require(address(_beacon) != address(0), "beacon is null");

        BeaconProxy beaconProxy = new BeaconProxy(
            address(_beacon),
            abi.encodeWithSelector(
                LIQUIDITY_PROVIDER_AAVEV2_INIT_SELECTOR,
                address(_addressProvider),
                address(_aToken),
                address(this)
            )
         );

         // check that the setup went okay

         ILiquidityProvider lp = ILiquidityProvider(address(beaconProxy));

         require(lp.totalPoolAmount() == 0, "implementation didn't get created");

         // register the liquidity provider

         _registry.register(RegistrationType.TOKEN, address(beaconProxy));

         return address(beaconProxy);
    }

    /**
     * @notice deployNewAaveV3LiquidityProvider and register it with Registry
     * @param _addressProvider to get the lending pool with
     * @param _beacon to use to source the implementation address
     * @param _registry to use to register the token deployment
     */
    function deployNewAaveV3LiquidityProvider(
        AaveV3PoolAddressesProviderInterface _addressProvider,
        IAToken _aToken,
        IBeacon _beacon,
        IRegistry _registry
    )
        public returns (address)
    {
        require(address(_beacon) != address(0), "beacon is null");

        BeaconProxy beaconProxy = new BeaconProxy(
            address(_beacon),
            abi.encodeWithSelector(
                LIQUIDITY_PROVIDER_AAVEV3_INIT_SELECTOR,
                address(_addressProvider),
                address(_aToken),
                address(this)
            )
         );

         // check that the setup went okay

         ILiquidityProvider lp = ILiquidityProvider(address(beaconProxy));

         require(lp.totalPoolAmount() == 0, "implementation didn't get created");

         // register the liquidity provider

         _registry.register(RegistrationType.TOKEN, address(beaconProxy));

         return address(beaconProxy);
    }

    /// @notice disableAddresses given using `enableEmergencyMode()`
    function disableAddresses(IEmergencyMode[] memory _addresses) public {
        for (uint256 i = 0; i < _addresses.length; i++)
            _addresses[i].enableEmergencyMode();
    }
}
