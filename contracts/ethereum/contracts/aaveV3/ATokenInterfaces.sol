pragma solidity 0.8.11;
pragma abicoder v1;

import "../openzeppelin/IERC20Metadata.sol";

interface PoolAddressesProviderInterface {
    function getPool() external view returns (address);
}

interface ATokenInterface is IERC20Metadata {
    function UNDERLYING_ASSET_ADDRESS() external view returns (address);

    function balanceOf(address _user) external view returns (uint256);
}

interface PoolInterface {
    function supply(address asset, uint256 amount, address onBehalfOf, uint16 referralCode) external payable;
    function withdraw(address asset, uint256 amount, address to) external returns (uint256);
}
