// SPDX-License-Identifier: GPL

// Copyright 2022 Fluidity Money. All rights reserved. Use of this
// source code is governed by a GPL-style license that can be found in the
// LICENSE.md file.

pragma solidity 0.8.11;
pragma abicoder v2;

import "./openzeppelin/Address.sol";
import "./Registry.sol";

contract Operator {
    using Address for address;

    struct OracleUpdate {
        address contractAddr;
        address newOracle;
    }

    /// @notice emitted when the rng oracles are changed to a new address
    event OracleChanged(address indexed contractAddr, address indexed oldOracle, address indexed newOracle);

    /// @notice emitted when an emergency is declared!
    event Emergency(bool indexed enabled);

    /// @dev deprecated, emergency mode is part of the registry now
    bool private __deprecated_1;

    /// @dev for migrations
    uint256 private version_;

    /// @dev deprecated, emergency mode is part of the registry now
    address private __deprecated_2;

    /// @dev can update contract props and oracles
    address private operator_;

    /// @dev token => oracle
    mapping(address => address) private oracles_;

    Registry private registry_;

    /// @dev token => blocknum
    mapping(address => uint) lastRewardedBlock_;

    /// @dev token => user => blocknum => manual rewarded
    mapping(address => mapping(address => mapping(uint => bool))) manualRewardedBlocks_;

    /// @dev token => total number
    mapping(address => uint) private totalManualRewardDebt_;

    /// @dev token => utility => user => amount
    mapping(address => mapping(string => mapping(address => uint))) private manualRewardDebt_;
    /**
     * @notice intialise the worker config for each of the tokens in the map
     *
     * @param _operator to use that can update the worker config
     */
    function init(
        address _operator,
        address /* _emergencyCouncil */
    ) public {
        require(version_ == 0, "contract is already initialised");
        version_ = 1;

        operator_ = _operator;

        //emergencyCouncil_ = _emergencyCouncil;

        //noGlobalEmergency_ = true;
    }

    function migrate_1(Registry _registry) public {
        require(version_ == 1, "contract needs to be version 1");
        require(msg.sender == operator_, "only the operator can use this");
        version_ = 2;

        registry_ = _registry;
    }

    /// @notice updates the trusted oracle to a new address
    function updateOracles(OracleUpdate[] memory newOracles) public {
        require(registry_.noGlobalEmergency(), "emergency mode!");
        require(msg.sender == operator_, "only operator account can use this");

        for (uint i = 0; i < newOracles.length; i++) {
            OracleUpdate memory oracle = newOracles[i];

            emit OracleChanged(oracle.contractAddr, oracles_[oracle.contractAddr], oracle.newOracle);

            oracles_[oracle.contractAddr] = oracle.newOracle;
        }
    }

    function getWorkerAddress(address contractAddr) public view returns (address) {
        require(registry_.noGlobalEmergency(), "emergency mode!");

        return oracles_[contractAddr];
    }

    function getWorkerAddress() public view returns (address) {
        require(registry_.noGlobalEmergency(), "emergency mode!");

        return oracles_[msg.sender];
    }

    /// @dev oracle function to reward
    function reward(address token, FluidityReward[] calldata rewards, uint firstBlock, uint lastBlock) public {
        address oracle = oracles_[token];
        require(msg.sender == oracle, "not authorised to use this!");

        // this might not happen if our transactions go through out of order
        if (lastBlock > lastRewardedBlock_[token]) lastRewardedBlock_[token] = lastBlock;

        if (totalManualRewardDebt_[token] != 0) {
            FluidityReward[] memory newRewards = rewards;

            for (uint i = 0; i < newRewards.length; i++) {
                for (uint j = 0; j < newRewards[i].rewards.length; j++) {
                    Winner memory winner = newRewards[i].rewards[j];
                    uint curDebt = manualRewardDebt_[token][newRewards[i].clientName][winner.winner];
                    if (curDebt != 0) {
                        uint amount = winner.amount > curDebt ?
                            curDebt :
                            winner.amount;

                        // and we update that debt and the win amount
                        newRewards[i].rewards[j].amount -= amount;
                        manualRewardDebt_[token][newRewards[i].clientName][winner.winner] -= amount;

                        totalManualRewardDebt_[token] -= amount;
                    }
                }
            }

            registry_.reward(token, newRewards, firstBlock, lastBlock);
        } else {
            registry_.reward(token, rewards, firstBlock, lastBlock);
        }
    }

    /**
     * @notice lets a user frontrun our worker, paying their own gas
     * @notice requires a signature of the random numbers generated
     * @notice by the trusted oracle
     *
     * @param winner the address of the user being rewarded
     * @param rewards the rewards, must all be for the same user
     * @param firstBlock the first block in the range being rewarded for
     * @param lastBlock the last block in the range being rewarded for
     * @param sig the signature of the above parameters, provided by the oracle
     */
    function manualReward(
        address token,
        uint256 chainid,
        address winner,
        FluidityReward[] calldata rewards,
        uint firstBlock,
        uint lastBlock,
        bytes memory sig
    ) external {
        require(oracles_[token] != address(0), "invalid contract address!");

        // web based signers (ethers, metamask, etc) add this prefix to stop you signing arbitrary data
        //bytes32 hash = keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", sha256(rngRlp)));
        bytes32 hash = keccak256(abi.encode(
            token,
            chainid,
            winner,
            rewards,
            firstBlock,
            lastBlock
        ));

        // ECDSA verification
        require(recover(hash, sig) == oracles_[token], "invalid rng signature");

        require(chainid == block.chainid, "payload is for the wrong chain");

        // the payload's ours, make sure it's valid to apply

        // user decided to frontrun
        require(
            firstBlock > lastRewardedBlock_[token],
            "reward already given for part of this range"
        );

        require(lastBlock >= firstBlock, "invalid block range in payload!");

        for (uint i = firstBlock; i <= lastBlock; i++) {
            require(manualRewardedBlocks_[token][winner][i] == false, "reward already given for part of this range");
            manualRewardedBlocks_[token][winner][i] = true;
        }

        // make sure the payload itself is valid and set debt

        for (uint i = 0; i < rewards.length; i++) {
            FluidityReward memory rewardData = rewards[i];
            for (uint j = 0; j < rewardData.rewards.length; j++) {
                Winner memory reward = rewardData.rewards[j];
                require(reward.winner == winner, "manual rewards include a payload for the wrong winner!");

                manualRewardDebt_[token][rewardData.clientName][winner] += reward.amount;
                totalManualRewardDebt_[token] += reward.amount;
            }
        }

        // now actually pay out the user

        registry_.reward(token, rewards, firstBlock, lastBlock);
    }

    /**
     * @dev ECrecover with checks for signature malleability
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
}
