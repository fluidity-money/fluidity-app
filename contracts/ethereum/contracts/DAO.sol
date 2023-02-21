// SPDX-License-Identifier: GPL

pragma solidity ^0.8.11;
pragma abicoder v2;

import "@openzeppelin/contracts/proxy/beacon/BeaconProxy.sol";
import "@openzeppelin/contracts/proxy/beacon/IBeacon.sol";

import "../interfaces/IToken.sol";

import "./VEGovLockup.sol";
import "./Operator.sol";

/// @dev default time to wait before a vote is possibly ratified after it's submission
uint256 constant DEFAULT_VOTE_BLOCK_TIME = 10 days;

/// @dev default vote timelock once a vote has been ratified
uint256 constant DEFAULT_FROZEN_TIME = 24 hours;

enum ProposalStatus {
    UNFINISHED,
    FROZEN,
    SUCCEEDED,
    EXECUTED,
    FAILED,
    KILLED
}

struct Proposal {
    /// @notice targetContract to delegateCall to, if it's set to address(0)
    ///         it's been executed
    address targetContract;

    /// @notice ratificationTs to use as the timestamp of when voting finished
    uint256 ratificationTs;

    /// @notice votesFor that voted in favour of the proposal
    uint256 votesFor;

    /// @notice votesAgainst the proposal
    uint256 votesAgainst;

    /// @notice data to use as calldata in delegatecall
    bytes data;

    /// @notice votes that were made by users
    mapping(address => uint256) votes;

    /// @notice killed by the emergency council?
    bool killed;

    /// @notice isDelegateCall instead of ordinary call
    bool isDelegateCall;
}

/*
 * DAO supports deploying tokens and liquidity pools, freezing them,
 * doing contract upgrades, allocating amounts using utility gauges to
 * different protocols
 */
