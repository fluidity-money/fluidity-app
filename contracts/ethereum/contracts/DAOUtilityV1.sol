// SPDX-License-Identifier: GPL

pragma solidity ^0.8.11;
pragma abicoder v2;

import "@openzeppelin/contracts/proxy/beacon/BeaconProxy.sol";

import "./openzeppelin/IUpgradeableBeacon.sol";

import "./ILiquidityProvider.sol";
import "./IEmergencyMode.sol";

/// @dev selector for the token's init function
string constant TOKEN_INIT_SELECTOR = "init(address,uint8,string,string,address,address,address)";

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

    function deployNewToken(
        string memory _fluidTokenName,
        string memory _fluidSymbol,
        uint8 _decimals,
        ILiquidityProvider _liquidityProvider,
        IBeacon _beacon,
        address _operator,
        address _emergencyCouncil
    )
        external returns (address)
    {
        require(address(_beacon) != address(0), "beacon is null");
        require(address(_liquidityProvider) != address(0), "liquidity provider null");

        BeaconProxy beaconProxy = new BeaconProxy(
            address(_beacon),
            abi.encodeWithSignature(
                TOKEN_INIT_SELECTOR,
                address(_liquidityProvider),
                _decimals,
                _fluidTokenName,
                _fluidSymbol,
                _emergencyCouncil,
                address(this),
                _operator
            )
         );

         IERC20 token = IERC20(address(beaconProxy));

         require(
             token.decimals() == _decimals,
             "decimals in deploy not consistent"
         );

         return address(beaconProxy);
    }

    /// @notice disableAddresses given using `enableEmergencyMode()`
    function disableAddresses(IEmergencyMode[] memory _addresses) public {
        for (uint256 i = 0; i < _addresses.length; i++)
            _addresses[i].enableEmergencyMode();
    }
}
