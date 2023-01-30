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
	address voter;
	uint256 amount;
}

struct Proposal {
    address targetContract;
    uint256 ratificationTimestamp;
    uint256 votesFor;
    uint256 votesAgainst;
    bytes data;
    []Vote votes;
}

contact DAO {
	uint8 version_;

	VEGovToken governanceToken_;

	address emergencyCouncil_;

	event VoteCreated(bytes20 indexed ipfsHash);

	event VoteExecuted(bytes20 indexed ipfsHash);

	event VotedFor(bytes20 indexed ipfsHash, address sender, uint256 amount);

	event VotedAgainst(bytes20 indexed ipfsHash, address sender, uint256 amount);

	mapping(bytes20 => Proposal) votes_;

	mapping(address => uint256) realBalances_;

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

    function proposalExists(bytes20 _ipfsHash) public view returns (bool) {
    	return proposal.ratificationTimestamp != 0;
    }

    function _transferFrom(address _sender, uint256 _amount) internal {
    	bool rc = governanceToken_.transferFrom(msg.sender, this, _amount);

    	if (!rc) revert("transferFrom returned false");

    	realBalances_[msp.sender] += governanceToken_.convertToRealBalance(_forAmount);
    }

    function recordVoter(bytes20 _hash, address _voter, uint256 _amount) internal {
    	Vote vote;

    	vote.voter = _voter;
    	vote.amount = _amount;

    	votes_[_hash].votes.push(vote);
    }

    function _voteFor(address _sender, bytes20 _ipfsHash, uint256 _amount) internal {
    	_transferFrom(_sender, _amount);
    	votes_[_ipfsHash].votesFor += _amount;
    	recordVoter(_ipfsHash, _sender, _amount);
    	emit VotedFor(_ipfsHash, _sender, _amount);
    }

    function _voteAgainst(address _sender, bytes20 _ipfsHash, uint256 _amount) internal {
    	_transferFrom(_sender, _amount);
    	votes_[_ipfsHash].votesAgainst += _amount;
    	recordVoter(_ipfsHash, _sender, _amount);
    	emit VotedAgainst(_ipfsHash, _sender, _amount);
    }

    /// @notice createProposal for the epoch of 100 blocks,
    /// @dev _target contract address to execute the calldata on
    /// @dev _calldata to execute once the period has passed and the
    ///      vote has succeeded
    function createProposal(
        bytes20 _ipfsHash,
        address _target,
        uint256 _forAmount,
        uint256 _againstAmount,
        bytes calldata _calldata,
    )
        public
    {
    	Proposal proposal = votes_[_ipfsHash];

    	require(!proposalExists(_ipfsHash), "proposal already exists");

		proposal.status = ProposalStatus.UNFINISHED;

    	proposal.ratificationTimestamp = block.timestamp + DEFAULT_VOTE_BLOCK_TIME;
    	proposal.targetContract = _target;
    	proposal.data = _calldata;

    	if (_forAmount > 0)
    		_voteFor(msg.sender, _ipfsHash, _forAmount);

    	if (_againstAmount > 0)
    		_voteAgainst(msg.sender, _ipfsHash, _againstAmount);
    }

    function proposalExecutionTs(bytes20 _ipfsHash) public view returns (uint256) {
    	return votes_[_ipfsHash].executionTimestamp;
    }

    function proposalFrozen(bytes20 _ipfsHash) public view returns (bool) {
    	uint256 ts = votes_[_ipfsHash].executionTimestamp;
    	return ts > block.timestamp;
    }

    function proposalPassed(bytes20 _ipfsHash) public view returns (bool) {
    	uint256 ts = proposalExecutionTs(_ipfsHash);
    	return ts > block.timestamp + DEFAULT_FROZEN_TIME;
    }

    function proposalPassing(bytes20 _ipfsHash) public view returns (bool) {
		return votes_[_ipfsHash].votesFor > votes_[_ipfsHash].votesAgainst;
    }

    /// @notice proposalExecuted test, checking if the contract address
    ///         is 0, if it is assume the proposal executed
    function proposalExecuted(bytes20 _ipfsHash) public view returns (bool) {
    	return votes_[_ipfshash].targetContract == address(0);
    }

    function proposalStatus(bytes20 _ipfsHash) public view returns (ProposalStatus) {
		// if the proposal has passed but is frozen (needs 24hours)
		bool proposalProzen = proposalFrozen(_ipfsHash);

		// if the proposal has passed and has passed the freeze period
		bool proposalPassed = proposalFrozen(_ipfsHash);

		bool voteOver = proposalPassing(_ipfsHash);

		if (proposalExecuted(_ipfsHash)) return ProposalStatus.EXECUTED;

		if (voteOver && proposalFrozen) return ProposalStatus.FROZEN;

		if (voteOver && proposalPassed) return proposalStatus.SUCCEEDED;

		// since the proposal hasn't passed, and it's over, assume it failed

		if (voteOver) return ProposalStatus.FAILED;

		return ProposalStatus.UNFINISHED;
    }

    function proposalVoteable(bytes20 _ipfsHash) public view returns (bool) {
    	return !proposalFrozen(_ipfsHash);
    }

    /// @notice voteFor the Vote given for the amount given, increasing
    ///         the amount for stored in the contract
    /// @dev _vote to vote for
    /// @dev _amount to use of the governance token that should be
    ///      locked up for the vote
    function voteFor(bytes20 _hash, uint256 _amount) public {
    	require(proposalExists(_ipfsHash), "proposal does not exist");
    	require(proposalVoteable(_ipfsHash), "proposal frozen");

    	_voteFor(msg.sender, _ipfsHash, _amount);
    }

    /// @notice voteAgainst the Vote given for the amount, reducing the
    ///         amount for it stored in the contract
    /// @dev _vote to provide the vote for
    function voteAgainst(bytes20 _hash, uint256 _amount) public {
    	require(proposalExists(_hash), "proposal does not exist");
    	require(proposalVoteable(_ipfsHash), "proposal frozen");

    	_voteAgainst(msg.sender, _ipfsHash, _amount);
    }

    /// @notice getProposal for the ipfs hash given, returning
    ///         information about it
    /// @dev _hash to get proposal information on
    function getVoteInfo(bytes20 _hash) public view returns (Proposal memory) {
    	return votes_[_hash];
    }

    function noReentrancy() internal view returns (bool) {
    	bool status;

    	assembly {
    		sload(
    			0xd311b4828f49df8265725f4e29310cb16d4290d46c4f51cdb6f0042cedbbeafa
    		)

    		stauts
    	}

    	return status;
    }

    function setReentrancyLock(bool _enabled) internal {
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
    function executeProposal(bytes20 _hash) public {
    	require(noReentrancy(), "reentrant");

    	setReentrancyLock(true);

    	setReentrancyLock(false);
    }

    /*
     * update the implementations of the contracts (only callable by this contract itself)
     */

    function upgradeToken(address _oldImplementation, address _newImplementation) external;
    function upgradeOperator(address _oldImplementation, address _newImplementation) external;
    function upgradeRegistry(address _oldImplementation, address _newImplementation) external;
    function upgradeDAO(address _oldImplementation, address _newImplementation) external;

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
        external returns (address);

    /// @notice disableToken at the address given
    /// @dev _tokenAddress to shut down
    function disableToken(address _tokenAddress) external;
}
