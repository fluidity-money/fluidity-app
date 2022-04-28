pragma solidity ^0.8.11;
pragma abicoder v1;

import "./aave/ATokenInterfaces.sol";
import "./LiquidityProvider.sol";
import "./openzeppelin/SafeERC20.sol";

contract AaveLiquidityProvider is LiquidityProvider {
    using SafeERC20 for IERC20;

    bool private initialized_;
    address public owner_;
    IERC20 public underlying_;

    LendingPoolAddressesProviderInterface public lendingPoolAddresses_;
    ATokenInterface public aToken_;

    function initialize(
        address addressProvider,
        address aToken,
        address owner
    ) external {
        require(initialized_ == false, "contract is already initialized");
        initialized_ = true;
        owner_ = owner;

        lendingPoolAddresses_ = LendingPoolAddressesProviderInterface(addressProvider);
        aToken_ = ATokenInterface(aToken);

        underlying_ = IERC20(aToken_.UNDERLYING_ASSET_ADDRESS());
    }

    function addToPool(uint amount) external {
        require(msg.sender == owner_, "only the owner can use this");
        LendingPoolInterface lendingPool = LendingPoolInterface(lendingPoolAddresses_.getLendingPool());
        underlying_.safeApprove(address(lendingPool), amount);

        lendingPool.deposit(address(underlying_), amount, address(this), 0);
    }

    function takeFromPool(uint amount) external {
        require(msg.sender == owner_, "only the owner can use this");
        LendingPoolInterface lendingPool = LendingPoolInterface(lendingPoolAddresses_.getLendingPool());

        uint realAmount = lendingPool.withdraw(address(underlying_), amount, address(this));
        require(amount == realAmount, "amount aave withdrew was different to requested");
        underlying_.safeTransfer(msg.sender, realAmount);
    }

    function totalPoolAmount() external view returns (uint) {
        return aToken_.balanceOf(address(this));
    }
}
