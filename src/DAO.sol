// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract DAO {
    struct Proposal {
        string description;
        uint256 votesFor;
        uint256 votesAgainst;
        bool executed;
        uint256 deadline;
        address payable target;
        uint256 value;
        address proposer;
        uint256 createdAt;
    }

    address public owner;
    mapping(address => bool) public members;
    mapping(uint256 => mapping(address => bool)) public voted;
    Proposal[] public proposals;
    uint256 public quorum;
    uint256 public memberCount;
    
    uint256 public votingDuration = 3 days;

    event ProposalCreated(uint256 proposalId, string description, uint256 deadline, address target, uint256 value, address proposer);
    event Voted(uint256 proposalId, address voter, bool support);
    event ProposalExecuted(uint256 proposalId, address executor);
    event MemberAdded(address member);
    event MemberRemoved(address member);
    event FundsReceived(address sender, uint256 amount);
    event QuorumUpdated(uint256 newQuorum);

    modifier onlyMember() {
        require(members[msg.sender], "Only members can call");
        _;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call");
        _;
    }

    constructor(address[] memory initialMembers, uint256 _quorum) {
        require(initialMembers.length > 0, "Must have members");
        require(_quorum > 0 && _quorum <= initialMembers.length, "Invalid quorum");

        owner = msg.sender;
        quorum = _quorum;
        memberCount = initialMembers.length;
        
        for (uint256 i = 0; i < initialMembers.length; i++) {
            require(initialMembers[i] != address(0), "Invalid member address");
            require(!members[initialMembers[i]], "Duplicate member");
            members[initialMembers[i]] = true;
        }
    }

    receive() external payable {
        emit FundsReceived(msg.sender, msg.value);
    }

    function createProposal(
        string memory description,
        address payable target,
        uint256 value
    ) external onlyMember returns (uint256) {
        require(bytes(description).length > 0, "Description required");
        require(bytes(description).length <= 500, "Description too long");
        
        uint256 deadline = block.timestamp + votingDuration;

        proposals.push(Proposal({
            description: description,
            votesFor: 0,
            votesAgainst: 0,
            executed: false,
            deadline: deadline,
            target: target,
            value: value,
            proposer: msg.sender,
            createdAt: block.timestamp
        }));

        uint256 proposalId = proposals.length - 1;
        emit ProposalCreated(proposalId, description, deadline, target, value, msg.sender);
        return proposalId;
    }

    function vote(uint256 proposalId, bool support) external onlyMember {
        require(proposalId < proposals.length, "Invalid proposal");
        Proposal storage p = proposals[proposalId];

        require(block.timestamp < p.deadline, "Voting period ended");
        require(!voted[proposalId][msg.sender], "Already voted");
        require(!p.executed, "Proposal already executed");

        voted[proposalId][msg.sender] = true;
        if (support) {
            p.votesFor++;
        } else {
            p.votesAgainst++;
        }

        emit Voted(proposalId, msg.sender, support);
    }

    function executeProposal(uint256 proposalId) external onlyMember {
        Proposal storage p = proposals[proposalId];

        require(!p.executed, "Already executed");
        require(block.timestamp >= p.deadline, "Voting still active");
        require(p.votesFor + p.votesAgainst >= quorum, "Quorum not met");
        require(p.votesFor > p.votesAgainst, "Not enough support");

        p.executed = true;

        if (p.value > 0 && p.target != address(0)) {
            require(address(this).balance >= p.value, "Insufficient DAO funds");
            (bool success, ) = p.target.call{value: p.value}("");
            require(success, "ETH transfer failed");
        }

        emit ProposalExecuted(proposalId, msg.sender);
    }

    function addMember(address newMember) external onlyOwner {
        require(newMember != address(0), "Invalid address");
        require(!members[newMember], "Already a member");
        
        members[newMember] = true;
        memberCount++;
        emit MemberAdded(newMember);
    }

    function removeMember(address memberToRemove) external onlyOwner {
        require(members[memberToRemove], "Not a member");
        require(memberCount > quorum, "Cannot remove: would break quorum");
        
        members[memberToRemove] = false;
        memberCount--;
        emit MemberRemoved(memberToRemove);
    }

    function updateQuorum(uint256 newQuorum) external onlyOwner {
        require(newQuorum > 0 && newQuorum <= memberCount, "Invalid quorum");
        quorum = newQuorum;
        emit QuorumUpdated(newQuorum);
    }

    function updateVotingDuration(uint256 newDuration) external onlyOwner {
        require(newDuration >= 1 hours && newDuration <= 30 days, "Invalid duration");
        votingDuration = newDuration;
    }

    function getProposalCount() external view returns (uint256) {
        return proposals.length;
    }

    // Split into two functions to avoid stack too deep error
    function getProposal(uint256 proposalId) external view returns (
        string memory description,
        uint256 votesFor,
        uint256 votesAgainst,
        bool executed,
        uint256 deadline
    ) {
        require(proposalId < proposals.length, "Invalid proposal");
        Proposal memory p = proposals[proposalId];
        
        return (
            p.description,
            p.votesFor,
            p.votesAgainst,
            p.executed,
            p.deadline
        );
    }

    function getProposalDetails(uint256 proposalId) external view returns (
        address target,
        uint256 value,
        address proposer,
        uint256 createdAt,
        bool hasVoted
    ) {
        require(proposalId < proposals.length, "Invalid proposal");
        Proposal memory p = proposals[proposalId];
        
        return (
            p.target,
            p.value,
            p.proposer,
            p.createdAt,
            voted[proposalId][msg.sender]
        );
    }

    function getActiveProposals() external view returns (uint256[] memory) {
        uint256 activeCount = 0;
        
        for (uint256 i = 0; i < proposals.length; i++) {
            if (!proposals[i].executed && block.timestamp < proposals[i].deadline) {
                activeCount++;
            }
        }
        
        uint256[] memory activeProposals = new uint256[](activeCount);
        uint256 index = 0;
        
        for (uint256 i = 0; i < proposals.length; i++) {
            if (!proposals[i].executed && block.timestamp < proposals[i].deadline) {
                activeProposals[index] = i;
                index++;
            }
        }
        
        return activeProposals;
    }

    function getDAOBalance() external view returns (uint256) {
        return address(this).balance;
    }
}