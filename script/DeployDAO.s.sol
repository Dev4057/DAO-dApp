// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Script.sol";
import "../src/DAO.sol";

contract DeployDAO is Script {
    function run() external returns (DAO) {
        // Read environment variables
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        
        // Read member addresses from environment (support up to 10 members)
        address member1 = vm.envOr("MEMBER_1", address(0));
        address member2 = vm.envOr("MEMBER_2", address(0));
        address member3 = vm.envOr("MEMBER_3", address(0));
        address member4 = vm.envOr("MEMBER_4", address(0));
        address member5 = vm.envOr("MEMBER_5", address(0));
        address member6 = vm.envOr("MEMBER_6", address(0));
        address member7 = vm.envOr("MEMBER_7", address(0));
        address member8 = vm.envOr("MEMBER_8", address(0));
        address member9 = vm.envOr("MEMBER_9", address(0));
        address member10 = vm.envOr("MEMBER_10", address(0));
        
        // Count non-zero members
        uint256 memberCount = 0;
        address[10] memory tempMembers = [member1, member2, member3, member4, member5, member6, member7, member8, member9, member10];
        
        for (uint256 i = 0; i < 10; i++) {
            if (tempMembers[i] != address(0)) {
                memberCount++;
            }
        }
        
        require(memberCount > 0, "At least one member required");
        
        // Create dynamic array with actual member count
        address[] memory initialMembers = new address[](memberCount);
        uint256 index = 0;
        
        for (uint256 i = 0; i < 10; i++) {
            if (tempMembers[i] != address(0)) {
                initialMembers[index] = tempMembers[i];
                index++;
            }
        }
        
        // Read quorum from environment (default to 50% of members, minimum 1)
        uint256 defaultQuorum = (memberCount + 1) / 2; // Ceiling division
        uint256 quorum = vm.envOr("QUORUM", defaultQuorum);
        
        require(quorum > 0 && quorum <= memberCount, "Invalid quorum");

        // Start broadcasting transactions
        vm.startBroadcast(deployerPrivateKey);

        // Deploy the DAO contract
        DAO dao = new DAO(initialMembers, quorum);

        vm.stopBroadcast();

        // Log deployment details
        console.log("========================================");
        console.log("DAO Deployment Successful!");
        console.log("========================================");
        console.log("DAO Address:", address(dao));
        console.log("Owner:", dao.owner());
        console.log("Quorum:", dao.quorum());
        console.log("Member Count:", dao.memberCount());
        console.log("Voting Duration:", dao.votingDuration() / 1 days, "days");
        console.log("========================================");
        console.log("Initial Members:");
        for (uint256 i = 0; i < initialMembers.length; i++) {
            console.log("  Member", i + 1, ":", initialMembers[i]);
        }
        console.log("========================================");
        console.log("");
        console.log("IMPORTANT: Update your frontend with this address:");
        console.log("const DAO_ADDRESS = \"", vm.toString(address(dao)), "\";");
        console.log("========================================");

        return dao;
    }
}