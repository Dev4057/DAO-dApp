// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Script.sol";
import "../src/DAO.sol";

contract DeployDAO is Script {
    function run() external returns (DAO) {
        // Read environment variables
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        
        // Read member addresses from environment
        address member1 = vm.envAddress("MEMBER_1");
        address member2 = vm.envAddress("MEMBER_2");
        address member3 = vm.envAddress("MEMBER_3");
        
        // Read quorum from environment (with fallback to 2)
        uint256 quorum = vm.envOr("QUORUM", uint256(2));

        // Start broadcasting transactions
        vm.startBroadcast(deployerPrivateKey);

        // Define initial members
        address[] memory initialMembers = new address[](3);
        initialMembers[0] = member1;
        initialMembers[1] = member2;
        initialMembers[2] = member3;

        // Deploy the DAO contract
        DAO dao = new DAO(initialMembers, quorum);

        // Optionally fund the DAO with initial ETH
        // (bool success, ) = address(dao).call{value: 1 ether}("");
        // require(success, "Failed to fund DAO");

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
        console.log("  Member 1:", member1);
        console.log("  Member 2:", member2);
        console.log("  Member 3:", member3);
        console.log("========================================");

        return dao;
    }
}

// Separate script for verifying the contract on Etherscan
contract VerifyDAO is Script {
    function run() external {
        // Get the deployed DAO address
        address daoAddress = vm.envAddress("DAO_ADDRESS");
        
        console.log("Verifying DAO at:", daoAddress);
        console.log("Run this command:");
        console.log("forge verify-contract", daoAddress, "src/DAO.sol:DAO --chain-id <CHAIN_ID> --etherscan-api-key $ETHERSCAN_API_KEY");
    }
}