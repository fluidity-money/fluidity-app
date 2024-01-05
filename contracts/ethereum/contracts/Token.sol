// SPDX-License-Identifier: GPL

// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

pragma solidity 0.8.16;
pragma abicoder v2;

import "../interfaces/IEmergencyMode.sol";
import "../interfaces/IERC20.sol";
import "../interfaces/IERC2612.sol";
import "../interfaces/IFluidClient.sol";
import "../interfaces/ILiquidityProvider.sol";
import "../interfaces/IOperatorOwned.sol";
import "../interfaces/IToken.sol";

import "./openzeppelin/SafeERC20.sol";

uint constant DEFAULT_MAX_UNCHECKED_REWARD = 1000;

/// @dev FEE_DENOM for the fees (ie, 10 is a 1% fee)
uint constant FEE_DENOM = 1000;

/// @title The fluid token ERC20 contract
// solhint-disable-next-line max-states-count
contract Token is
    IFluidClient,
    IERC2612,
    IToken,
    IEmergencyMode,
    IOperatorOwned
{
    using SafeERC20 for IERC20;

    /* ~~~~~~~~~~ ERC20 FEATURES ~~~~~~~~~~ */

    mapping(address => uint256) private balances_;

    mapping(address => mapping(address => uint256)) private allowances_;

    uint8 private decimals_;

    uint256 private totalSupply_;

    string private name_;

    string private symbol_;

    /* ~~~~~~~~~~ HOUSEKEEPING ~~~~~~~~~~ */

    /// @dev if false, emergency mode is active - can be called by either the
    /// @dev operator, worker account or emergency council
    bool private noEmergencyMode_;

    // for migrations
    uint private version_;

    /* ~~~~~~~~~~ LIQUIDITY PROVIDER ~~~~~~~~~~ */

    // @custom:security non-reentrant
    ILiquidityProvider private pool_;

    /* ~~~~~~~~~~ DEPRECATED SLOTS ~~~~~~~~~~ */

    /// @dev deprecated, worker config is now handled externally
    // solhint-disable-next-line var-name-mixedcase
    address private __deprecated_1;

    /* ~~~~~~~~~~ OWNERSHIP ~~~~~~~~~~ */

    /// @dev emergency council that can activate emergency mode
    address private emergencyCouncil_;

    /// @dev account to use that created the contract (multisig account)
    address private operator_;

    /* ~~~~~~~~~~ DEPRECATED SLOTS ~~~~~~~~~~ */

    /// @dev deprecated, we don't track the last rewarded block for manual
    ///      rewards anymore
    // solhint-disable-next-line var-name-mixedcase
    uint private __deprecated_2;

    /// @dev [address] => [[block number] => [has the block been manually
    ///      rewarded by this user?]]
    /// @dev deprecated, we don't do manual rewards anymore
    // solhint-disable-nex-line var-name-mixedcase
    mapping (address => mapping(uint => uint)) private __deprecated_3;

    /// @dev amount a user has manually rewarded, to be removed from their
    ///      batched rewards
    /// @dev [address] => [amount manually rewarded]
    /// @dev deprecated, we don't do manual rewards anymore
    // solhint-disable-nex-line var-name-mixedcase
    mapping (address => uint) private __deprecated_4;

    /* ~~~~~~~~~~ SECURITY FEATURES ~~~~~~~~~~ */

    /// @dev the largest amount a reward can be to not get quarantined
    uint private maxUncheckedReward_;

    /// @dev [address] => [number of tokens the user won that have been quarantined]
    mapping (address => uint) private blockedRewards_;

    /* ~~~~~~~~~~ DEPRECATED SLOTS ~~~~~~~~~~ */

    // slither-disable-start unused-state constable-states naming-convention

    /*
     * These slots were used for the feature "mint limits" which we've
     * since entirely pulled.
     */

    /// @notice deprecated, mint limits no longer exist
    // solhint-disable-next-line var-name-mixedcase
    bool private __deprecated_5;

    /// @notice deprecated, mint limits no longer exist
    // solhint-disable-next-line var-name-mixedcase
    mapping (address => uint) private __deprecated_6;

    /// @notice deprecated, mint limits no longer exist
    // solhint-disable-next-line var-name-mixedcase
    mapping (address => uint) private __deprecated_7;

    /// @notice deprecated, mint limits no longer exist
    // solhint-disable-next-line var-name-mixedcase
    uint private __deprecated_8;

    /// @notice deprecated, mint limits no longer exist
    // solhint-disable-next-line var-name-mixedcase
    uint private __deprecated_9;

    /// @notice deprecated, mint limits no longer exist
    // solhint-disable-next-line var-name-mixedcase
    uint private __deprecated_10;

    // slither-disable-end

    /* ~~~~~~~~~~ ORACLE PAYOUTS ~~~~~~~~~~ */

    /// @dev account that can call the reward function, should be the
    ///      operator contract/
    address private oracle_;

    /* ~~~~~~~~~~ ERC2612 ~~~~~~~~~~ */

    // @dev nonces_ would be used for permit only, but it could be used for
    //      every off-chain sign if needed
    mapping (address => uint256) private nonces_;

    uint256 private initialChainId_;

    bytes32 private initialDomainSeparator_;

    /* ~~~~~~~~~~ FEE TAKING ~~~~~~~~~~ */

    /// @notice burnFee_ that's paid by the user when they burn
    uint256 private burnFee_;

    /// @notice feeRecipient_ that receives the fee paid by a user
    address private feeRecipient_;

    /// @notice burnFee_ that's paid by the user when they mint
    uint256 private mintFee_;

    /* ~~~~~~~~~~ ADDRESS BLACKLISTING ~~~~~~~~~~ */

    /// @notice blacklist_ that's used to prevent certain accounts from
    ///         moving and unwrapping/wrapping funds.
    mapping(address => bool) private blacklist_;

    /* ~~~~~~~~~~ EVENTS ~~~~~~~~~~ */

    /// @dev BlacklistEnabled activated for a specific address
    event BlacklistEnabled(address indexed spender, bool status);

    /* ~~~~~~~~~~ SETUP FUNCTIONS ~~~~~~~~~~ */

    /**
     * @notice computeDomainSeparator that's used for EIP712
     */
    function computeDomainSeparator() internal view virtual returns (bytes32) {
        return keccak256(
            abi.encode(
                keccak256("EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)"),
                keccak256(bytes(name_)),
                keccak256("1"),
                block.chainid,
                address(this)
            )
        );
    }

    function _setupEIP2612() internal {
        initialChainId_ = block.chainid;
        initialDomainSeparator_ = computeDomainSeparator();
    }

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
        require(_operator != address(0), "operator zero");
        require(_oracle != address(0), "oracle zero");

        version_ = 1;

        // remember the operator for signing off on oracle changes, large payouts
        operator_ = _operator;

        oracle_ = _oracle;

        // remember the emergency council for shutting down this token
        emergencyCouncil_ = _emergencyCouncil;

        // remember the liquidity provider to deposit tokens into
        pool_ = ILiquidityProvider(_liquidityProvider);

        // sanity check
        // slither-disable-next-line unused-return
        underlyingToken().totalSupply();

        noEmergencyMode_ = true;

        // erc20 props
        decimals_ = _decimals;
        name_ = _name;
        symbol_ = _symbol;

        // initialise mint limits
        maxUncheckedReward_ = DEFAULT_MAX_UNCHECKED_REWARD;

        _setupEIP2612();
    }

    /**
     * @notice setupEIP2612, made public to support upgrades without a new migration
     */
    function setupEIP2612() public {
        require(msg.sender == operator_, "only operator/Token");

        _setupEIP2612();
    }

    /* ~~~~~~~~~~ INTERNAL FUNCTIONS ~~~~~~~~~~ */

    /// @dev _erc20In has the possibility depending on the underlying LP
    ///      behaviour to not mint the exact amount of tokens, so it returns it
    ///      here (currently won't happen on compound/aave)
    function _erc20In(
        address _spender,
        address _beneficiary,
        uint256 _amount
    ) internal returns (uint256) {
        require(noEmergencyMode_, "emergency mode!");
        require(isAddressAllowed(_spender), "address blacklisted");

        // take underlying tokens from the user

        IERC20 underlying = underlyingToken();

        uint originalBalance = underlying.balanceOf(address(this));

        underlying.safeTransferFrom(_spender, address(this), _amount);

        uint finalBalance = underlying.balanceOf(address(this));

        // ensure the token is behaving

        require(finalBalance > originalBalance, "bad token bal");

        uint realAmount = finalBalance - originalBalance;

        // add the tokens to our compound pool

        underlying.safeTransfer(address(pool_), realAmount);

        pool_.addToPool(realAmount);

        // give the user fluid tokens

        // calculate the fee to take
        uint256 feeAmount =
            (mintFee_ != 0 && realAmount > mintFee_)
                ? (realAmount * mintFee_) / FEE_DENOM
                : 0;

        // calculate the amount to give the user
        uint256 mintAmount = realAmount - feeAmount;

        _mint(_beneficiary, mintAmount);

        emit MintFluid(_beneficiary, mintAmount);

        // mint the fee to the fee recipient
        if (feeAmount > 0) _mint(feeRecipient_, feeAmount);

        return realAmount;
    }

    function _erc20Out(
        address _sender,
        address _beneficiary,
        uint256 _amount
    ) internal returns (uint256) {
        // check if the account isn't blacklisted
        require(isAddressAllowed(_sender), "address blacklisted");

        // take the user's fluid tokens

         // if the fee amount > 0 and the burn fee is greater than 0, then
         // we take burn fee% of the amount given by the user

        uint256 feeAmount =
            (burnFee_ != 0 && _amount > burnFee_)
                ? (_amount * burnFee_) / FEE_DENOM
                : 0;

        // burn burnAmount

        uint256 burnAmount = _amount - feeAmount;

        // give them erc20, if the user's amount is greater than 100, then we keep 1%

        _burn(_sender, _amount);

        pool_.takeFromPool(burnAmount);

        emit BurnFluid(_sender, _amount);

        // send out the amounts

        underlyingToken().safeTransfer(_beneficiary, burnAmount);

        if (feeAmount > 0) _mint(feeRecipient_, feeAmount);

        return burnAmount;
    }

    /**
     * @dev rewards two users from the reward pool
     * @dev mints tokens and emits the reward event
     *
     * @param firstBlock the first block in the range being rewarded for
     * @param lastBlock the last block in the range being rewarded for
     * @param winner the address being rewarded
     * @param amount the amount being rewarded
     */
    function _rewardFromPool(
        uint256 firstBlock,
        uint256 lastBlock,
        address winner,
        uint256 amount
    ) internal {
        require(noEmergencyMode_, "emergency mode!");

        if (amount > maxUncheckedReward_) {
            // quarantine the reward
            emit BlockedReward(winner, amount, firstBlock, lastBlock);

            blockedRewards_[winner] += amount;

            return;
        }

        _mint(winner, amount);

        emit Reward(winner, amount, firstBlock, lastBlock);
    }


    function _reward(address winner, uint256 amount) internal {
        require(noEmergencyMode_, "emergency mode!");

        // mint some fluid tokens from the interest we've accrued

        _mint(winner, amount);
    }

    /// @dev _transfer is implemented by OpenZeppelin
    /// @dev also checks the blacklist and responds accordingly
    function _transfer(
        address from,
        address to,
        uint256 amount
    ) internal {
        // solhint-disable-next-line reason-string
        require(from != address(0), "ERC20: transfer from the zero address");

        // solhint-disable-next-line reason-string
        require(to != address(0), "ERC20: transfer to the zero address");

        require(isAddressAllowed(to), "address blacklisted");
        require(isAddressAllowed(from), "address blacklisted");

        uint256 fromBalance = balances_[from];

        // solhint-disable-next-line reason-string
        require(fromBalance >= amount, "ERC20: transfer amount exceeds balance");

        unchecked {
            balances_[from] = fromBalance - amount;
        }

        balances_[to] += amount;

        emit Transfer(from, to, amount);
    }

    /// @dev _mint is implemented by OpenZeppelin
    function _mint(address _account, uint256 _amount) internal virtual {
        require(_account != address(0), "ERC20: mint to the zero address");

        totalSupply_ += _amount;
        balances_[_account] += _amount;
        emit Transfer(address(0), _account, _amount);
    }

    /// @dev _burn is implemented by OpenZeppelin
    function _burn(address _account, uint256 _amount) internal virtual {
        // solhint-disable-next-line reason-string
        require(_account != address(0), "ERC20: burn from the zero address");

        uint256 accountBalance = balances_[_account];

        // solhint-disable-next-line reason-string
        require(accountBalance >= _amount, "ERC20: burn amount exceeds balance");


        unchecked {
            balances_[_account] = accountBalance - _amount;

        }

        totalSupply_ -= _amount;

        emit Transfer(_account, address(0), _amount);
    }

    /// @dev _approve is implemented by OpenZeppelin
    function _approve(
        address _owner,
        address _spender,
        uint256 _amount
    ) internal virtual {
        require(_owner != address(0), "approve from zero");

        emit Approval(_owner, _spender, _amount);

        // solhint-disable-next-line reason-string
        require(_spender != address(0), "approve to zero");

        allowances_[_owner][_spender] = _amount;
    }

    /// @dev _spendAllowance is implemented by OpenZeppelin
    function _spendAllowance(
        address owner,
        address spender,
        uint256 amount
    ) internal virtual {
        uint256 currentAllowance = allowance(owner, spender);

        if (currentAllowance != type(uint256).max) {
            require(currentAllowance >= amount, "insufficient allowance");

            unchecked {
                _approve(owner, spender, currentAllowance - amount);
            }
        }
    }

    /* ~~~~~~~~~~ EXTRA FUNCTIONS ~~~~~~~~~~ */

    function updateOracle(address _newOracle) public {
        require(msg.sender == operator_, "only operator");

        oracle_ = _newOracle;
    }

    /**
     * @notice update the operator account to a new address
     * @param _newOperator the address of the new operator to change to
     */
    function updateOperator(address _newOperator) public {
        require(msg.sender == operator_, "operator only");
        require(_newOperator != address(0), "new operator zero");

        emit NewOperator(operator_, _newOperator);

        operator_ = _newOperator;
    }

    /* ~~~~~~~~~~ IMPLEMENTS IOperatorOwned ~~~~~~~~~~ */

    /// @inheritdoc IOperatorOwned
    function operator() public view returns (address) { return operator_; }

    /* ~~~~~~~~~~ IMPLEMENTS IEmergencyMode ~~~~~~~~~~ */

    /// @inheritdoc IEmergencyMode
    function enableEmergencyMode() public {
        require(
            msg.sender == operator_ ||
            msg.sender == emergencyCouncil_ ||
            msg.sender == oracle_,
            "can't enable emergency mode!"
        );

        noEmergencyMode_ = false;

        emit Emergency(true);
    }

    /// @inheritdoc IEmergencyMode
    function disableEmergencyMode() public {
        require(msg.sender == operator_, "operator only");

        noEmergencyMode_ = true;

        emit Emergency(false);
    }

    function noEmergencyMode() public view returns (bool) {
        return noEmergencyMode_;
    }

    function emergencyCouncil() public view returns (address) {
        return emergencyCouncil_;
    }

    /**
     * @notice updates the emergency council address
     * @notice (operator only)
     * @param newCouncil the new council address
     */
    function updateEmergencyCouncil(address newCouncil) external {
        require(msg.sender == operator_, "operator only");

        emit NewCouncil(emergencyCouncil_, newCouncil);

        emergencyCouncil_ = newCouncil;
    }

    /* ~~~~~~~~~~ IMPLEMENTS IToken ~~~~~~~~~~ */

    /// @inheritdoc IToken
    function oracle() public view returns (address) {
        return oracle_;
    }

    /// @inheritdoc IToken
    function underlyingToken() public view returns (IERC20) {
        return pool_.underlying_();
    }

    /// @inheritdoc IToken
    function underlyingLp() public view returns (ILiquidityProvider) {
        return pool_;
    }

    /// @notice updates the reward quarantine threshold if called by the operator
    function updateRewardQuarantineThreshold(uint _maxUncheckedReward) public {
        require(msg.sender == operator_, "operator only");

        maxUncheckedReward_ = _maxUncheckedReward;

        emit RewardQuarantineThresholdUpdated(_maxUncheckedReward);
    }

    /// @inheritdoc IToken
    function erc20In(uint _amount) public returns (uint) {
        return _erc20In(msg.sender, msg.sender, _amount);
    }

    /// @inheritdoc IToken
    // slither-disable-next-line reentrancy-no-eth
    function erc20InTo(
        address _recipient,
        uint256 _amount
    ) public returns (uint256 amountOut) {
        return _erc20In(msg.sender, _recipient, _amount);
    }

    /// @inheritdoc IToken
    function erc20Out(uint256 _amount) public returns (uint256) {
        return _erc20Out(msg.sender, msg.sender,_amount);
    }

    /// @inheritdoc IToken
    function erc20OutTo(address _recipient, uint256 _amount) public returns (uint256) {
        return _erc20Out(msg.sender, _recipient, _amount);
    }

    /// @inheritdoc IToken
    function burnFluidWithoutWithdrawal(uint256 _amount) public {
        // burns fluid without taking from the liquidity provider
        // this is fine, because the amount in the liquidity provider
        // and the amount of fluid tokens are explicitly allowed to be different
        // using this will essentially add the tokens to the reward pool
        _burn(msg.sender, _amount);
    }

    /// @inheritdoc IToken
    function rewardPoolAmount() public returns (uint) {
        // XXX calling totalPoolAmount before totalSupply is load bearing to the StupidLiquidityProvider
        uint totalAmount = pool_.totalPoolAmount();
        uint totalFluid = totalSupply();
        require(totalAmount >= totalFluid, "bad underlying liq");
        return totalAmount - totalFluid;
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
        require(noEmergencyMode_, "emergency mode!");
        require(msg.sender == operator_, "operator only");

        require(blockedRewards_[user] >= amount, "too much unblock");

        blockedRewards_[user] -= amount;

        if (payout) {
            _reward(user, amount);
            emit UnblockReward(rewardTx, user, amount, firstBlock, lastBlock);
        }
    }

    /// @inheritdoc IToken
    function maxUncheckedReward() public view returns (uint) {
        return maxUncheckedReward_;
    }

    /// @inheritdoc IToken
    function upgradeLiquidityProvider(
        ILiquidityProvider _newPool,
        uint256 _minTokenAfterShift
     ) public returns (uint256) {
      require(noEmergencyMode_, "emergency mode");
      require(msg.sender == operator_, "operator only");

      uint oldPoolAmount = pool_.totalPoolAmount();

      pool_.takeFromPool(oldPoolAmount);

      pool_ = _newPool;

      underlyingToken().safeTransfer(address(pool_), oldPoolAmount);

      pool_.addToPool(oldPoolAmount);

      uint newPoolAmount = pool_.totalPoolAmount();

      require(newPoolAmount > _minTokenAfterShift + 1, "total amount bad");

      return newPoolAmount;
    }

    /// @inheritdoc IToken
    function drainRewardPool(address _recipient, uint256 _amount) public {
        require(noEmergencyMode_, "emergency mode");
        require(msg.sender == operator_, "operator only");

        uint256 rewardPool = rewardPoolAmount();

        require(rewardPool >= _amount, "drain too high");

        _reward(_recipient, _amount);
    }

    /* ~~~~~~~~~~ IMPLEMENTS IFluidClient ~~~~~~~~~~ */

    /// @inheritdoc IFluidClient
    function batchReward(
        Winner[] memory rewards,
        uint firstBlock,
        uint lastBlock
    ) public {
        require(noEmergencyMode_, "emergency mode!");
        require(msg.sender == oracle_, "only oracle");

        uint poolAmount = rewardPoolAmount();

        for (uint i = 0; i < rewards.length; i++) {
            Winner memory winner = rewards[i];

            require(poolAmount >= winner.amount, "empty reward pool");

            poolAmount = poolAmount - winner.amount;

            _rewardFromPool(
                firstBlock,
                lastBlock,
                winner.winner,
                winner.amount
            );
        }
    }

    /// @inheritdoc IFluidClient
    function getUtilityVars() external returns (UtilityVars memory) {
        return UtilityVars({
            poolSizeNative: rewardPoolAmount(),
            tokenDecimalScale: 10**decimals(),
            exchangeRateNum: 1,
            exchangeRateDenom: 1,
            deltaWeightNum: 31536000,
            deltaWeightDenom: 1,
            customCalculationType: DEFAULT_CALCULATION_TYPE
        });
    }

    /* ~~~~~~~~~~ IMPLEMENTS IERC2612 ~~~~~~~~~~ */

    /// @inheritdoc IERC2612
    function nonces(address _owner) public view returns (uint256) {
        return nonces_[_owner];
    }

    /// @inheritdoc IEIP712
    // solhint-disable-next-line func-name-mixedcase
    function DOMAIN_SEPARATOR() public view virtual returns (bytes32) {
        return
            block.chainid == initialChainId_
                ? initialDomainSeparator_
                : computeDomainSeparator();
    }

    /// @inheritdoc IERC2612
    function permit(
        address _owner,
        address _spender,
        uint256 _value,
        uint256 _deadline,
        uint8 _v,
        bytes32 _r,
        bytes32 _s
    ) public virtual {
        // solhint-disable-next-line not-rely-on-time
        require(_deadline >= block.timestamp, "permit deadline expired");

        unchecked {
            address recoveredAddress = ecrecover(
                keccak256(
                    abi.encodePacked(
                        "\x19\x01",
                        DOMAIN_SEPARATOR(),
                        keccak256(
                            abi.encode(
                                EIP721_PERMIT_SELECTOR,
                                _owner,
                                _spender,
                                _value,
                                nonces_[_owner]++,
                                _deadline
                            )
                        )
                    )
                ),
                _v,
                _r,
                _s
            );

            require(recoveredAddress != address(0), "invalid signer");

            require(recoveredAddress == _owner, "invalid signer");

            allowances_[recoveredAddress][_spender] = _value;
        }
    }

    /* ~~~~~~~~~~ IMPLEMENTS IERC20 ~~~~~~~~~~ */

    // remaining functions are taken from OpenZeppelin's ERC20 implementation

    function name() public view returns (string memory) { return name_; }
    function symbol() public view returns (string memory) { return symbol_; }
    function decimals() public view returns (uint8) { return decimals_; }
    function totalSupply() public view returns (uint256) { return totalSupply_; }
    function balanceOf(address account) public view returns (uint256) {
       return balances_[account];
    }

    function transfer(address _to, uint256 _amount) public returns (bool) {
        _transfer(msg.sender, _to, _amount);
        return true;
    }

    function allowance(
        address _owner,
        address _spender
    ) public view returns (uint256) {
        return allowances_[_owner][_spender];
    }

    function approve(address _spender, uint256 _amount) public returns (bool) {
        _approve(msg.sender, _spender, _amount);
        return true;
    }

    /**
     * @dev transferFrom the address with the sender, if they're allowed.
     * @param _from address to send from
     * @param _to recipient of the amount
     * @param _amount to send
     * @dev note that this enforces a blacklist on the sender and _from
     */
    function transferFrom(
        address _from,
        address _to,
        uint256 _amount
    ) public returns (bool) {
        require(isAddressAllowed(msg.sender), "address blacklisted");
        _spendAllowance(_from, msg.sender, _amount);
        _transfer(_from, _to, _amount);
        return true;
    }

    // not actually a part of IERC20 but we support it anyway

    function increaseAllowance(
        address _spender,
        uint256 _addedValue
    ) public returns (bool) {
        _approve(
            msg.sender,
            _spender,
            allowances_[msg.sender][_spender] + _addedValue
        );

        return true;
    }

    function decreaseAllowance(
        address _spender,
        uint256 _subtractedValue
    ) public returns (bool) {
        uint256 currentAllowance = allowances_[msg.sender][_spender];

        // solhint-disable-next-line reason-string
        require(
            currentAllowance >= _subtractedValue,
            "ERC20: decreased allowance below zero"
        );

        unchecked {
            _approve(msg.sender, _spender, currentAllowance - _subtractedValue);
        }

        return true;
    }

    /* ~~~~~~~~~~ MISC OPERATOR FUNCTIONS ~~~~~~~~~~ */

    function setFeeDetails(uint256 _mintFee, uint256 _burnFee, address _recipient) public {
        require(msg.sender == operator_, "only operator");

        require(_mintFee < FEE_DENOM, "mint fee too high");
        require(_burnFee < FEE_DENOM, "burn fee too high");

        emit FeeSet(mintFee_, _mintFee, burnFee_, _burnFee);

        feeRecipient_ = _recipient;

        mintFee_ = _mintFee;
        burnFee_ = _burnFee;
    }

    /**
     * @dev blacklistAddress, only callable by the operator.
     * @param _spender to ban using the blacklisting feature
     * @param _status of whether or not it's enabled
     */
    function blacklistAddress(address _spender, bool _status) public {
        require(
            msg.sender == operator_ || msg.sender == emergencyCouncil_,
            "only operator/emergency council"
        );
        require(_spender != address(0), "no zero address");
        emit BlacklistEnabled(_spender, _status);
        blacklist_[_spender] = _status;
    }

    /**
     * @notice isAddressAllowed (are they not blacklisted?)
     * @param _account to test
     */
    function isAddressAllowed(address _account) public view returns (bool) {
        return !blacklist_[_account];
    }
}
