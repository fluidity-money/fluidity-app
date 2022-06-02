pragma solidity ^0.8.11;
pragma abicoder v2;

import "./openzeppelin/IERC20.sol";
import "./openzeppelin/SafeERC20.sol";
import "./openzeppelin/Address.sol";
import "./LiquidityProvider.sol";

/// @dev parameter for the batchReward function
struct Winner {
    address winner;
    uint256 amount;
    uint256 firstBlock;
    uint256 lastBlock;
}

/// @title The fluid token ERC20 contract
contract Token is IERC20 {
    using SafeERC20 for IERC20;
    using Address for address;

    /// @notice emitted when any reward is paid out
    event Reward(
        address indexed winner,
        uint amount,
        uint startBlock,
        uint endBlock
    );

    /// @notice emitted when an underlying token is wrapped into a fluid asset
    event MintFluid(address indexed addr, uint indexed amount);

    /// @notice emitted when a fluid token is unwrapped to its underlying asset
    event BurnFluid(address indexed addr, uint indexed amount);

    mapping(address => uint256) private balances_;
    mapping(address => mapping(address => uint256)) private allowances_;
    uint8 private decimals_;
    uint256 private totalSupply_;
    string private name_;
    string private symbol_;

    bool initialized_;

    LiquidityProvider pool_;

    /// @dev trusted account used as an oracle for submitting rewards
    address rngOracle_;

    /// @dev [txhash] => [0 if the reward for that transaction hasn't been rewarded, 1 otherwise]
    /// @dev operating on ints saves us a bit of gas
    /// @dev deprecated
    mapping (bytes32 => uint) private pastRewards_;

    /// @dev address => block number the user was last rewarded for
    mapping (address => uint) private lastRewardedBlock_;

    /**
     * @notice initializer function - sets the contract's data
     * @dev we pass in the metadata explicitly instead of sourcing from the
     * @dev underlying token because some underlying tokens don't implement
     * @dev these methods
     *
     * @param _liquidityProvider the `LiquidityProvider` contract address. Should have this contract as its owner.
     * @param _decimals the fluid token's decimals (should be the same as the underlying token's)
     * @param _name the fluid token's name
     * @param _symbol the fluid token's symbol
     * @param _oracle the public address of the trusted account allowed to pay out rewards
     */
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

    /**
     * @notice getter for the `rngOracle_` variable
     * @return the address of the trusted oracle
     */
    function oracle() public view returns (address) { return rngOracle_; }

    /// @notice updates the trusted oracle to a new address
    function updateOracle(address newOracle) public {
        require(msg.sender == rngOracle_, "only the oracle account can use this");

        rngOracle_ = newOracle;
    }

    // name and symbol provided by ERC20 parent


    /**
     * @notice wraps `amount` of underlying tokens into fluid tokens
     * @notice requires you to have called the ERC20 `approve` method
     * @notice targeting this contract first
     *
     * @param amount the number of tokens to wrap
     * @return the number of tokens wrapped
     */
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

    /**
     * @notice unwraps `amount` of fluid tokens back to underlying
     *
     * @param amount the number of fluid tokens to unwrap
     */
    function erc20Out(uint amount) public {
        // take the user's fluid tokens
        _burn(msg.sender, amount);

        // give them erc20
        pool_.takeFromPool(amount);
        pool_.underlying_().safeTransfer(msg.sender, amount);
        emit BurnFluid(msg.sender, amount);
    }

    /**
     * @notice calculates the size of the reward pool (the interest we've earned)
     *
     * @return the number of tokens in the reward pool
     */
    function rewardPoolAmount() public returns (uint) {
        uint totalAmount = pool_.totalPoolAmount();
        uint totalFluid = totalSupply();
        require(totalAmount >= totalFluid, "balance is less than total supply");
        return totalAmount - totalFluid;
    }

    /**
     * @dev rewards two users from the reward pool
     * @dev mints tokens and emits the reward event
     *
     * @param lastBlock the last block in the range being rewarded for
     * @param winner the address being rewarded
     * @param amount the amount being rewarded
     */
    function rewardFromPool(uint256 firstBlock, uint256 lastBlock, address winner, uint256 amount) internal {
        // mint some fluid tokens from the interest we've accrued
        emit Reward(winner, amount, firstBlock, lastBlock);

        _mint(winner, amount);
    }

    /**
     * @notice pays out several rewards
     * @notice only usable by the trusted oracle account
     *
     * @param rewards the array of rewards to pay out
     */
    function batchReward(Winner[] memory rewards) public {
        require(msg.sender == rngOracle_, "only the oracle account can use this");

        uint poolAmount = rewardPoolAmount();

        for (uint i = 0; i < rewards.length; i++) {
            Winner memory winner = rewards[i];

            if (winner.firstBlock <= lastRewardedBlock_[winner.winner]) continue; // user decided to frontrun
            lastRewardedBlock_[winner.winner] = winner.lastBlock;

            require(poolAmount >= winner.amount, "reward pool empty");
            poolAmount = poolAmount - winner.amount;

            rewardFromPool(winner.firstBlock, winner.lastBlock, winner.winner, winner.amount);
        }
    }

    /**
     * @notice lets a user frontrun our worker, paying their own gas
     * @notice requires a signature of the random numbers generated
     * @notice by the trusted oracle
     *
     * @param winner the address of the user being rewarded
     * @param winAmount the amount won
     * @param firstBlock the first block in the range being rewarded for
     * @param lastBlock the last block in the range being rewarded for
     * @param sig the signature of the above parameters, provided by the oracle
     */
    function manualReward(
        address winner,
        uint256 winAmount,
        uint firstBlock,
        uint lastBlock,
        bytes memory sig
    ) external {
        require(sig.length == 65, "invalid rng format (length)");
        // web based signers (ethers, metamask, etc) add this prefix to stop you signing arbitrary data
        //bytes32 hash = keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", sha256(rngRlp)));
        bytes32 hash = keccak256(abi.encode(winner, winAmount, firstBlock, lastBlock));

        // ECDSA verification
        // TODO: Get a proper audit here
        uint8 v;
        bytes32 r;
        bytes32 s;
        assembly {
            r := mload(add(sig, 0x20))
            s := mload(add(sig, 0x40))
            v := byte(0, mload(add(sig, 0x60)))
        }
        if (v < 27) v += 27;

        require(ecrecover(hash, v, r, s) == rngOracle_, "invalid rng signature");

        // now reward the user

        // user decided to frontrun
        require(
            lastRewardedBlock_[winner] < firstBlock,
            "reward already given for part of this range"
        );
        lastRewardedBlock_[winner] = lastBlock;

        require(rewardPoolAmount() >= winAmount, "reward pool empty");

        rewardFromPool(firstBlock, lastBlock, winner, winAmount);
    }

    // remaining functions are taken from OpenZeppelin's ERC20 implementation

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
