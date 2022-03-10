pragma solidity ^0.8.11;
pragma abicoder v1;

import "@openzeppelin/contracts-upgradeable/token/ERC20/utils/SafeERC20Upgradeable.sol";
import "./TokenBase.sol";
import "./aave/ATokenInterfaces.sol";

contract TokenAave is TokenBase {
    using SafeERC20Upgradeable for IERC20Upgradeable;

    LendingPoolAddressesProviderInterface public lendingPoolAddresses_;
    ATokenInterface public aToken_;

    function initialize(
        address _aaveAToken,
        address _aaveAddressProvider,
        uint8 _decimals,
        string memory _name,
        string memory _symbol,
        address _oracle
    ) public initializer {
        lendingPoolAddresses_ = LendingPoolAddressesProviderInterface(_aaveAddressProvider);
        aToken_ = ATokenInterface(_aaveAToken);

        address underlying = aToken_.UNDERLYING_ASSET_ADDRESS();
        __TokenBase_init(underlying, _decimals, _name, _symbol, _oracle);
    }

    function addToPool(uint amount) internal override {
        LendingPoolInterface lendingPool = LendingPoolInterface(lendingPoolAddresses_.getLendingPool());
        underlying_.safeApprove(address(lendingPool), amount);

        lendingPool.deposit(address(underlying_), amount, address(this), 0);
    }

    function takeFromPool(uint amount) internal override {
        LendingPoolInterface lendingPool = LendingPoolInterface(lendingPoolAddresses_.getLendingPool());

        uint realAmount = lendingPool.withdraw(address(underlying_), amount, address(this));
        require(amount == realAmount, "amount aave withdrew was different to requested");
    }

    function rewardPoolAmount() public override returns (uint) {
        uint balance = aToken_.balanceOf(address(this));
        return balance - totalSupply();
    }
}