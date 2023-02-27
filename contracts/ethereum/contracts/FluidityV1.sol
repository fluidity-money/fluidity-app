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
    CompoundLiquidityProvider compoundLiquidityProvider;
    AaveV2LiquidityProvider aaveV2LiquidityProvider;
    AaveV3LiquidityProvider aaveV3LiquidityProvider;
}

contract FluidityV1 {

    /* ~~~~~~ BEACONS ~~~~~~ */

    IUpgradeableBeacon public govTokenBeacon;

    IUpgradeableBeacon public registryBeacon;

    IUpgradeableBeacon public operatorBeacon;

    IUpgradeableBeacon public tokenBeacon;

    IUpgradeableBeacon public compoundLiquidityProviderBeacon;

    IUpgradeableBeacon public aaveV2LiquidityProviderBeacon;

    IUpgradeableBeacon public aaveV3LiquidityProviderBeacon;

    /* ~~~~~~ BEACON ADMIN ~~~~~~ */

    IProxyAdmin public beaconAdmin;

    /* ~~~~~~ PROXIES ~~~~~~ */

    Registry public registry;

    Operator public operator;

    /* ~~~~~~ Gov Token ~~~~~~ */

    GovToken public govToken;

    /* ~~~~~~ VE Lockup ~~~~~~ */

    VEGovLockup public veGovLockup;

    /* ~~~~~~ DAO ~~~~~~ */

    DAOV1 public dao;

    function deployBlueprint(
        address _blueprint,
        bytes memory _constructorArgs
    ) internal returns (address) {
        uint nLength;
        uint dataLength;

        uint size;

        address newContract;

        bytes memory data;

        assembly {
            // load the contract to memory
            size := extcodesize(_blueprint)

            // copy the length of the contract to memory
            extcodecopy(_blueprint, data, 0, size)
        }

        // test first two bytes have the preamble 0xFE71 set
        require(data[0] == 0xfE && data[1] == 0x71, "premable not set");

        assembly {
            // load the first byte of data containing the length
            nLength := and(mload(add(data, 2)), 0x0b11)
        }

        require(nLength != 0x0b11, "bad preamble");

        assembly {
            // load the next byte of data containing the length of the
            // arbitrary details field...
            dataLength := mload(add(data, add(nLength, 3)))

            // append to the bytecode in memory the constructor arguments
            // TODO

            // from memory, select the initcode and use it as arguments to CREATE
            newContract := create(0, add(data, dataLength), sub(size, dataLength))
        }

        return newContract;
    }

    function deployUpgradeableBeacon(
        address _blueprint,
        address _implementation
    ) internal returns (IUpgradeableBeacon) {
        return IUpgradeableBeacon(
            deployBlueprint(_blueprint, abi.encode(
                _implementation
            )
        ));
    }

    function setBeacons(
        address _upgradeableBeaconBlueprint,
        Implementations memory _impls
    ) internal {
        registryBeacon = deployUpgradeableBeacon(
            _upgradeableBeaconBlueprint,
            address(_impls.registry)
        );

        operatorBeacon = deployUpgradeableBeacon(
            _upgradeableBeaconBlueprint,
            address(_impls.operator)
        );

        tokenBeacon = deployUpgradeableBeacon(
            _upgradeableBeaconBlueprint,
            address(_impls.token)
        );

        compoundLiquidityProviderBeacon = deployUpgradeableBeacon(
            _upgradeableBeaconBlueprint,
            address(_impls.compoundLiquidityProvider)
        );

        aaveV2LiquidityProviderBeacon = deployUpgradeableBeacon(
            _upgradeableBeaconBlueprint,
            address(_impls.aaveV2LiquidityProvider)
        );

        aaveV3LiquidityProviderBeacon = deployUpgradeableBeacon(
            _upgradeableBeaconBlueprint,
            address(_impls.aaveV3LiquidityProvider)
        );
    }

    function deployBeaconProxy(
        address _blueprint,
        address _beacon,
        bytes memory _constructor
    ) internal returns (address) {
        return deployBlueprint(_blueprint, abi.encode(
            _beacon,
            _constructor
        ));
    }

    function setBeaconAdmins() internal {
        beaconAdmin = IProxyAdmin(address(new ProxyAdmin()));

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

        address _beaconProxyBlueprint,
        address _upgradeableBeaconBlueprint,

        address _govTokenBlueprint,
        address _veGovLockupBlueprint,
        address _daoBlueprint,

        Implementations memory _impls
    ) {
        setBeacons(_upgradeableBeaconBlueprint, _impls);

        setBeaconAdmins();

        // now that we have some deployments of the beacons, we can
        // create the DAO, the Registry, the GovToken and the Operator

        registry = Registry(deployBeaconProxy(
            _beaconProxyBlueprint,
            address(registryBeacon),
            abi.encodeWithSelector(
                Registry.init.selector,
                address(this)
            )
        ));

        operator = Operator(deployBeaconProxy(
            _beaconProxyBlueprint,
            address(operatorBeacon),
            abi.encodeWithSelector(
                Operator.init.selector,
                address(this),
                _emergencyCouncil
            )
        ));

        govToken = GovToken(deployBlueprint(
            _govTokenBlueprint,
            abi.encodeWithSelector(
                GovToken.init.selector,
                _govTokenName,
                _govTokenSymbol,
                _govTokenDecimals,
                _govTokenTotalSupply
            )
        ));

        veGovLockup = VEGovLockup(deployBlueprint(
            _veGovLockupBlueprint,
            abi.encode(
                _emergencyCouncil,
                govToken
            )
        ));

        dao = DAOV1(deployBlueprint(_daoBlueprint, abi.encode(
            _emergencyCouncil,
            veGovLockup
        )));

        govToken.transfer(address(dao), _govTokenTotalSupply);

        veGovLockup.updateOperator(address(dao));

        registry.updateOperator(address(dao));

        operator.updateOperator(address(dao));
    }
}
