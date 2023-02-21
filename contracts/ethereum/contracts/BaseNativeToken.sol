// SPDX-License-Identifier: AGPL-3.0-only

pragma solidity ^0.8.11.0;

import "../interfaces/IERC20.sol";

import "./openzeppelin/SafeERC20.sol";

/**
* @notice Modern and gas efficient ERC20 + EIP-2612 implementation.
* @author Fluidity Money
*
* @author Modified from Solmate
* (https://github.com/transmissions11/solmate/blob/main/src/tokens/ERC20.sol)
*
* @notice Modified to support proxy initialisation and to support some
* extra functions, as well as mint from the initial amount
*
* @dev Do not manually set balances without updating totalSupply, as
* the sum of all user balances must not exceed it.
*/
abstract contract BaseNativeToken is IERC20 {
    using SafeERC20 for IERC20;

    /*//////////////////////////////////////////////////////////////
                            METADATA STORAGE
    //////////////////////////////////////////////////////////////*/

    string private name_;

    string private symbol_;

    uint8 private decimals_;

    /*//////////////////////////////////////////////////////////////
                              ERC20 STORAGE
    //////////////////////////////////////////////////////////////*/

    uint256 private totalSupply_;

    mapping(address => uint256) private balanceOf_;

    mapping(address => mapping(address => uint256)) private allowance_;

    /*//////////////////////////////////////////////////////////////
                            EIP-2612 STORAGE
    //////////////////////////////////////////////////////////////*/

    uint256 internal initialChainId_;

    bytes32 internal initialDomainSeparator_;

    mapping(address => uint256) public nonces_;

    /*//////////////////////////////////////////////////////////////
                                  INITIALISE
    //////////////////////////////////////////////////////////////*/

    function init(
        string memory _name,
        string memory _symbol,
        uint8 _decimals
    ) virtual internal {
        name_ = _name;
        symbol_ = _symbol;
        decimals_ = _decimals;

        initialChainId_ = block.chainid;

        initialDomainSeparator_ = computeDomainSeparator();
    }

    /*//////////////////////////////////////////////////////////////
                               ERC20 LOGIC
    //////////////////////////////////////////////////////////////*/

    function approve(address _spender, uint256 _amount) public returns (bool) {
        allowance_[msg.sender][_spender] = _amount;

        emit Approval(msg.sender, _spender, _amount);

        return true;
    }

    function transfer(address _to, uint256 _amount) public virtual returns (bool) {
        require(_to != address(0), "can't send to null account");

        // explicitly call balanceOf so decay possible via implementor

        require(balanceOf(msg.sender) >= _amount, "not enough balance");

        balanceOf_[msg.sender] -= _amount;

        // Cannot overflow because the sum of all user
        // balances can't exceed the max uint256 value.
        unchecked {
            balanceOf_[_to] += _amount;
        }

        emit Transfer(msg.sender, _to, _amount);

        return true;
    }

    function transferFrom(
        address _from,
        address _to,
        uint256 _amount
    ) public virtual returns (bool) {
        // Saves gas for limited approvals.
        uint256 allowed = allowance_[_from][msg.sender];

        if (allowed != type(uint256).max)
            allowance_[_from][msg.sender] = allowed - _amount;

        // the user's balance will underflow, causing a revert here

        balanceOf_[_from] -= _amount;

        // Cannot overflow because the sum of all user
        // balances can't exceed the max uint256 value.
        unchecked {
            balanceOf_[_to] += _amount;
        }

        emit Transfer(_from, _to, _amount);

        return true;
    }

    function increaseAllowance(
        address _spender,
        uint256 _amount
    ) public returns (bool) {
        approve(_spender, allowance_[msg.sender][_spender] + _amount);
        return true;
    }

    function decreaseAllowance(
        address _spender,
        uint256 _amount
    ) public returns (bool) {
        // no check cause solidity reverts when it goes under 0
        uint256 newAmount = allowance_[msg.sender][_spender] - _amount;

        return approve(_spender, newAmount);
    }

    function allowance(
        address _owner,
        address _spender
    ) public view returns (uint256) {
        return allowance_[_owner][_spender];
    }

    function balanceOf(
        address _spender
    ) public virtual view returns (uint256) {
        return balanceOf_[_spender];
    }

    function totalSupply() public view returns (uint256) {
        return totalSupply_;
    }

    function name() public view returns (string memory) {
        return name_;
    }

    function symbol() public view returns (string memory) {
        return symbol_;
    }

    function decimals() public view returns (uint8) {
        return decimals_;
    }

    /*//////////////////////////////////////////////////////////////
                             EIP-2612 LOGIC
    //////////////////////////////////////////////////////////////*/

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
        require(_deadline >= block.timestamp, "PERMIT_DEADLINE_EXPIRED");

        // Unchecked because the only math done is incrementing
        // the owner's nonce which cannot realistically overflow.
        unchecked {
            address recoveredAddress = ecrecover(
                keccak256(
                    abi.encodePacked(
                        "\x19\x01",
                        DOMAIN_SEPARATOR(),
                        keccak256(
                            abi.encode(
                                keccak256(
                                    "Permit(address owner,address spender,uint256 value,uint256 nonce,uint256 deadline)"
                                ),
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

            require(recoveredAddress != address(0) && recoveredAddress == _owner, "INVALID_SIGNER");

            allowance_[recoveredAddress][_spender] = _value;
        }

        emit Approval(_owner, _spender, _value);
    }

    // solhint-disable-next-line func-name-mixedcase
    function DOMAIN_SEPARATOR() public view virtual returns (bytes32) {
        return block.chainid == initialChainId_ ? initialDomainSeparator_ : computeDomainSeparator();
    }

    function computeDomainSeparator() internal view virtual returns (bytes32) {
        return
            keccak256(
                abi.encode(
                    keccak256("EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)"),
                    keccak256(bytes(name_)),
                    keccak256("1"),
                    block.chainid,
                    address(this)
                )
            );
    }

    /*//////////////////////////////////////////////////////////////
                        INTERNAL MINT/BURN LOGIC
    //////////////////////////////////////////////////////////////*/

    function _mint(address _to, uint256 _amount) internal virtual {
        totalSupply_ += _amount;

        // Cannot overflow because the sum of all user
        // balances can't exceed the max uint256 value.
        unchecked {
            balanceOf_[_to] += _amount;
        }

        emit Transfer(address(0), _to, _amount);
    }

    function _burn(address _from, uint256 _amount) internal virtual {
        balanceOf_[_from] -= _amount;

        // Cannot underflow because a user's balance
        // will never be larger than the total supply.
        unchecked {
            totalSupply_ -= _amount;
        }

        emit Transfer(_from, address(0), _amount);
    }
}