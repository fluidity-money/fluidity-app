pragma solidity ^0.8.11;
pragma abicoder v1;

import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/utils/SafeERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/AddressUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

abstract contract TokenBase is Initializable, ERC20Upgradeable {
    using SafeERC20Upgradeable for IERC20Upgradeable;
    using AddressUpgradeable for address;

    event Reward(address indexed addr, uint indexed amount);
    event MintFluid(address indexed addr, uint indexed amount);
    event BurnFluid(address indexed addr, uint indexed amount);

    address rngOracle_;

    //CErc20Interface compoundToken_;
    IERC20Upgradeable underlying_;

    uint8 decimals_;

    // operating at word size here saves a little bit of gas
    // txhash => 1
    mapping (bytes32 => uint) private pastRewards_;

    // we pass in the metadata explicitly instead of sourcing from the underlying
    // token because some underlying tokens don't implement these methods
    function __TokenBase_init(
        address _underlying,
        uint8 _decimals,
        string memory _name,
        string memory _symbol,
        address _oracle
    ) public onlyInitializing {
        __ERC20_init_unchained(_name, _symbol);

        rngOracle_ = _oracle;

        //compoundToken_ = CErc20Interface(_compound);
        //underlying_ = IERC20Upgradeable(compoundToken_.underlying());
        underlying_ = IERC20Upgradeable(_underlying);

        // sanity check
        underlying_.totalSupply();
        //underlying_.safeApprove(address(compoundToken_), type(uint).max);

        decimals_ = _decimals;
    }

    function decimals() public view override returns (uint8) { return decimals_; }
    function oracle() public view returns (address) { return rngOracle_; }
    // name and symbol provided by ERC20 parent

    // takes `amount` underlying tokens, gives you fluid tokens
    // requires you to have `approve`d the tokens on the erc20 first
    function erc20In(uint amount) public returns (uint) {
        // take underlying tokens from the user
        uint originalBalance = underlying_.balanceOf(address(this));
        underlying_.safeTransferFrom(msg.sender, address(this), amount);
        uint finalBalance = underlying_.balanceOf(address(this));

        // ensure we haven't overflowed
        require(finalBalance > originalBalance, "erc20in overflow");
        uint realAmount = finalBalance - originalBalance;

        // add the tokens to our compound pool
        addToPool(realAmount);

        // give the user fluid tokens
        _mint(msg.sender, realAmount);
        emit MintFluid(msg.sender, realAmount);
        return realAmount;
    }

    // takes `amount` fluid tokens from you, gives you erc20
    function erc20Out(uint amount) public {
        // take the user's fluid tokens
        _burn(msg.sender, amount);

        // give them erc20
        takeFromPool(amount);
        emit BurnFluid(msg.sender, amount);
        underlying_.safeTransfer(msg.sender, amount);
    }

    function addToPool(uint amount) internal virtual;
    function takeFromPool(uint amount) internal virtual;
    function rewardPoolAmount() public virtual returns (uint);

    function rewardFromPool(address to, uint amount) internal {
        // mint some fluid tokens from the interest we've accrued
        _mint(to, amount);
        emit Reward(to, amount);
    }

    function reward(
        bytes32 txHash,
        address from,
        address to,
        uint[] calldata balls,
        uint[] calldata payouts
    ) public {
        require(_msgSender() == rngOracle_, "only the oracle account can use this");

        // ensure the tx hasn't already been redeemed
        require(pastRewards_[txHash] == 0, "reward already given for this tx");

        // validate the rng
        uint winAmount = rewardAmount(balls, payouts);

        uint maxRewardAmount = rewardPoolAmount();
        if (winAmount > maxRewardAmount) winAmount = maxRewardAmount;

        // now pay out the user
        pastRewards_[txHash] = 1;
        // 80%
        rewardFromPool(from, winAmount / 5 * 4);
        // 20%
        rewardFromPool(to, winAmount / 5 * 1);
    }

    // returns the amount that the user won (can be 0), reverts on invalid rng
    function rewardAmount(
        uint[] calldata balls,
        uint[] calldata payouts
    ) public pure returns (uint) {
        uint winningBalls = 0;

        for (uint i = 0; i < balls.length; i++) {
            // assume the user picked balls 1..n
            if (balls[i] <= balls.length) winningBalls++;
        }
        require(winningBalls > 0, "transaction didn't win");

        return payouts[winningBalls - 1];
    }
}
