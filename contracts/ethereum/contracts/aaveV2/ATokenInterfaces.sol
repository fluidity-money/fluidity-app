// SPDX-License-Identifier: GPL

pragma solidity 0.8.11;
pragma abicoder v2;

interface LendingPoolAddressesProviderInterface {
    function getLendingPool() external view returns (address);
}

address constant aaveEthMock = 0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE;

interface LendingPoolInterface {
    function deposit(address _reserve, uint256 _amount, address _onBehalfOf, uint16 _referralCode) external payable;
    function withdraw(address _underlying, uint256 _amount, address _to) external returns (uint);
}
