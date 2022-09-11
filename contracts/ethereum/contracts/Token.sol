// SPDX-License-Identifier: GPL

// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

pragma solidity 0.8.11;
pragma abicoder v2;

import "./openzeppelin/IERC20.sol";
import "./openzeppelin/SafeERC20.sol";
import "./openzeppelin/Address.sol";

import "./LiquidityProvider.sol";
import "./WorkerConfig.sol";

/// @dev parameter for the batchReward function
struct Winner {
    address winner;
    uint256 amount;
}

/// @title The fluid token ERC20 contract
contract Token is IERC20 {
    using SafeERC20 for IERC20;
    using Address for address;

    uint constant DEFAULT_MAX_UNCHECKED_REWARD = 1000;

    bool constant DEFAULT_MINT_LIMITS_ENABLED = false;

    uint constant DEFAULT_GLOBAL_MINT_LIMIT = 1000000;

    uint constant DEFAULT_USER_MINT_LIMIT = 10000;

    /// @dev sentinel to indicate a block has been rewarded in the
    /// @dev pastRewards_ and rewardedBlocks_ maps
    uint private constant BLOCK_REWARDED = 1;

    /// @notice emitted when any reward is paid out
    event Reward(
        address indexed winner,
        uint amount,
        uint startBlock,
        uint endBlock
    );

    /// @notice emitted when a reward is quarantined for being too large
    event BlockedReward(
        address indexed winner,
        uint amount,
        uint startBlock,
        uint endBlock
    );

    /// @notice emitted when an underlying token is wrapped into a fluid asset
    event MintFluid(address indexed addr, uint indexed amount);

    /// @notice emitted when a fluid token is unwrapped to its underlying asset
    event BurnFluid(address indexed addr, uint indexed amount);

    /// @notice emitted when a new operator takes over the contract management
    event OperatorChanged(address indexed oldOperator, address indexed newOperator);

    /// @notice emitted when the contract enters emergency mode!
    event Emergency();

    // erc20 props
    mapping(address => uint256) private balances_;
    mapping(address => mapping(address => uint256)) private allowances_;
    uint8 private decimals_;
    uint256 private totalSupply_;
    string private name_;
    string private symbol_;

    /// @dev if false, emergency mode is active - can be called by either the
    /// @dev operator, worker account or emergency council
    bool private noEmergencyMode_;

    // for migrations
    uint private version_;

    LiquidityProvider private pool_;

    WorkerConfig private workerConfig_;

    /// @dev emergency council that can activate emergency mode
    address private emergencyCouncil_;

    /// @dev account to use that created the contract (multisig account)
    address private operator_;

    /// @dev the block number of the last block that's been included in a batched reward
    uint private lastRewardedBlock_;

    /// @dev [address] => [[block number] => [has the block been manually rewarded by this user?]]
    mapping (address => mapping(uint => uint)) private manualRewardedBlocks_;

    /// @dev amount a user has manually rewarded, to be removed from their batched rewards
    /// @dev [address] => [amount manually rewarded]
    mapping (address => uint) private manualRewardDebt_;

    /// @dev the largest amount a reward can be to not get quarantined
    uint maxUncheckedReward_;

    /// @dev [address] => [number of tokens the user won that have been quarantined]
    mapping (address => uint) blockedRewards_;

    /// @dev are the asset minting limits enabled?
    bool mintLimitsEnabled_;

    /// @dev [user] => [amount the user has minted]
    mapping (address => uint) userAmountMinted_;

    /// @dev [user] => [last block the user minted on]
    /// @dev (if this is <userMintResetBlock_, reset the amount minted to 0)
    mapping (address => uint) userLastMintedBlock_;

    /// @dev the mint limit per user
    uint userMintLimit_;

    /// @dev amount of fluid tokens that can be minted
    /// @dev only editable by the oracle
    uint remainingGlobalMint_;

    /// @dev the block number in which user mint limits were last reset
    uint userMintResetBlock_;

    /**
     * @notice initialiser function - sets the contract's data
     * @dev we pass in the metadata explicitly instead of sourcing from the
     * @dev underlying token because some underlying tokens don't implement
     * @dev these methods
     *
     * @param _liquidityProvider the `LiquidityProvider` contract address. Should have this contract as its owner.
     * @param _decimals the fluid token's decimals (should be the same as the underlying token's)
     * @param _name the fluid token's name
     * @param _symbol the fluid token's symbol
     * @param _emergencyCouncil address that can activate emergency mode
     * @param _operator address that can release quarantine payouts and activate emergency mode
     * @param _workerConfig to use for retrieving RNG oracle address
     */
    function init(
        address _liquidityProvider,
        uint8 _decimals,
        string memory _name,
        string memory _symbol,
        address _emergencyCouncil,
        address _operator,
        address _workerConfig
    ) public {
        require(version_ == 0, "contract is already initialised");
        version_ = 1;

        // remember the operator for signing off on oracle changes, large payouts
        operator_ = _operator;

        // remember the emergency council for shutting down this token
        emergencyCouncil_ = _emergencyCouncil;

        // remember the worker config to look up the addresses for each rng oracle
        workerConfig_ = WorkerConfig(_workerConfig);

        // remember the liquidity provider to deposit tokens into
        pool_ = LiquidityProvider(_liquidityProvider);

        // sanity check
        pool_.underlying_().totalSupply();

        noEmergencyMode_ = true;

        // erc20 props
        decimals_ = _decimals;
        name_ = _name;
        symbol_ = _symbol;

        // initialise mint limits
        maxUncheckedReward_ = DEFAULT_MAX_UNCHECKED_REWARD;
        mintLimitsEnabled_ = DEFAULT_MINT_LIMITS_ENABLED;
        remainingGlobalMint_ = DEFAULT_GLOBAL_MINT_LIMIT;
        userMintLimit_ = DEFAULT_USER_MINT_LIMIT;

        userMintResetBlock_ = block.number;
    }

    /*
     * @param _maxUncheckedReward that can be paid out before a quarantine happens
     * @param _mintLimitsEnabled to prevent users from minting a large amount
     * @param _globalMint that is the global amount that users can cumulatively mint without restriction
     * @param _userMint that is the amount that each individual user can mint without restriction
     */
    function setRestrictions(
    	uint _maxUncheckedReward,
    	bool _mintLimitsEnabled,
    	uint _globalMint,
    	uint _userMint
    ) public {
        require(msg.sender == operator_, "only operator can use this function!");

        maxUncheckedReward_ = _maxUncheckedReward;
        mintLimitsEnabled_ = _mintLimitsEnabled;
        remainingGlobalMint_ = _globalMint;
        userMintLimit_ = _userMint;
        userMintResetBlock_ = block.number;
    }

    /**
     * @notice update the operator account to a new address
     * @param newOperator the address of the new operator to change to
     */
    function updateOperator(address newOperator) public {
        require(msg.sender == operator_, "only operator can use this function!");

        operator_ = newOperator;

        emit OperatorChanged(operator_, newOperator);
    }

    function noEmergencyMode() public view returns (bool) {
        return noEmergencyMode_
            && workerConfig_.noGlobalEmergency();
    }

    /**
     * @notice getter for the RNG oracle provided by `workerConfig_`
     * @return the address of the trusted oracle
     */
    function oracle() public view returns (address) {
        return workerConfig_.getWorkerAddress(address(this));
    }

    /**
     * @notice enables emergency mode preventing the swapping in of tokens,
     * @notice and setting the rng oracle address to null
     */
    function enableEmergencyMode() public {
        require(
            msg.sender == operator_ ||
            msg.sender == emergencyCouncil_ ||
            msg.sender == oracle(),
            "can't enable emergency mode!"
        );

        noEmergencyMode_ = false;

        workerConfig_ = WorkerConfig(address(0));

        emit Emergency();
    }

    function updateWorkerConfig(address _workerConfig) public {
        require(msg.sender == operator_, "only the operator account can use this");
        require(noEmergencyMode(), "emergency mode!");

        workerConfig_ = WorkerConfig(_workerConfig);
    }

    /// @notice updates the reward quarantine threshold if called by the operator
    function updateRewardQuarantineThreshold(uint _maxUncheckedReward) public {
        require(noEmergencyMode(), "emergency mode!");
        require(msg.sender == operator_, "only the operator account can use this");

        maxUncheckedReward_ = _maxUncheckedReward;
    }

    /// @notice updates and resets mint limits if called by the operator
    function updateMintLimits(uint global, uint user) public {
        require(noEmergencyMode(), "emergency mode!");
        require(msg.sender == oracle(), "only the oracle account can use this");

        remainingGlobalMint_ = global;
        userMintLimit_ = user;
        userMintResetBlock_ = block.number;
    }

    /// @notice enables or disables mint limits with the operator account
    function enableMintLimits(bool enable) public {
        require(msg.sender == oracle(), "only the oracle account can use this");

        mintLimitsEnabled_ = enable;
    }

    /**
     * @notice wraps `amount` of underlying tokens into fluid tokens
     * @notice requires you to have called the ERC20 `approve` method
     * @notice targeting this contract first
     *
     * @param amount the number of tokens to wrap
     * @return the number of tokens wrapped
     */
    function erc20In(uint amount) public returns (uint) {
        require(noEmergencyMode(), "emergency mode!");

        if (mintLimitsEnabled_) {
            // update global limit
            require(amount <= remainingGlobalMint_, "mint amount exceeds global limit!");

            remainingGlobalMint_ -= amount;

            uint userMint;

            bool userHasMinted = userLastMintedBlock_[msg.sender] < userMintResetBlock_;

            if (userHasMinted) {
                // user hasn't minted since the reset, reset their count
                userLastMintedBlock_[msg.sender] = amount;
            } else {
                // user has, add the amount they're minting
                userLastMintedBlock_[msg.sender] = userAmountMinted_[msg.sender] + amount;
            }

            require(userMint <= userMintLimit_, "mint amount exceeds user limit!");

            // update the user's count
            userAmountMinted_[msg.sender] = userMint;

            // update the user's block
            userLastMintedBlock_[msg.sender] = block.number;
        }

        // take underlying tokens from the user
        uint originalBalance = pool_.underlying_().balanceOf(address(this));
        pool_.underlying_().safeTransferFrom(msg.sender, address(this), amount);
        uint finalBalance = pool_.underlying_().balanceOf(address(this));

        // ensure the token is behaving
        require(finalBalance > originalBalance, "token balance decreased after transfer");
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
        require(noEmergencyMode(), "emergency mode!");

        if (amount > maxUncheckedReward_) {
            // quarantine the reward
            emit BlockedReward(winner, amount, firstBlock, lastBlock);

            blockedRewards_[winner] += amount;

            return;
        }

        rewardInternal(firstBlock, lastBlock, winner, amount);
    }

    function rewardInternal(uint256 firstBlock, uint256 lastBlock, address winner, uint256 amount) internal {
        require(noEmergencyMode(), "emergency mode!");

        // mint some fluid tokens from the interest we've accrued
        emit Reward(winner, amount, firstBlock, lastBlock);

        _mint(winner, amount);
    }

    /** @notice pays out several rewards
     * @notice only usable by the trusted oracle account
     *
     * @param rewards the array of rewards to pay out
     */
    function batchReward(Winner[] memory rewards, uint firstBlock, uint lastBlock) public {
        require(noEmergencyMode(), "emergency mode!");
        require(msg.sender == oracle(), "only the oracle account can use this");

        uint poolAmount = rewardPoolAmount();

        // this might not happen if our transactions go through out of order
        if (lastBlock > lastRewardedBlock_) lastRewardedBlock_ = lastBlock;

        for (uint i = 0; i < rewards.length; i++) {
            Winner memory winner = rewards[i];

            if (manualRewardDebt_[winner.winner] != 0) {
                winner.amount -= manualRewardDebt_[winner.winner];
                manualRewardDebt_[winner.winner] = 0;
            }

            require(poolAmount >= winner.amount, "reward pool empty");
            poolAmount = poolAmount - winner.amount;

            rewardFromPool(firstBlock, lastBlock, winner.winner, winner.amount);
        }
    }

    /**
     * @notice admin function, unblocks a reward that was quarantined for being too large
     * @notice allows for paying out or removing the reward, in case of abuse
     *
     * @param user the address of the user who's reward was quarantined
     * @param amount the amount of tokens to release (in case multiple rewards were quarantined)
     * @param payout should the reward be paid out or removed?
     * @param firstBlock the first block the rewards include (should be from the BlockedReward event)
     * @param lastBlock the last block the rewards include
     */
    function unblockReward(address user, uint amount, bool payout, uint firstBlock, uint lastBlock) public {
        require(noEmergencyMode(), "emergency mode!");
        require(msg.sender == operator_, "only the operator account can use this");

        require(blockedRewards_[user] >= amount,
            "trying to unblock more than the user has blocked");

        blockedRewards_[user] -= amount;

        if (payout) {
            rewardInternal(firstBlock, lastBlock, user, amount);
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
        address contractAddress,
        uint256 chainid,
        address winner,
        uint256 winAmount,
        uint firstBlock,
        uint lastBlock,
        bytes memory sig
    ) external {
        require(noEmergencyMode(), "emergency mode!");

        // web based signers (ethers, metamask, etc) add this prefix to stop you signing arbitrary data
        //bytes32 hash = keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", sha256(rngRlp)));
        bytes32 hash = keccak256(abi.encode(
            contractAddress,
            chainid,
            winner,
            winAmount,
            firstBlock,
            lastBlock
        ));

        // ECDSA verification
        require(recover(hash, sig) == oracle(), "invalid rng signature");

        // now reward the user

        require(contractAddress == address(this), "payload is for the wrong contract");
        require(chainid == block.chainid, "payload is for the wrong chain");

        // user decided to frontrun
        require(
            firstBlock > lastRewardedBlock_,
            "reward already given for part of this range"
        );

        for (uint i = firstBlock; i <= lastBlock; i++) {
            require(manualRewardedBlocks_[winner][i] == 0, "reward already given for part of this range");
            manualRewardedBlocks_[winner][i] = BLOCK_REWARDED;
        }

        manualRewardDebt_[winner] += winAmount;

        require(rewardPoolAmount() >= winAmount, "reward pool empty");

        rewardFromPool(firstBlock, lastBlock, winner, winAmount);
    }

    /**
     * @dev ECrecover with checks for signature mallmalleability
     * @dev adapted from openzeppelin's ECDSA library
     */
    function recover(
        bytes32 hash,
        bytes memory signature
    ) internal pure returns (address) {
        require(signature.length == 65, "invalid rng format (length)");
        bytes32 r;
        bytes32 s;
        uint8 v;
        // ecrecover takes the signature parameters, and the only way to get them
        // currently is to use assembly.
        /// @solidity memory-safe-assembly
        assembly {
            r := mload(add(signature, 0x20))
            s := mload(add(signature, 0x40))
            v := byte(0, mload(add(signature, 0x60)))
        }
        // EIP-2 still allows signature malleability for ecrecover(). Remove this possibility and make the signature
        // unique. Appendix F in the Ethereum Yellow paper (https://ethereum.github.io/yellowpaper/paper.pdf), defines
        // the valid range for s in (301): 0 < s < secp256k1n ÷ 2 + 1, and for v in (302): v ∈ {27, 28}. Most
        // signatures from current libraries generate a unique signature with an s-value in the lower half order.
        //
        // If your library generates malleable signatures, such as s-values in the upper range, calculate a new s-value
        // with 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141 - s1 and flip v from 27 to 28 or
        // vice versa. If your library also generates signatures with 0/1 for v instead 27/28, add 27 to v to accept
        // these malleable signatures as well.
        if (uint256(s) > 0x7FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF5D576E7357A4501DDFE92F46681B20A0) {
            revert("invalid signature (s)");
        }
        if (v != 27 && v != 28) {
            revert("invalid signature (v)");
        }

        // If the signature is valid (and not malleable), return the signer address
        address signer = ecrecover(hash, v, r, s);
        if (signer == address(0)) {
            revert("invalid signature");
        }

        return signer;
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
