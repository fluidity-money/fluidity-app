pragma solidity 0.8.11;
pragma abicoder v2;

interface PoolAddressesProviderInterface {
    function getPool() external view returns (address);
}

interface PoolInterface {
    function supply(address asset, uint256 amount, address onBehalfOf, uint16 referralCode) external payable;
    function withdraw(address asset, uint256 amount, address to) external returns (uint256);
}
