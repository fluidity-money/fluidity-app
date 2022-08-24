// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

pragma solidity 0.8.11;
pragma abicoder v1;

import "../openzeppelin/IERC20Metadata.sol";

interface LendingPoolAddressesProviderInterface {
    function getLendingPool() external view returns (address);
}

interface ATokenInterface is IERC20Metadata {
    function UNDERLYING_ASSET_ADDRESS() external view returns (address);

    function balanceOf(address _user) external view returns (uint256);
}

address constant aaveEthMock = 0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE;

interface LendingPoolInterface {
    function deposit(address _reserve, uint256 _amount, address _onBehalfOf, uint16 _referralCode) external payable;
    function withdraw(address _underlying, uint256 _amount, address _to) external returns (uint);
}
