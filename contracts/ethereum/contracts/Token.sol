pragma solidity ^0.8.11;
pragma abicoder v2;

import "./openzeppelin/IERC20.sol";
import "./openzeppelin/SafeERC20.sol";
import "./openzeppelin/Address.sol";
import "./LiquidityProvider.sol";

struct Winner {
    address from;
    address to;
    uint256 amount;
    bytes32 txHash;
}

contract Token is IERC20 {
    using SafeERC20 for IERC20;
    using Address for address;

    event Reward(address indexed addr, uint indexed amount);
    event MintFluid(address indexed addr, uint indexed amount);
    event BurnFluid(address indexed addr, uint indexed amount);

    mapping(address => uint256) private balances_;
    mapping(address => mapping(address => uint256)) private allowances_;
    uint8 private decimals_;
    uint256 private totalSupply_;
    string private name_;
    string private symbol_;

    bool initialized_;

    LiquidityProvider pool_;

    address rngOracle_;

    // operating at word size here saves a little bit of gas
    // txhash => 1
    mapping (bytes32 => uint) private pastRewards_;

    // we pass in the metadata explicitly instead of sourcing from the underlying
    // token because some underlying tokens don't implement these methods
    function init(
        address _liquidityProvider,
        uint8 _decimals,
        string memory _name,
        string memory _symbol,
        address _oracle
    ) public {
        require(!initialized_, "contract is already initialized");
        initialized_ = true;

        rngOracle_ = _oracle;

        pool_ = LiquidityProvider(_liquidityProvider);

        // sanity check
        pool_.underlying_().totalSupply();

        decimals_ = _decimals;
        name_ = _name;
        symbol_ = _symbol;
    }

    function oracle() public view returns (address) { return rngOracle_; }

    function updateOracle(address newOracle) public {
        require(msg.sender == rngOracle_, "only the oracle account can use this");

        rngOracle_ = newOracle;
    }

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

    function rewardFromPool(address from, address to, uint amount) internal {
        // mint some fluid tokens from the interest we've accrued
        // 20%
        uint256 toAmount = amount / 5;
        // 80%
        uint256 fromAmount = amount - toAmount;

        emit Reward(from, fromAmount);
        emit Reward(to, toAmount);

        _mintDouble(from, fromAmount, to, toAmount);
    }

    function reward(
        bytes32 txHash,
        address from,
        address to,
        uint[] calldata balls,
        uint[] calldata payouts
    ) public {
        require(msg.sender == rngOracle_, "only the oracle account can use this");

        // ensure the tx hasn't already been redeemed
        require(pastRewards_[txHash] == 0, "reward already given for this tx");

        // validate the rng
        uint winAmount = rewardAmount(balls, payouts);

        uint maxRewardAmount = rewardPoolAmount();
        if (winAmount > maxRewardAmount) winAmount = maxRewardAmount;

        // now pay out the user
        pastRewards_[txHash] = 1;
        rewardFromPool(from, to, winAmount / 5 * 4);
    }

    function batchReward(Winner[] memory rewards) public {
        require(msg.sender == rngOracle_, "only the oracle account can use this");

        uint poolAmount = rewardPoolAmount();

        for (uint i = 0; i < rewards.length; i++) {
            Winner memory winner = rewards[i];

            require(pastRewards_[winner.txHash] == 0, "reward already given for this tx");
            pastRewards_[winner.txHash] = 1;

            require(poolAmount >= winner.amount, "reward pool empty");
            poolAmount = poolAmount - winner.amount;

            rewardFromPool(winner.from, winner.to, winner.amount);
        }
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

    // erc20 spec
    function name() public view returns (string memory) { return name_; }
    function symbol() public view returns (string memory) { return symbol_; }
    function decimals() public view returns (uint8) { return decimals_; }
    function totalSupply() public view returns (uint256) { return totalSupply_; }
    function balanceOf(address account) public view returns (uint256) {
       return balances_[account];
    }

    function transfer(address to, uint256 amount) public returns (bool) {
        _transfer(msg.sender, to, amount);
        return true;
    }
    function allowance(address owner, address spender) public view returns (uint256) {
        return allowances_[owner][spender];
    }
    function approve(address spender, uint256 amount) public returns (bool) {
        _approve(msg.sender, spender, amount);
        return true;
    }
    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) public returns (bool) {
        _spendAllowance(from, msg.sender, amount);
        _transfer(from, to, amount);
        return true;
    }

    function increaseAllowance(address spender, uint256 addedValue) public returns (bool) {
        _approve(msg.sender, spender, allowances_[msg.sender][spender] + addedValue);
        return true;
    }

    function decreaseAllowance(address spender, uint256 subtractedValue) public returns (bool) {
        uint256 currentAllowance = allowances_[msg.sender][spender];
        require(currentAllowance >= subtractedValue, "ERC20: decreased allowance below zero");
        unchecked {
            _approve(msg.sender, spender, currentAllowance - subtractedValue);
        }

        return true;
    }

    function _transfer(
        address from,
        address to,
        uint256 amount
    ) internal {
        require(from != address(0), "ERC20: transfer from the zero address");
        require(to != address(0), "ERC20: transfer to the zero address");

        uint256 fromBalance = balances_[from];
        require(fromBalance >= amount, "ERC20: transfer amount exceeds balance");
        unchecked {
            balances_[from] = fromBalance - amount;
        }
        balances_[to] += amount;

        emit Transfer(from, to, amount);
    }

    function _mint(address account, uint256 amount) internal virtual {
        require(account != address(0), "ERC20: mint to the zero address");

        totalSupply_ += amount;
        balances_[account] += amount;
        emit Transfer(address(0), account, amount);
    }

    // mint to two addresses, only writing to totalSupply once
    function _mintDouble(address account1, uint256 amount1, address account2, uint256 amount2) internal virtual {
        require(account1 != address(0), "ERC20: mint to the zero address");
        require(account2 != address(0), "ERC20: mint to the zero address");

        totalSupply_ += amount1 + amount2;
        balances_[account1] += amount1;
        emit Transfer(address(0), account1, amount1);

        balances_[account2] += amount2;
        emit Transfer(address(0), account2, amount2);
    }

    function _burn(address account, uint256 amount) internal virtual {
        require(account != address(0), "ERC20: burn from the zero address");

        uint256 accountBalance = balances_[account];
        require(accountBalance >= amount, "ERC20: burn amount exceeds balance");
        unchecked {
            balances_[account] = accountBalance - amount;
        }
        totalSupply_ -= amount;

        emit Transfer(account, address(0), amount);
    }

    function _approve(
        address owner,
        address spender,
        uint256 amount
    ) internal virtual {
        require(owner != address(0), "ERC20: approve from the zero address");
        require(spender != address(0), "ERC20: approve to the zero address");

        allowances_[owner][spender] = amount;
        emit Approval(owner, spender, amount);
    }

    function _spendAllowance(
        address owner,
        address spender,
        uint256 amount
    ) internal virtual {
        uint256 currentAllowance = allowance(owner, spender);
        if (currentAllowance != type(uint256).max) {
            require(currentAllowance >= amount, "ERC20: insufficient allowance");
            unchecked {
                _approve(owner, spender, currentAllowance - amount);
            }
        }
    }

}
