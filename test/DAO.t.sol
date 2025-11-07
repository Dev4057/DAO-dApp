// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Test.sol";
import "../src/DAO.sol";

contract DAOTest is Test {
    DAO public dao;

    address member1;
    address member2;
    address member3;
    address payable target;
    address[] public members;
    uint256 proposalId;

    function setUp() public {
        member1 = address(0x111);
        member2 = address(0x222);
        member3 = address(0x333);
        target = payable(address(0x444));

        members.push(member1);
        members.push(member2);
        members.push(member3);

        dao = new DAO(members, 2);

        vm.deal(address(this), 10 ether);
        (bool sent, ) = address(dao).call{value: 5 ether}("");
        require(sent, "funding failed");
    }

    function testCreateProposal() public {
        vm.prank(member1);
        dao.createProposal("Fund target", target, 1 ether);

        // Get basic proposal info
        (string memory desc, uint256 votesFor, uint256 votesAgainst, bool executed, uint256 deadline)
            = dao.getProposal(0);

        // Get proposal details
        (address _target, uint256 value, , , ) 
            = dao.getProposalDetails(0);

        assertEq(desc, "Fund target");
        assertEq(votesFor, 0);
        assertEq(votesAgainst, 0);
        assertEq(executed, false);
        assertEq(_target, target);
        assertEq(value, 1 ether);
        assertGt(deadline, block.timestamp);
    }

    function testVoteAndExecuteProposal() public {
        vm.prank(member1);
        dao.createProposal("Send funds", target, 1 ether);

        vm.prank(member1);
        dao.vote(0, true);

        vm.prank(member2);
        dao.vote(0, true);

        vm.warp(block.timestamp + 4 days);

        uint256 targetBalanceBefore = target.balance;

        vm.prank(member1);
        dao.executeProposal(0);

        uint256 targetBalanceAfter = target.balance;
        assertEq(targetBalanceAfter, targetBalanceBefore + 1 ether);
    }

    function testCannotExecuteBeforeDeadline() public {
        vm.prank(member1);
        dao.createProposal("Too early", target, 0.5 ether);

        vm.prank(member1);
        dao.vote(0, true);

        vm.expectRevert("Voting still active");
        vm.prank(member1);
        dao.executeProposal(0);
    }

    function testAddAndRemoveMember() public {
        address newMember = address(0x999);
        
        vm.prank(dao.owner());
        dao.addMember(newMember);
        assertTrue(dao.members(newMember));

        vm.prank(dao.owner());
        dao.removeMember(newMember);
        assertFalse(dao.members(newMember));
    }

    function testQuorumNotMet() public {
        vm.prank(member1);
        dao.createProposal("Quorum test", target, 1 ether);

        vm.prank(member1);
        dao.vote(0, true);

        vm.warp(block.timestamp + 4 days);

        vm.expectRevert("Quorum not met");
        vm.prank(member1);
        dao.executeProposal(0);
    }

    function testCannotVoteTwice() public {
        vm.prank(member1);
        dao.createProposal("Double vote test", target, 0 ether);

        vm.prank(member1);
        dao.vote(0, true);

        vm.expectRevert("Already voted");
        vm.prank(member1);
        dao.vote(0, true);
    }

    function testNonMemberCannotVote() public {
        vm.prank(member1);
        dao.createProposal("Member only", target, 0 ether);

        address nonMember = address(0x555);
        vm.expectRevert("Only members can call");
        vm.prank(nonMember);
        dao.vote(0, true);
    }

    function testProposalMustPassToExecute() public {
        vm.prank(member1);
        dao.createProposal("Fail test", target, 0 ether);

        vm.prank(member1);
        dao.vote(0, false);

        vm.prank(member2);
        dao.vote(0, false);

        vm.warp(block.timestamp + 4 days);

        vm.expectRevert("Not enough support");
        vm.prank(member1);
        dao.executeProposal(0);
    }

    function testGetActiveProposals() public {
        vm.prank(member1);
        dao.createProposal("Active 1", target, 0 ether);

        vm.prank(member2);
        dao.createProposal("Active 2", target, 0 ether);

        uint256[] memory active = dao.getActiveProposals();
        assertEq(active.length, 2);
        assertEq(active[0], 0);
        assertEq(active[1], 1);
    }

    function testDAOBalance() public {
        uint256 balance = dao.getDAOBalance();
        assertEq(balance, 5 ether);
    }
}