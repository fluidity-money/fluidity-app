pragma solidity ^0.8.11;
pragma abicoder v2;

import "./VEGovToken.sol";

type VoteIdentifier is uint256;

/// @dev default time to wait before a vote is possibly ratified after it's submission
uint256 constant DEFAULT_VOTE_BLOCK_TIME = 10 days;

/// @dev default vote timelock once a vote has been ratified
uint256 constant DEFAULT_VOTE_TIMELOCK = 24 hours;

struct Proposal {
    boolean executed;
    address targetContract;
    uint256 creationTimestamp;
    uint256 votesFor;
    uint256 votesAgainst;
    bytes data;
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
    	return proposal.creationTimestamp != 0;
    }

    function _transferFrom(address _sender, uint256 _amount) internal {
    	if (_amount == 0) return;

    	bool rc = governanceToken_.transferFrom(msg.sender, this, _amount);

    	if (!rc) revert("transferFrom returned false");

    	realBalances_[msp.sender] += governanceToken_.convertToRealBalance(_forAmount);
    }

    function _voteFor(address _sender, bytes20 _ipfsHash, uint256 _amount) internal {
    	_transferFrom(_sender, _amount);
    	votes_[_ipfsHash].votesFor += _amount;
    	emit VotedFor(_ipfsHash, _sender, _amount);
    }

    function _voteAgainst(address _sender, bytes20 _ipfsHash, uint256 _amount) internal {
    	_transferFrom(_sender, _amount);
    	votes_[_ipfsHash].votesAgainst += _amount;
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

    	require(!proposalExists(_ipfsHash), "vote already exists");

    	proposal.creationTimestamp = block.timestamp;
    	proposal.targetContract = _target;
    	proposal.data = _calldata;

    	_voteFor(msg.sender, _ipfsHash, _forAmount);
    	_voteAgainst(msg.sender, _ipfsHash, _againstAmount);
    }

    /// @notice voteFor the Vote given for the amount given, increasing
    ///         the amount for stored in the contract
    /// @dev _vote to vote for
    /// @dev _amount to use of the governance token that should be
    ///      locked up for the vote
    function voteFor(bytes20 _hash, uint256 _amount) public {
    	require(proposalExists(_ipfsHash), "vote does not exist");
    	_voteFor(msg.sender, _ipfsHash, _amount);
    }

    /// @notice voteAgainst the Vote given for the amount, reducing the
    ///         amount for it stored in the contract
    /// @dev _vote to provide the vote for
    function voteAgainst(bytes20 _hash, uint256 _amount) public {
    	require(proposalExists(_hash), "vote does not exist");
    	_voteAgainst(msg.sender, _ipfsHash, _amount);
    }

    /// @notice getProposal for the ipfs hash given, returning
    ///         information about it
    /// @dev _hash to get proposal information on
    function getVoteInfo(bytes20 _hash) public view returns (Proposal memory) {
    	return votes_[_hash];
    }

    /// @notice execute calldata at a contract target, following a Vote
    ///         that's been proposed and ratified
    /// @dev _vote to execute once it follows the requirement
    function executeVote(Vote _vote) public;

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
