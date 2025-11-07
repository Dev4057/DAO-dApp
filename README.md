# 🏛️ DAO Governance DApp

A decentralized autonomous organization (DAO) governance platform built on Ethereum that enables democratic decision-making through proposal creation and voting mechanisms.

![Solidity](https://img.shields.io/badge/Solidity-0.8.19-blue)
![React](https://img.shields.io/badge/React-18-blue)
![Foundry](https://img.shields.io/badge/Foundry-Latest-orange)
![License](https://img.shields.io/badge/license-MIT-green)

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Smart Contract Deployment](#-smart-contract-deployment)
- [Frontend Setup](#-frontend-setup)
- [Usage](#-usage)
- [Testing](#-testing)
- [Project Structure](#-project-structure)
- [Smart Contract Details](#-smart-contract-details)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)
- [License](#-license)

## ✨ Features

### Core Functionality
- 🗳️ **Democratic Voting System** - Members can vote for or against proposals
- 📝 **Proposal Creation** - Create proposals with descriptions, target addresses, and ETH values
- ⚡ **Proposal Execution** - Automatically execute approved proposals
- 👥 **Member Management** - Owner can add/remove DAO members
- 💰 **Treasury Management** - DAO can hold and distribute ETH
- 🎯 **Quorum Requirements** - Configurable minimum votes needed for proposals

### Advanced Features
- ⏰ **Time-based Voting Periods** - 3-day default voting duration
- 🔍 **Real-time Updates** - Live proposal status and voting counts
- 🎨 **Modern UI** - Beautiful, responsive interface with Tailwind CSS
- 🔐 **Secure** - Built with security best practices and tested extensively
- 📊 **Dashboard Analytics** - View treasury balance, member count, and proposal statistics

## 🛠️ Tech Stack

### Smart Contract
- **Solidity** ^0.8.19
- **Foundry** - Development framework
- **OpenZeppelin** - Security standards

### Frontend
- **React** 18
- **Ethers.js** v6 - Ethereum interaction
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Lucide React** - Icons

### Network
- **Ethereum** (Mainnet/Testnet)
- **Sepolia** (Recommended for testing)
- **Local Anvil** (Development)

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** or **yarn** - Comes with Node.js
- **Git** - [Download](https://git-scm.com/)
- **Foundry** - [Installation Guide](https://book.getfoundry.sh/getting-started/installation)
- **MetaMask** - [Browser Extension](https://metamask.io/)

### Install Foundry

```bash
# Install Foundry
curl -L https://foundry.paradigm.xyz | bash

# Run foundryup to install forge, cast, anvil, and chisel
foundryup
```

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/dao-dapp.git
cd dao-dapp
```

### 2. Install Smart Contract Dependencies

```bash
# Install Foundry dependencies
forge install
```

### 3. Install Frontend Dependencies

```bash
cd frontend
npm install
# or
yarn install
```

## 🔧 Smart Contract Deployment

### 1. Set Up Environment Variables

Create a `.env` file in the project root:

```bash
# Copy the example
cp .env.example .env

# Edit with your values
nano .env
```

Add the following to `.env`:

```env
# Private key (without 0x prefix)
PRIVATE_KEY=your_private_key_here

# RPC URLs
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/your_api_key
MAINNET_RPC_URL=https://eth-mainnet.g.alchemy.com/v2/your_api_key

# Etherscan API Key
ETHERSCAN_API_KEY=your_etherscan_api_key

# DAO Members
MEMBER_1=0x1234567890123456789012345678901234567890
MEMBER_2=0x2345678901234567890123456789012345678901
MEMBER_3=0x3456789012345678901234567890123456789012

# Quorum
QUORUM=2
```

**⚠️ IMPORTANT:** Never commit your `.env` file! It's already in `.gitignore`.

### 2. Fix Line Endings (if on Windows/WSL)

```bash
# Convert .env to Unix format
dos2unix .env
# or
sed -i 's/\r$//' .env

# Load environment variables
source .env
```

### 3. Compile Contracts

```bash
forge build
```

### 4. Run Tests

```bash
# Run all tests
forge test

# Run with verbosity
forge test -vv

# Run with gas reporting
forge test --gas-report

# Run specific test
forge test --match-test testCreateProposal -vvv
```

### 5. Deploy to Local Network (Anvil)

```bash
# Terminal 1: Start Anvil
anvil

# Terminal 2: Deploy
forge script script/DeployDAO.s.sol:DeployDAO \
  --rpc-url http://127.0.0.1:8545 \
  --broadcast
```

### 6. Deploy to Sepolia Testnet

```bash
forge script script/DeployDAO.s.sol:DeployDAO \
  --rpc-url $SEPOLIA_RPC_URL \
  --broadcast \
  --verify \
  -vvvv
```

**Note:** Save the deployed contract address from the output!

### 7. Verify Contract on Etherscan (if not auto-verified)

```bash
forge verify-contract <CONTRACT_ADDRESS> \
  src/DAO.sol:DAO \
  --chain-id 11155111 \
  --etherscan-api-key $ETHERSCAN_API_KEY \
  --constructor-args $(cast abi-encode "constructor(address[],uint256)" "[0xAddr1,0xAddr2,0xAddr3]" 2)
```

## 🎨 Frontend Setup

### 1. Update Contract Address

Edit `frontend/src/App.jsx` and replace the contract address:

```javascript
const DAO_ADDRESS = "0xYourDeployedContractAddress";
```

### 2. Start Development Server

```bash
cd frontend
npm run dev
# or
yarn dev
```

The app will be available at `http://localhost:5173`

### 3. Build for Production

```bash
npm run build
# or
yarn build
```

### 4. Preview Production Build

```bash
npm run preview
# or
yarn preview
```

## 📱 Usage

### Connect Wallet

1. Click "Connect Wallet" button
2. Approve MetaMask connection
3. Ensure you're on the correct network (Sepolia for testnet)

### Create a Proposal

1. Connect wallet (must be a DAO member)
2. Fill in the proposal form:
   - **Description**: What the proposal is about (max 500 characters)
   - **Target Address**: (Optional) Recipient address for ETH transfer
   - **Value**: (Optional) Amount of ETH to send
3. Click "Create Proposal"
4. Confirm transaction in MetaMask

### Vote on Proposals

1. View active proposals in the list
2. Click "Vote For" or "Vote Against"
3. Confirm transaction in MetaMask
4. You can only vote once per proposal

### Execute Proposals

1. Wait for voting period to end (3 days)
2. Ensure proposal has:
   - More votes FOR than AGAINST
   - Met the quorum requirement
3. Click "Execute Proposal"
4. Confirm transaction in MetaMask

### Fund DAO Treasury

1. Click "💰 Fund DAO Treasury" button
2. Enter amount in ETH
3. Confirm transaction in MetaMask

## 🧪 Testing

### Run Smart Contract Tests

```bash
# All tests
forge test

# With detailed output
forge test -vvv

# Specific test file
forge test --match-path test/DAO.t.sol

# With gas reporting
forge test --gas-report

# With coverage
forge coverage
```

### Test Coverage

```bash
# Generate coverage report
forge coverage

# Generate LCOV report
forge coverage --report lcov

# View HTML report (requires lcov)
genhtml lcov.info -o coverage
open coverage/index.html
```

## 📁 Project Structure

```
dao-dapp/
├── src/
│   └── DAO.sol                 # Main DAO contract
├── test/
│   └── DAO.t.sol              # Contract tests
├── script/
│   └── DeployDAO.s.sol        # Deployment script
├── frontend/
│   ├── src/
│   │   ├── App.jsx            # Main React component
│   │   ├── main.jsx           # Entry point
│   │   └── index.css          # Global styles
│   ├── public/                # Static assets
│   ├── index.html             # HTML template
│   ├── package.json           # Frontend dependencies
│   └── vite.config.js         # Vite configuration
├── lib/                       # Foundry dependencies
├── out/                       # Compiled contracts
├── .env                       # Environment variables (DO NOT COMMIT)
├── .env.example               # Example environment file
├── foundry.toml               # Foundry configuration
├── .gitignore                 # Git ignore rules
└── README.md                  # This file
```

## 🔐 Smart Contract Details

### Main Contract: `DAO.sol`

#### State Variables
- `owner` - Contract owner (can manage members)
- `members` - Mapping of member addresses
- `proposals` - Array of all proposals
- `quorum` - Minimum votes needed
- `votingDuration` - Default 3 days

#### Key Functions

**Member Functions:**
- `createProposal(string description, address target, uint256 value)` - Create new proposal
- `vote(uint256 proposalId, bool support)` - Vote on proposal
- `executeProposal(uint256 proposalId)` - Execute approved proposal

**Owner Functions:**
- `addMember(address newMember)` - Add new member
- `removeMember(address member)` - Remove member
- `updateQuorum(uint256 newQuorum)` - Change quorum
- `updateVotingDuration(uint256 newDuration)` - Change voting period

**View Functions:**
- `getProposal(uint256 proposalId)` - Get basic proposal info
- `getProposalDetails(uint256 proposalId)` - Get detailed proposal info
- `getActiveProposals()` - Get all active proposals
- `getDAOBalance()` - Get DAO treasury balance
- `getProposalCount()` - Get total proposals

### Events

```solidity
event ProposalCreated(uint256 proposalId, string description, uint256 deadline, address target, uint256 value, address proposer);
event Voted(uint256 proposalId, address voter, bool support);
event ProposalExecuted(uint256 proposalId, address executor);
event MemberAdded(address member);
event MemberRemoved(address member);
event FundsReceived(address sender, uint256 amount);
event QuorumUpdated(uint256 newQuorum);
```

## 🐛 Troubleshooting

### Common Issues

#### 1. "Command not found: forge"
```bash
# Reinstall Foundry
curl -L https://foundry.paradigm.xyz | bash
foundryup
```

#### 2. "Stack too deep" compilation error
Make sure `foundry.toml` has:
```toml
via_ir = true
optimizer = true
```

#### 3. Line ending issues with `.env`
```bash
dos2unix .env
# or
sed -i 's/\r$//' .env
```

#### 4. MetaMask connection issues
- Clear MetaMask cache
- Switch networks and switch back
- Ensure you're on the correct network
- Check if dApp is requesting correct chain ID

#### 5. Transaction fails with "Only members can call"
- Ensure your address was added as a member during deployment
- Check with owner to add your address

#### 6. Proposals not showing after creation
- Click the "🔄 Refresh" button
- Check browser console for errors
- Verify contract address in `App.jsx`

#### 7. "Insufficient funds" error
- Ensure DAO has enough ETH in treasury
- Check the proposal value doesn't exceed balance

### Get Help

- Check [Foundry Book](https://book.getfoundry.sh/)
- Read [Ethers.js docs](https://docs.ethers.org/)
- Open an issue on GitHub
- Join our Discord community

## 🌐 Deployment Checklist

### Before Mainnet Deployment

- [ ] All tests passing
- [ ] Security audit completed
- [ ] Gas optimization done
- [ ] Contract verified on Etherscan
- [ ] Frontend updated with correct contract address
- [ ] Member addresses configured correctly
- [ ] Quorum value set appropriately
- [ ] Treasury funded if needed
- [ ] Backup of all private keys and seeds
- [ ] Documentation updated

## 📊 Gas Usage

| Function | Gas Estimate |
|----------|-------------|
| Create Proposal | ~150,000 |
| Vote | ~50,000 |
| Execute Proposal | ~80,000 - 200,000 |
| Add Member | ~50,000 |

*Note: Gas estimates may vary based on network conditions and proposal complexity*

## 🔒 Security Considerations

- ✅ Tested with Foundry test suite
- ✅ ReentrancyGuard patterns used
- ✅ Access control with modifiers
- ✅ Integer overflow protection (Solidity 0.8+)
- ✅ Proper event emissions
- ⚠️ Not audited - use at your own risk
- ⚠️ Test thoroughly before mainnet deployment

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Write tests for new features
- Follow Solidity style guide
- Use meaningful commit messages
- Update documentation as needed

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [OpenZeppelin](https://openzeppelin.com/) for secure contract patterns
- [Foundry](https://getfoundry.sh/) for development framework
- [Ethers.js](https://docs.ethers.org/) for Ethereum interaction
- [Tailwind CSS](https://tailwindcss.com/) for styling

## 📞 Contact

- **GitHub**: [Dev4057](https://github.com/Dev4057)
- **Twitter**: [Dev_9007](https://twitter.com/yourhandle)
- **Discord**: devang6061
- **Email**: your.email@example.com

## 🗺️ Roadmap

- [ ] Add delegation feature
- [ ] Implement proposal categories
- [ ] Add time-lock mechanism
- [ ] Multi-signature support
- [ ] Proposal amendments
- [ ] Vote weight based on token holdings
- [ ] Integration with ENS
- [ ] Mobile app development

---

**Built with ❤️ by the Devang**

*Made in 2025*