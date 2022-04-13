pragma solidity ^0.8.11;
pragma abicoder v1;

import "./openzeppelin/IERC20.sol";
import "./openzeppelin/SafeERC20.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "./openzeppelin/Address.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "./LiquidityProvider.sol";

contract Token is Initializable, ERC20Upgradeable {
    using SafeERC20 for IERC20;
    using Address for address;

    event Reward(address indexed addr, uint indexed amount);
    event MintFluid(address indexed addr, uint indexed amount);
    event BurnFluid(address indexed addr, uint indexed amount);

    LiquidityProvider pool_;

    address rngOracle_;

    uint8 decimals_;

    // operating at word size here saves a little bit of gas
    // txhash => 1
    mapping (bytes32 => uint) private pastRewards_;

    // we pass in the metadata explicitly instead of sourcing from the underlying
    // token because some underlying tokens don't implement these methods
    function __TokenBase_init(
        address _liquidityProvider,
        uint8 _decimals,
        string memory _name,
        string memory _symbol,
        address _oracle
    ) public initializer {
        __ERC20_init_unchained(_name, _symbol);

        rngOracle_ = _oracle;

        pool_ = LiquidityProvider(_liquidityProvider);

        // sanity check
        pool_.underlying_().totalSupply();

        decimals_ = _decimals;
    }

    function decimals() public view override returns (uint8) { return decimals_; }
    function oracle() public view returns (address) { return rngOracle_; }
    // name and symbol provided by ERC20 parent

    // takes `amount` underlying tokens, gives you fluid tokens
    // requires you to have `approve`d the tokens on the erc20 first
    function erc20In(uint amount) public returns (uint) {
        // take underlying tokens from the user
        uint originalBalance = pool_.underlying_().balanceOf(address(this));
        pool_.underlying_().safeTransferFrom(msg.sender, address(this), amount);
        uint finalBalance = pool_.underlying_().balanceOf(address(this));

        // ensure we haven't overflowed
        require(finalBalance > originalBalance, "erc20in overflow");
        uint realAmount = finalBalance - originalBalance;

        // add the tokens to our compound pool
        pool_.underlying_().safeTransfer(address(pool_), realAmount);
        pool_.addToPool(realAmount);

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
        pool_.takeFromPool(amount);
        pool_.underlying_().safeTransfer(msg.sender, amount);
        emit BurnFluid(msg.sender, amount);
    }

    function rewardPoolAmount() public returns (uint) {
        uint totalAmount = pool_.totalPoolAmount();
        uint totalFluid = totalSupply();
        require(totalAmount >= totalFluid, "balance is less than total supply");
        return totalAmount - totalFluid;
    }

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
