pragma solidity ^0.8.11;
pragma abicoder v1;

import "@openzeppelin/contracts-upgradeable/token/ERC20/utils/SafeERC20Upgradeable.sol";
import "./TokenBase.sol";
import "./compound/CTokenInterfaces.sol";

contract TokenCompound is TokenBase {
    using SafeERC20Upgradeable for IERC20Upgradeable;

    CErc20Interface compoundToken_;

    function initialize(
        address _compoundToken,
        uint8 _decimals,
        string memory _name,
        string memory _symbol,
        address _oracle
    ) public initializer {
        compoundToken_ = CErc20Interface(_compoundToken);

        __TokenBase_init(compoundToken_.underlying(), _decimals, _name, _symbol, _oracle);

        underlying_.safeApprove(address(compoundToken_), type(uint).max);
    }

    function addToPool(uint amount) internal override {
        uint mintRes = compoundToken_.mint(amount);
        require(mintRes == 0, "compound mint failed");
    }
    function takeFromPool(uint amount) internal override {
        uint redeemRes = compoundToken_.redeemUnderlying(amount);
        require(redeemRes == 0, "compound redeem failed");
    }

    function rewardPoolAmount() public override returns (uint) {
        uint balance = compoundToken_.balanceOfUnderlying(address(this));
        // for whatever reason, immediately after minting compound tokens
        // this value can be off by one
        require(balance >= totalSupply(), "balance is less than total supply");
        return balance - totalSupply();
    }
}