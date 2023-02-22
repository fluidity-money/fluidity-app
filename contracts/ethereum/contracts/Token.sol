// SPDX-License-Identifier: GPL

// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

pragma solidity 0.8.11;
pragma abicoder v2;

import "../interfaces/IEmergencyMode.sol";
import "../interfaces/IERC20.sol";
import "../interfaces/IFluidClient.sol";
import "../interfaces/ILiquidityProvider.sol";
import "../interfaces/IOperatorOwned.sol";
import "../interfaces/IToken.sol";
import "../interfaces/ITransferWithBeneficiary.sol";

import "./openzeppelin/SafeERC20.sol";

uint constant DEFAULT_MAX_UNCHECKED_REWARD = 1000;

/// @dev sentinel to indicate a block has been rewarded in the
/// @dev pastRewards_ and rewardedBlocks_ maps
uint constant BLOCK_REWARDED = 1;

/// @title The fluid token ERC20 contract
// solhint-disable-next-line max-states-count
contract Token is IFluidClient, IERC20, ITransferWithBeneficiary, IToken, IEmergencyMode, IOperatorOwned {
    using SafeERC20 for IERC20;

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

    ILiquidityProvider private pool_;

    /* ~~~~~~~~~~` DEPRECATED SLOTS ~~~~~~~~~~ */

    /// @dev deprecated, worker config is now handled externally
    // solhint-disable-next-line var-name-mixedcase
    address private __deprecated_7;

    /* ~~~~~~~~~~` DEPRECATED SLOTS END ~~~~~~~~~~ */

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
    uint private maxUncheckedReward_;

    /// @dev [address] => [number of tokens the user won that have been quarantined]
    mapping (address => uint) private blockedRewards_;

    /* ~~~~~~~~~~` DEPRECATED SLOTS ~~~~~~~~~~ */

    /*
     * These slots were used for the feature "mint limits" which we've
     * since entirely pulled.
     */

    /// @notice deprecated, mint limits no longer exist
    // solhint-disable-next-line var-name-mixedcase
    bool private __deprecated_1;

    /// @notice deprecated, mint limits no longer exist
    // solhint-disable-next-line var-name-mixedcase
    mapping (address => uint) private __deprecated_2;

    /// @notice deprecated, mint limits no longer exist
    // solhint-disable-next-line var-name-mixedcase
    mapping (address => uint) private __deprecated_3;

    /// @notice deprecated, mint limits no longer exist
    // solhint-disable-next-line var-name-mixedcase
    uint private __deprecated_4;

    /// @notice deprecated, mint limits no longer exist
    // solhint-disable-next-line var-name-mixedcase
    uint private __deprecated_5;

    /// @notice deprecated, mint limits no longer exist
    // solhint-disable-next-line var-name-mixedcase
    uint private __deprecated_6;

    /* ~~~~~~~~~~` DEPRECATED SLOTS END ~~~~~~~~~~ */

    /// @dev account that can call the reward function, should be the /operator contract/
    address private oracle_;

    /**
     * @notice initialiser function - sets the contract's data
     * @dev we pass in the metadata explicitly instead of sourcing from the
     * @dev underlying token because some underlying tokens don't implement
     * @dev these methods
     *
     * @param _liquidityProvider the `LiquidityProvider` contract
     *        address. Should have this contract as its owner.
     *
     * @param _decimals the fluid token's decimals (should be the same as the underlying token's)
     * @param _name the fluid token's name
     * @param _symbol the fluid token's symbol
     * @param _emergencyCouncil address that can activate emergency mode
     * @param _operator address that can release quarantine payouts and activate emergency mode
     * @param _oracle address that can call the reward function
     */
     function init(
        address _liquidityProvider,
        uint8 _decimals,
        string memory _name,
        string memory _symbol,
        address _emergencyCouncil,
        address _operator,
        address _oracle
    ) public {
        require(version_ == 0, "contract is already initialised");
        version_ = 1;

        // remember the operator for signing off on oracle changes, large payouts
        operator_ = _operator;

        oracle_ = _oracle;

        // remember the emergency council for shutting down this token
        emergencyCouncil_ = _emergencyCouncil;

        // remember the liquidity provider to deposit tokens into
        pool_ = ILiquidityProvider(_liquidityProvider);

        // sanity check
        underlyingToken().totalSupply();

        noEmergencyMode_ = true;

        // erc20 props
        decimals_ = _decimals;
        name_ = _name;
        symbol_ = _symbol;

        // initialise mint limits
        maxUncheckedReward_ = DEFAULT_MAX_UNCHECKED_REWARD;
    }

    /// @inheritdoc IOperatorOwned
    function updateOperator(address newOperator) public {
        require(msg.sender == operator(), "operator only");

        operator_ = newOperator;

        emit OperatorChanged(operator_, newOperator);
    }

    function emergencyCouncil() public view returns (address) {
        return emergencyCouncil_;
    }

    function noEmergencyMode() public view returns (bool) {
        return noEmergencyMode_;
    }

    /// @inheritdoc IToken
    function oracle() public view returns (address) {
        return oracle_;
    }

    /// @inheritdoc IEmergencyMode
    function enableEmergencyMode() public {
        require(
            msg.sender == operator() ||
            msg.sender == emergencyCouncil() ||
            msg.sender == oracle(),
            "can't enable emergency mode!"
        );

        noEmergencyMode_ = false;

        emit Emergency(true);
    }

    /// @inheritdoc IEmergencyMode
    function disableEmergencyMode() public {
        require(msg.sender == operator(), "operator only");

        noEmergencyMode_ = true;

        emit Emergency(false);
    }

    /// @notice updates the reward quarantine threshold if called by the operator
    function updateRewardQuarantineThreshold(uint _maxUncheckedReward) public {
        require(msg.sender == operator(), "operator only");

        maxUncheckedReward_ = _maxUncheckedReward;

        emit RewardQuarantineThresholdUpdated(_maxUncheckedReward);
    }

    /// @inheritdoc IToken
    function erc20In(uint amount) public returns (uint) {
        require(noEmergencyMode(), "emergency mode!");

        // take underlying tokens from the user

        IERC20 underlying = underlyingToken();

        uint originalBalance = underlying.balanceOf(address(this));

        underlying.safeTransferFrom(msg.sender, address(this), amount);

        uint finalBalance = underlying.balanceOf(address(this));

        // ensure the token is behaving

        require(finalBalance > originalBalance, "bad token bal");

        uint realAmount = finalBalance - originalBalance;

        // add the tokens to our compound pool

        underlying.safeTransfer(address(pool_), realAmount);

        pool_.addToPool(realAmount);

        // give the user fluid tokens

        _mint(msg.sender, realAmount);

        emit MintFluid(msg.sender, realAmount);

        return realAmount;
    }

    /// @inheritdoc IToken
    function erc20InFor(address recipient, uint256 amount) public {
        erc20In(amount);
        transfer(recipient, amount);
    }

    /// @inheritdoc IToken
    function erc20Out(uint amount) public {
        // take the user's fluid tokens

        _burn(msg.sender, amount);

        // give them erc20

        pool_.takeFromPool(amount);

        underlyingToken().safeTransfer(msg.sender, amount);

        emit BurnFluid(msg.sender, amount);
    }

    /// @inheritdoc IToken
    function rewardPoolAmount() public returns (uint) {
        uint totalAmount = pool_.totalPoolAmount();
        uint totalFluid = totalSupply();
        require(totalAmount >= totalFluid, "bad underlying liq");
        return totalAmount - totalFluid;
    }

    /// @inheritdoc IToken
    function underlyingToken() public view returns (IERC20) {
        (bool rc, bytes memory returndata) = address(pool_).staticcall(
            abi.encodeWithSignature("underlying_()")
        );

        if (!rc) {
            assembly {
                revert(add(returndata, 32), mload(returndata))
            }
        }

        (address token) = abi.decode(returndata, (address));

        return IERC20(token);
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

        rewardInternal(winner, amount);
        emit Reward(winner, amount, firstBlock, lastBlock);
    }

    function rewardInternal(address winner, uint256 amount) internal {
        require(noEmergencyMode(), "emergency mode!");

        // mint some fluid tokens from the interest we've accrued

        _mint(winner, amount);
    }

    /// @inheritdoc IFluidClient
    function batchReward(Winner[] memory rewards, uint firstBlock, uint lastBlock) public {
        require(noEmergencyMode(), "emergency mode!");
        require(msg.sender == oracle(), "only oracle");

        uint poolAmount = rewardPoolAmount();

        for (uint i = 0; i < rewards.length; i++) {
            Winner memory winner = rewards[i];

            require(poolAmount >= winner.amount, "empty reward pool");

            poolAmount = poolAmount - winner.amount;

            rewardFromPool(firstBlock, lastBlock, winner.winner, winner.amount);
        }
    }

    /// @inheritdoc IFluidClient
    function getUtilityVars() external returns (UtilityVars memory) {
        UtilityVars memory vars = UtilityVars({
            poolSizeNative: rewardPoolAmount(),
            tokenDecimalScale: 10**decimals(),
            exchangeRateNum: 1,
            exchangeRateDenom: 1,
            deltaWeightNum: 1,
            deltaWeightDenom: 31536000
        });

        return vars;
    }

    /// @inheritdoc IToken
    function unblockReward(
        bytes32 rewardTx,
        address user,
        uint amount,
        bool payout,
        uint firstBlock,
        uint lastBlock
    ) public {
        require(noEmergencyMode(), "emergency mode!");
        require(msg.sender == operator(), "operator only");

        require(blockedRewards_[user] >= amount, "too much unblock");

        blockedRewards_[user] -= amount;

        if (payout) {
            rewardInternal(user, amount);
            emit UnblockReward(rewardTx, user, amount, firstBlock, lastBlock);
        }
    }

    /// @inheritdoc IToken
    function maxUncheckedReward() public view returns (uint) { return maxUncheckedReward_; }

    function operator() public view returns (address) { return operator_; }

    function userAmountMinted(address /* account */) public pure returns (uint) { return 0; }

    // remaining functions are taken from OpenZeppelin's ERC20 implementation

    function name() public view returns (string memory) { return name_; }
    function symbol() public view returns (string memory) { return symbol_; }
    function decimals() public view returns (uint8) { return decimals_; }
    function totalSupply() public view returns (uint256) { return totalSupply_; }
    function balanceOf(address account) public view returns (uint256) {
       return balances_[account];
    }

    function setDecimals(uint8 _decimals) public {
      require(msg.sender == operator(), "operator only");
      decimals_ = _decimals;
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

    /// @inheritdoc ITransferWithBeneficiary
    function transferWithBeneficiary(
        address _token,
        uint256 _amount,
        address _beneficiary,
        uint64 /* data */
    ) external override returns (bool) {
        bool rc;

        rc = Token(_token).transferFrom(msg.sender, address(this), _amount);
        if (!rc) return false;

        rc = Token(_token).transfer(_beneficiary, _amount);

        return rc;
    }

    /// @inheritdoc IToken
    function upgradeLiquidityProvider(ILiquidityProvider newPool) public {
      require(noEmergencyMode(), "emergency mode");
      require(msg.sender == operator(), "operator only");

      uint oldPoolAmount = pool_.totalPoolAmount();

      pool_.takeFromPool(oldPoolAmount);

      pool_ = newPool;

      underlyingToken().safeTransfer(address(pool_), oldPoolAmount);

      pool_.addToPool(oldPoolAmount);

      uint newPoolAmount = pool_.totalPoolAmount();

      require(newPoolAmount == oldPoolAmount, "total amount bad");
    }

    function increaseAllowance(address spender, uint256 addedValue) public returns (bool) {
        _approve(msg.sender, spender, allowances_[msg.sender][spender] + addedValue);
        return true;
    }

    function decreaseAllowance(address spender, uint256 subtractedValue) public returns (bool) {
        uint256 currentAllowance = allowances_[msg.sender][spender];

        // solhint-disable-next-line reason-string
        require(currentAllowance >= subtractedValue, "ERC20: decreased allowance below zero");

        unchecked {
            _approve(msg.sender, spender, currentAllowance - subtractedValue);
        }

        return true;
    }

    /// @inheritdoc IToken
    function drainRewardPool(address _recipient, uint256 _amount) public {
        require(noEmergencyMode(), "emergency mode");
        require(msg.sender == operator(), "operator only");

        uint256 rewardPool = this.rewardPoolAmount();

        require(rewardPool >= _amount, "drain too high");

        rewardInternal(_recipient, _amount);
    }

    function _transfer(
        address from,
        address to,
        uint256 amount
    ) internal {
        // solhint-disable-next-line reason-string
        require(from != address(0), "ERC20: transfer from the zero address");

        // solhint-disable-next-line reason-string
        require(to != address(0), "ERC20: transfer to the zero address");

        uint256 fromBalance = balances_[from];

        // solhint-disable-next-line reason-string
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

        // solhint-disable-next-line reason-string
        require(account != address(0), "ERC20: burn from the zero address");

        uint256 accountBalance = balances_[account];

        // solhint-disable-next-line reason-string
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

        // solhint-disable-next-line reason-string
        require(owner != address(0), "ERC20: approve from the zero address");

        // solhint-disable-next-line reason-string
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
