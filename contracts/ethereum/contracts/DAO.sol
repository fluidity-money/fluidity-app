pragma solidity ^0.8.11;
pragma abicoder v2;

import "./VEGovToken.sol";

type VoteIdentifier is uint256;

/// @dev default time to wait before a vote is possibly ratified after it's submission
uint256 constant DEFAULT_VOTE_BLOCK_TIME = 10 days;

/// @dev default vote timelock once a vote has been ratified
uint256 constant DEFAULT_FROZEN_TIME = 24 hours;

enum ProposalStatus {
    UNFINISHED,
    FROZEN,
    SUCCEEDED,
    EXECUTED,
    FAILED
}

struct Vote {
    address spender;
    uint256 amount;
}

struct Proposal {
    address targetContract;
    uint256 ratificationTs;
    uint256 votesFor;
    uint256 votesAgainst;
    bytes data;
    Vote[] votes;
}

contract DAO {

    event VoteCreated(bytes20 indexed ipfsHash);

    event VoteExecuted(bytes20 indexed ipfsHash);

    event VotedFor(bytes20 indexed ipfsHash, address sender, uint256 amount);

    event VotedAgainst(bytes20 indexed ipfsHash, address sender, uint256 amount);

    uint8 version_;

    VEGovToken governanceToken_;

    address emergencyCouncil_;

    address registry_;

    mapping(bytes20 => Proposal) proposals_;

    mapping(address => uint256) credits_;

    /// @notice init the contract with the operator, creating an empty
    ///         set of ballots
    /// @dev _council to use
    function init(
        address _emergencyCouncil,
        VEGovToken _governanceToken
    )
        public
    {
        require(version_ == 0, "contract is already initialised");
        version_ = 1;
        emergencyCouncil_ = _emergencyCouncil;
        governanceToken_ = _governanceToken;
    }

    function getRatificationTs(bytes20 _ipfsHash) public view returns (uint256) {
        return proposals_[_ipfsHash].ratificationTs;
    }

    function getProposalExists(bytes20 _ipfsHash) public view returns (bool) {
        return getRatificationTs(_ipfsHash) == 0;
    }

    function _transferFrom(address _sender, uint256 _amount) internal {
        bool rc = governanceToken_.transferFrom(msg.sender, address(this), _amount);

        require(rc, "transferFrom returned false");
    }

    function recordVoter(bytes20 _hash, address _spender, uint256 _amount) internal {
        Vote memory vote;

        vote.spender = _spender;
        vote.amount = _amount;

        proposals_[_hash].votes.push(vote);
    }

    function _voteFor(address _sender, bytes20 _ipfsHash, uint256 _amount) internal {
        _transferFrom(_sender, _amount);
        proposals_[_ipfsHash].votesFor += _amount;
        recordVoter(_ipfsHash, _sender, _amount);
        emit VotedFor(_ipfsHash, _sender, _amount);
    }

    function _voteAgainst(address _sender, bytes20 _ipfsHash, uint256 _amount) internal {
        _transferFrom(_sender, _amount);
        proposals_[_ipfsHash].votesAgainst += _amount;
        recordVoter(_ipfsHash, _sender, _amount);
        emit VotedAgainst(_ipfsHash, _sender, _amount);
    }

    /// @notice createProposal for the epoch of 100 blocks,
    /// @dev _target contract address to execute the calldata on
    /// @dev _calldata to execute once the period has passed and the
    ///      vote has succeeded
    ///
    /// the null address is used more than once to check for prior
    /// execution, and should not be used to create a contract
    function createProposal(
        bytes20 _ipfsHash,
        address _target,
        uint256 _forAmount,
        uint256 _againstAmount,
        bytes calldata _calldata
    )
        public
    {
        require(_target != address(0), "null address");

        Proposal memory proposal = proposals_[_ipfsHash];

        require(!getProposalExists(_ipfsHash), "proposal already exists");

        proposal.ratificationTs = block.timestamp + DEFAULT_VOTE_BLOCK_TIME;
        proposal.targetContract = _target;
        proposal.data = _calldata;

        if (_forAmount > 0)
            _voteFor(msg.sender, _ipfsHash, _forAmount);

        if (_againstAmount > 0)
            _voteAgainst(msg.sender, _ipfsHash, _againstAmount);
    }

    function getProposalVotingOver(bytes20 _ipfsHash) public view returns (bool) {
        return getRatificationTs(_ipfsHash) > block.timestamp;
    }

    function getProposalVoteable(bytes20 _ipfsHash) public view returns (bool) {
        return !getProposalVotingOver(_ipfsHash);
    }

    function getProposalFrozenPeriodOver(bytes20 _ipfsHash) public view returns (bool) {
        uint256 ts = getRatificationTs(_ipfsHash);
        return ts > block.timestamp + DEFAULT_FROZEN_TIME;
    }

    function getProposalExecuted(bytes20 _ipfsHash) public view returns (bool) {
        return proposals_[_ipfsHash].targetContract == address(0);
    }

    /// @notice getProposalPassing check if the proposal has enough votes
    ///         to pass
    function getProposalPassing(bytes20 _ipfsHash) public view returns (bool) {
        return proposals_[_ipfsHash].votesFor > proposals_[_ipfsHash].votesAgainst;
    }

    function getProposalStatus(bytes20 _ipfsHash) public view returns (ProposalStatus) {
        // is the period of voting over?
        bool proposalVotingOver = getProposalVotingOver(_ipfsHash);

        // is the period where the proposal is frozen over?
        bool proposalFrozenPeriodOver = getProposalFrozenPeriodOver(_ipfsHash);

        // is the proposal passing?
        bool proposalPassing = getProposalPassing(_ipfsHash);

        // has the proposal already been executed?
        bool proposalExecuted = getProposalExecuted(_ipfsHash);

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

    function getProposalReadyToExecute(bytes20 _ipfsHash) public view returns (bool) {
        return getProposalStatus(_ipfsHash) == ProposalStatus.SUCCEEDED;
    }

    function getProposalFailed(bytes20 _ipfsHash) public view returns (bool) {
        return getProposalStatus(_ipfsHash) == ProposalStatus.FAILED;
    }

    /// @param _ipfsHash proposal to move each balance to credit for
    function proposalRestoreCredits(bytes20 _ipfsHash) internal {
        Proposal storage proposal = proposals_[_ipfsHash];

        for (uint256 i = 0; i < proposal.votes.length; i++) {
            Vote storage vote = proposal.votes[i];
            credits_[vote.spender] += vote.amount;
        }
    }

    /// @notice voteFor the Vote given for the amount given, increasing
    ///         the amount for stored in the contract
    /// @dev _vote to vote for
    /// @dev _amount to use of the governance token that should be
    ///      locked up for the vote
    function voteFor(bytes20 _ipfsHash, uint256 _amount) public {
        require(getProposalExists(_ipfsHash), "proposal does not exist");
        require(getProposalVoteable(_ipfsHash), "proposal frozen");

        _voteFor(msg.sender, _ipfsHash, _amount);
    }

    /// @notice voteAgainst the Vote given for the amount, reducing the
    ///         amount for it stored in the contract
    /// @dev _vote to provide the vote for
    function voteAgainst(bytes20 _ipfsHash, uint256 _amount) public {
        require(getProposalExists(_ipfsHash), "proposal does not exist");
        require(getProposalVoteable(_ipfsHash), "proposal frozen");

        _voteAgainst(msg.sender, _ipfsHash, _amount);
    }

    /// @notice getProposal for the ipfs hash given, returning
    ///         information about it
    /// @dev _hash to get proposal information on
    function getVoteInfo(bytes20 _hash) public view returns (Proposal memory) {
        return proposals_[_hash];
    }

    function noReentrancy() internal view returns (bool) {
        bool status;

        assembly {
            status := sload(
                0xd311b4828f49df8265725f4e29310cb16d4290d46c4f51cdb6f0042cedbbeafa
            )
        }

        return status;
    }

    function setReentrancyGuard(bool _enabled) internal {
        assembly {
            sstore(
                // keccak(fluidity.dao.lock) - 1
                0xd311b4828f49df8265725f4e29310cb16d4290d46c4f51cdb6f0042cedbbeafa,
                _enabled
            )
        }
    }

    /// @notice execute calldata at a contract target, following a Proposal
    ///         that's been proposed and ratified
    /// @dev _vote to execute once it follows the requirement
    function executeProposal(bytes20 _ipfsHash) public {
        require(noReentrancy(), "reentrant");
        require(getProposalReadyToExecute(_ipfsHash), "proposal can't execute");

        Proposal memory proposal = proposals_[_ipfsHash];

        setReentrancyGuard(true);

        (bool rc, bytes memory returnData) = proposal.targetContract.call(proposal.data);

        // return data under 68 with a failure reverted silently

        uint256 returnDataSize = returnData.length;

        // if the return success was false, and the return size is below
        // 68 (size for a revert statement), then error out

        require(rc && returnSize >= 68, "call failed");

        if (!rc) {
            // an error happened, so we revert with the revert data from before
            assembly {
                revert(returnData, returnDataSize)
            }
        }

        setReentrancyGuard(false);

        // assume this updates everyone's balances, so we don't update
        // the votes recorded to 0

        proposalRestoreCredits(_ipfsHash);

        // mark the contract as executed

        proposal.targetContract = address(0);
    }

    /// @notice restoreFailedProposalCredits if the proposal has failed
    ///         but is still marked as executable
    function restoreFailedProposalCredits(bytes20 _ipfsHash) public {
        require(getProposalFailed(_ipfsHash), "proposal didn't fail");
        require(getProposalReadyToExecute(_ipfsHash), "proposal can't execute");

        proposalRestoreCredits(_ipfsHash);

        proposals_[_ipfsHash].targetContract = address(0);
    }

    function redeemCredits(address _spender) public returns (bool) {
        bool rc = governanceToken_.transfer(_spender, credits_[_spender]);

        require(rc, "failed to transfer credits back");

        credits_[_spender] = 0;
    }

    function createCredits(address _spender, uint256 _amount) public {
        bool rc = _transferFrom(_spender, _amount);

         require(rc, "failed to transfer from");

         credits_[_spender] += _amount;
    }

    /*
     * update the implementations of the contracts (only callable by this contract itself)
     */

    function upgradeToken(address _oldImplementation, address _newImplementation) public {
    }

    function upgradeOperator(address _oldImplementation, address _newImplementation) public {
    }

    function upgradeDAO(address _oldImplementation, address _newImplementation) public {
    }

    /// @notice deployNewToken and register it with the Registry and Operator
    /// @dev _fluidTokenName to track in our deployment (should be f + tokenName - ie fUSDT)
    /// @dev _underlyingTokenName to use (should be tokenName - ie USDT)
    /// @dev
    function deployNewToken(
        string memory _fluidTokenName,
        string memory _underlyingTokenName,
        uint8 _underlyingDecimals,
        string memory _symbol,
        address _underlyingToken
    )
        external returns (address)
    {
        return address(0);
    }

    /// @notice disableToken at the address given
    /// @dev _tokenAddress to shut down
    function disableToken(address _tokenAddress) public {
    }
}
