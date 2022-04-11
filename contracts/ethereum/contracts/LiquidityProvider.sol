pragma solidity ^0.8.11;
pragma abicoder v1;

import "@openzeppelin/contracts-upgradeable/token/ERC20/utils/SafeERC20Upgradeable.sol";

interface LiquidityProvider {
    function owner_() external returns (address);
    function underlying_() external returns (IERC20Upgradeable);

    function addToPool(uint amount) external;
    function takeFromPool(uint amount) external;
    function totalPoolAmount() external returns (uint);
}