contract DAO {

    event VoteCreated(bytes32 indexed proposalId);

    event VoteExecuted(bytes32 indexed proposalId);

    event Voted(
        bool direction,
        bytes32 indexed proposalId,
        address sender,
        uint256 amount
    );

    event ProposalCreated(bytes ipfsHash, bytes32 proposalId);

    VEGovLockup lockupSource_;

    address emergencyCouncil_;

    mapping(bytes32 => Proposal) proposals_;

    /// @notice init the contract with the operator, creating an empty
    ///         set of ballots
    /// @dev _council to use
    constructor(
        address _emergencyCouncil,
        VEGovLockup _lockupSource
    ) {
        emergencyCouncil_ = _emergencyCouncil;
        lockupSource_ = _lockupSource;
    }

    function getRatificationTs(bytes32 _proposalId) public view returns (uint256) {
        return proposals_[_proposalId].ratificationTs;
    }

    function getProposalExists(bytes32 _proposalId) public view returns (bool) {
        return getRatificationTs(_proposalId) == 0;
    }

    function getAmountAlreadyVoted(
        bytes32 _proposalId,
        address _spender
    )
        public view returns (uint256)
    {
      return proposals_[_proposalId].votes[_spender];
    }

    /**
     * @notice _voteFor a proposal, recording the votes the user voted
     *         and the votes for
     *
     * @param _sender that voted for the proposal
     * @param _proposalId to address the proposal with
     * @param _amount to record for the votes and to add that the user voted
     */
    function _voteFor(address _sender, bytes32 _proposalId, uint256 _amount) internal {
        proposals_[_proposalId].votesFor += _amount;
        proposals_[_proposalId].votes[_sender] += _amount;
        emit Voted(true, _proposalId, _sender, _amount);
    }

    /**
     * @notice _voteAgainst a proposal, recording the votes the user voted
     *         and the votes against
     *
     * @param _sender that voted for the proposal
     * @param _proposalId to address the proposal with
     * @param _amount to record for the votes and to add that the user voted
     */
     function _voteAgainst(
         address _sender,
         bytes32 _proposalId,
         uint256 _amount
     ) internal {
         proposals_[_proposalId].votesAgainst += _amount;
         proposals_[_proposalId].votes[_sender] += _amount;
         emit Voted(false, _proposalId, _sender, _amount);
    }

    /**
     * @notice newProposalId is a concatenation of the inputs to the
     *         proposal
     */
    function newProposalId(
        bytes memory _ipfsHash,
        address _target,
        bool _isDelegateCall,
        bytes calldata _calldata
    ) internal pure returns (bytes32) {
        return keccak256(bytes.concat(abi.encode(
            _ipfsHash,
            _target,
            _isDelegateCall,
            _calldata
        )));
    }

    /**
     * @notice createProposal with the inputs given
     * @param _target contract address to execute the calldata on
     * @param _calldata to execute once the period has passed and the vote
     *        has succeeded
     *
     * @dev the null address is used more than once to check for prior
            execution, and should not be used to create a contract
     */
    function createProposal(
        bytes calldata _ipfsHash,
        address _target,
        uint256 _forAmount,
        uint256 _againstAmount,
        bool _isDelegateCall,
        bytes calldata _calldata
    ) public {
        require(_target != address(0), "null address");

        bytes32 proposalId = newProposalId(
            _ipfsHash,
            _target,
            _isDelegateCall,
            _calldata
        );

        Proposal storage proposal = proposals_[proposalId];

        emit ProposalCreated(_ipfsHash, proposalId);

        require(!getProposalExists(proposalId), "proposal already exists");

        proposal.ratificationTs = block.timestamp + DEFAULT_VOTE_BLOCK_TIME;
        proposal.targetContract = _target;
        proposal.isDelegateCall = _isDelegateCall;
        proposal.data = _calldata;

        if (_forAmount > 0)
            voteFor(proposalId, _forAmount);

        if (_againstAmount > 0)
            voteAgainst(proposalId, _againstAmount);
    }

    function getProposalKilled(bytes32 _proposalId) public view returns (bool) {
        return proposals_[_proposalId].killed;
    }

    function getProposalVotingOver(bytes32 _proposalId) public view returns (bool) {
        return getRatificationTs(_proposalId) < block.timestamp;
    }

    function getProposalVoteable(bytes32 _proposalId) public view returns (bool) {
        return !getProposalVotingOver(_proposalId);
    }

    /**
     * @notice getProposalFrozenPeriodOver if the time that the
     *         proposal was set to expire + the frozen period exceeds the current
     *         timestamp
     *
     * @param _proposalId to check the condition for
     */
    function getProposalFrozenPeriodOver(bytes32 _proposalId) public view returns (bool) {
        // getRatificationTs returns the timestamp that the proposal was
        // submitted for + the voting period
        uint256 ts = getRatificationTs(_proposalId);

        // if the ratification period + the time for the voting has passed + the
        // frozen period, this would return true

        return ts > block.timestamp + DEFAULT_FROZEN_TIME;
    }

    function getProposalExecuted(bytes32 _proposalId) public view returns (bool) {
        return proposals_[_proposalId].targetContract == address(0);
    }

    /// @notice getProposalPassing check if the proposal has enough votes
    ///         to pass
    function getProposalPassing(bytes32 _proposalId) public view returns (bool) {
        return proposals_[_proposalId].votesFor > proposals_[_proposalId].votesAgainst;
    }

    function getProposalStatus(bytes32 _proposalId) public view returns (ProposalStatus) {
        // was the proposal killed?
        bool proposalKilled = getProposalKilled(_proposalId);

        // is the period of voting over?
        bool proposalVotingOver = getProposalVotingOver(_proposalId);

        // is the period where the proposal is frozen over?
        bool proposalFrozenPeriodOver = getProposalFrozenPeriodOver(_proposalId);

        // is the proposal passing?
        bool proposalPassing = getProposalPassing(_proposalId);

        // has the proposal already been executed?
        bool proposalExecuted = getProposalExecuted(_proposalId);

        if (proposalKilled) return ProposalStatus.KILLED;

        // if the vote passed, and it's past the period of freeze, and it's
        // been executed, it's been executed

        if (proposalFrozenPeriodOver && proposalPassing && proposalExecuted)
            return ProposalStatus.EXECUTED;

        // if the vote passed, and it's past the period of freeze, and it's
        // not been executed, then it's ready

        if (proposalFrozenPeriodOver && proposalPassing)
            return ProposalStatus.SUCCEEDED;

        // if the proposal's voting is complete, and the proposal is
        // passing, it's frozen

        if (proposalVotingOver && proposalPassing) return ProposalStatus.FROZEN;

        // if the proposal is over, but the proposal doesn't have enough
        // votes, it fails

        if (proposalVotingOver) return ProposalStatus.FAILED;

        // if the proposal is still in progress, it's unfinished

        return ProposalStatus.UNFINISHED;
    }

    function getProposalReadyToExecute(bytes32 _proposalId) public view returns (bool) {
        return getProposalStatus(_proposalId) == ProposalStatus.SUCCEEDED;
    }

    function getProposalFailed(bytes32 _proposalId) public view returns (bool) {
        return getProposalStatus(_proposalId) == ProposalStatus.FAILED;
    }

    /// @notice getAmountUserCanVote based on what's been voted so far
    ///         and the balance the user has based on the decay
    function getAmountAvailable(
        bytes32 _proposalId,
        address _spender
    )
        public view returns (uint256)
    {
        uint256 spent = proposals_[_proposalId].votes[_spender];

        uint256 available = lockupSource_.balanceOf(_spender);

        if (spent > available) {
            available = 0;
        } else {
            available = available - spent;
        }

        return available;
    }

    function killProposal(bytes32 _proposalId) public {
        require(
            msg.sender == emergencyCouncil_,
            "only emergency council can use this"
        );

        require(!getProposalExecuted(_proposalId), "already executed");

        proposals_[_proposalId].killed = true;
    }

    /// @notice voteFor the Vote given for the amount given, increasing
    ///         the amount for stored in the contract
    /// @dev _vote to vote for
    /// @dev _amount to use of the governance token that should be
    ///      locked up for the vote
    function voteFor(bytes32 _proposalId, uint256 _amount) public {
        require(getProposalExists(_proposalId), "proposal does not exist");
        require(getProposalVoteable(_proposalId), "proposal frozen");

        require(
          getAmountAvailable(_proposalId, msg.sender) >= _amount,
          "user trying to vote more they can"
        );

        _voteFor(msg.sender, _proposalId, _amount);
    }

    /// @notice voteAgainst the Vote given for the amount, reducing the
    ///         amount for it stored in the contract
    /// @dev _vote to provide the vote for
    function voteAgainst(bytes32 _proposalId, uint256 _amount) public {
        require(getProposalExists(_proposalId), "proposal does not exist");
        require(getProposalVoteable(_proposalId), "proposal frozen");

        require(
          getAmountAvailable(_proposalId, msg.sender) <= _amount,
          "user trying to vote more they can"
        );

        _voteAgainst(msg.sender, _proposalId, _amount);
    }

    /// @notice execute calldata at a contract target, following a Proposal
    ///         that's been proposed and ratified
    /// @dev _vote to execute once it follows the requirement
    function executeProposal(bytes32 _proposalId) public {
        require(getProposalReadyToExecute(_proposalId), "proposal can't execute");

        Proposal storage proposal = proposals_[_proposalId];

        bool rc;
        bytes memory returnData;

        // if the proposal is a delegate call, use that instead, or just make a
        // call

        if (proposal.isDelegateCall)
            (rc, returnData) = proposal.targetContract.delegatecall(
                proposal.data
            );

        else
           (rc, returnData) = proposal.targetContract.call(
                proposal.data
            );

        // return data under 68 with a failure reverted silently

        uint256 returnDataSize = returnData.length;

        // if the return success was false, and the return size is below
        // 68 (size for a revert string), then error out

        require(rc && returnDataSize >= 68, "call failed");

        if (!rc)
            // an error happened, so we revert with the revert data from before
            assembly {
                revert(returnData, returnDataSize)
            }

        // mark the contract as executed

        proposal.targetContract = address(0);
    }

    function disableEmergencyCouncil() public {
        require(msg.sender == address(this), "only dao can use this");
        emergencyCouncil_ = address(0);
    }
}
