pragma solidity 0.8.11;
pragma abicoder v1;

import "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/IERC20MetadataUpgradeable.sol";

interface LendingPoolAddressesProviderInterface {
    function getLendingPool() external view returns (address);
}

interface ATokenInterface is IERC20MetadataUpgradeable {
    function UNDERLYING_ASSET_ADDRESS() external view returns (address);

    function balanceOf(address _user) external view returns (uint256);
}

address constant aaveEthMock = 0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE;

interface LendingPoolInterface {
    function deposit(address _reserve, uint256 _amount, address _onBehalfOf, uint16 _referralCode) external payable;
    function withdraw(address _underlying, uint256 _amount, address _to) external returns (uint);
}
