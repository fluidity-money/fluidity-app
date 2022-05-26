pragma solidity ^0.8.11;
pragma abicoder v1;

import "./compound/CTokenInterfaces.sol";
import "./LiquidityProvider.sol";
import "./openzeppelin/SafeERC20.sol";

contract CompoundLiquidityProvider is LiquidityProvider {
    using SafeERC20 for IERC20;

    bool private initialized_;
    address public owner_;
    IERC20 public underlying_;

    CErc20Interface public compoundToken_;

    /**
     * @notice initializer function
     *
     * @param compoundToken address of the compound cToken
     * @param owner address of the account that owns this pool
     */
    function initialize(
        address compoundToken,
        address owner
    ) external {
        require(initialized_ == false, "contract is already initialized");
        initialized_ = true;
        owner_ = owner;

        compoundToken_ = CErc20Interface(compoundToken);

        underlying_ = IERC20(compoundToken_.underlying());
        underlying_.safeApprove(address(compoundToken_), type(uint).max);
    }

    /// @inheritdoc LiquidityProvider
    function addToPool(uint amount) external {
        require(msg.sender == owner_, "only the owner can use this");

        uint mintRes = compoundToken_.mint(amount);
        require(mintRes == 0, "compound mint failed");
    }

    /// @inheritdoc LiquidityProvider
    function takeFromPool(uint amount) external {
        require(msg.sender == owner_, "only the owner can use this");

        uint redeemRes = compoundToken_.redeemUnderlying(amount);
        require(redeemRes == 0, "compound redeem failed");

        underlying_.safeTransfer(msg.sender, amount);
    }

    /// @inheritdoc LiquidityProvider
    function totalPoolAmount() external returns (uint) {
        return compoundToken_.balanceOfUnderlying(address(this));
    }
}
