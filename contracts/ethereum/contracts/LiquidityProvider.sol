pragma solidity ^0.8.11;
pragma abicoder v1;

import "./openzeppelin/IERC20.sol";

interface LiquidityProvider {
    function owner_() external returns (address);
    function underlying_() external returns (IERC20);

    function addToPool(uint amount) external;
    function takeFromPool(uint amount) external;
    function totalPoolAmount() external returns (uint);
}

