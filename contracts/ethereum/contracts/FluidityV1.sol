// SPDX-License-Identifier: GPL

pragma solidity ^0.8.11;
pragma abicoder v2;

import "@openzeppelin/contracts/proxy/beacon/UpgradeableBeacon.sol";
import "@openzeppelin/contracts/proxy/beacon/BeaconProxy.sol";
import "@openzeppelin/contracts/proxy/transparent/ProxyAdmin.sol";

import "../interfaces/openzeppelin/IProxyAdmin.sol";

import "./AaveV2LiquidityProvider.sol";
import "./AaveV3LiquidityProvider.sol";
import "./CompoundLiquidityProvider.sol";
import "./DAOV1.sol";
import "./Registry.sol";
import "./Token.sol";
import "./VEGovLockup.sol";

struct Implementations {
    GovToken govToken;
    VEGovLockup veGovLockup;
    Registry registry;
    Operator operator;
    Token token;
    CompoundLiquidityProvider compoundLp;
    AaveV2LiquidityProvider aaveV2;
    AaveV3LiquidityProvider aaveV3;
}

contract FluidityV1 {

    /* ~~~~~~ BEACONS ~~~~~~ */

    IUpgradeableBeacon public govTokenBeacon;

    IUpgradeableBeacon public veGovLockupBeacon;

    IUpgradeableBeacon public registryBeacon;

    IUpgradeableBeacon public operatorBeacon;

    IUpgradeableBeacon public tokenBeacon;

    IUpgradeableBeacon public compoundLiquidityProviderBeacon;

    IUpgradeableBeacon public aaveV2LiquidityProviderBeacon;

    IUpgradeableBeacon public aaveV3LiquidityProviderBeacon;

    /* ~~~~~~ BEACON ADMIN ~~~~~~ */

    IProxyAdmin public beaconAdmin;

    /* ~~~~~~ PROXIES ~~~~~~ */

    GovToken public govToken;

    VEGovLockup public veGovLockup;

    Registry public registry;

    Operator public operator;

    /* ~~~~~~ DAO ~~~~~~ */

    DAOV1 public dao;

    function setBeacons(Implementations memory _impls) internal {
        govTokenBeacon = IUpgradeableBeacon(address(
            new UpgradeableBeacon(address(_impls.govToken))
        ));

        veGovLockupBeacon = IUpgradeableBeacon(address(
            new UpgradeableBeacon(address(_impls.veGovLockup))
        ));

        registryBeacon = IUpgradeableBeacon(address(
            new UpgradeableBeacon(address(_impls.registry))
        ));

        operatorBeacon = IUpgradeableBeacon(address(
            new UpgradeableBeacon(address(_impls.operator))
        ));

        tokenBeacon = IUpgradeableBeacon(address(
            new UpgradeableBeacon(address(_impls.token))
        ));

        compoundLiquidityProviderBeacon = IUpgradeableBeacon(address(
            new UpgradeableBeacon(address(_impls.compoundLp))
        ));

        aaveV2LiquidityProviderBeacon = IUpgradeableBeacon(address(
            new UpgradeableBeacon(address(_impls.aaveV2))
        ));

        aaveV3LiquidityProviderBeacon = IUpgradeableBeacon(address(
            new UpgradeableBeacon(address(_impls.aaveV3))
        ));
    }

    function setBeaconAdmins() internal {
        beaconAdmin = IProxyAdmin(address(new ProxyAdmin()));

        govTokenBeacon.changeAdmin(beaconAdmin);

        veGovLockupBeacon.changeAdmin(beaconAdmin);

        registryBeacon.changeAdmin(beaconAdmin);

        operatorBeacon.changeAdmin(beaconAdmin);

        tokenBeacon.changeAdmin(beaconAdmin);

        compoundLiquidityProviderBeacon.changeAdmin(beaconAdmin);

        aaveV2LiquidityProviderBeacon.changeAdmin(beaconAdmin);

        aaveV3LiquidityProviderBeacon.changeAdmin(beaconAdmin);
    }

    constructor(
        address _emergencyCouncil,
        string memory _govTokenName,
        string memory _govTokenSymbol,
        uint8 _govTokenDecimals,
        uint256 _govTokenTotalSupply,
        Implementations memory _impls
    ) {

        setBeacons(_impls);

        setBeaconAdmins();

        // now that we have some deployments of the beacons, we can
        // create the DAO, the Registry, the GovToken and the Operator

        BeaconProxy govTokenProxy = new BeaconProxy(
            address(govTokenBeacon),
            abi.encodeWithSelector(
                GovToken.init.selector,
                _govTokenName,
                _govTokenSymbol,
                _govTokenDecimals,
                _govTokenTotalSupply
            )
        );

        govToken = GovToken(address(govTokenProxy));

        BeaconProxy veGovLockupProxy = new BeaconProxy(
            address(veGovLockupBeacon),
            abi.encodeWithSelector(
                VEGovLockup.init.selector,
                _emergencyCouncil,
                govToken
            )
        );

        veGovLockup = VEGovLockup(address(veGovLockupProxy));

        BeaconProxy registryProxy = new BeaconProxy(
            address(registryBeacon),
            abi.encodeWithSelector(
                Registry.init.selector,
                address(this)
            )
        );

        registry = Registry(address(registryProxy));

        BeaconProxy operatorProxy = new BeaconProxy(
            address(operatorBeacon),
            abi.encodeWithSelector(
                Operator.init.selector,
                address(this),
                _emergencyCouncil
            )
        );

        operator = Operator(address(operatorProxy));

        dao = new DAOV1(_emergencyCouncil, veGovLockup);

        govToken.transfer(address(dao), _govTokenTotalSupply);

        veGovLockup.updateOperator(address(dao));

        registry.updateOperator(address(dao));

        operator.updateOperator(address(dao));
    }
}
