import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { Wallet, Vote, CheckCircle, XCircle, Clock, Users, DollarSign, FileText, Shield, Zap, Globe, ArrowRight, TrendingUp } from 'lucide-react';

// ⚠️ REPLACE WITH YOUR DEPLOYED CONTRACT ADDRESS
const DAO_ADDRESS = "0x887F3d45B90E7b2dd2f87a09D6E276d0c9838904";

// DAO ABI (copy from your compiled contract)
const DAO_ABI = [{"type":"constructor","inputs":[{"name":"initialMembers","type":"address[]","internalType":"address[]"},{"name":"_quorum","type":"uint256","internalType":"uint256"}],"stateMutability":"nonpayable"},{"type":"receive","stateMutability":"payable"},{"type":"function","name":"addMember","inputs":[{"name":"newMember","type":"address","internalType":"address"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"createProposal","inputs":[{"name":"description","type":"string","internalType":"string"},{"name":"target","type":"address","internalType":"address payable"},{"name":"value","type":"uint256","internalType":"uint256"}],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"nonpayable"},{"type":"function","name":"executeProposal","inputs":[{"name":"proposalId","type":"uint256","internalType":"uint256"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"getActiveProposals","inputs":[],"outputs":[{"name":"","type":"uint256[]","internalType":"uint256[]"}],"stateMutability":"view"},{"type":"function","name":"getDAOBalance","inputs":[],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},{"type":"function","name":"getProposal","inputs":[{"name":"proposalId","type":"uint256","internalType":"uint256"}],"outputs":[{"name":"description","type":"string","internalType":"string"},{"name":"votesFor","type":"uint256","internalType":"uint256"},{"name":"votesAgainst","type":"uint256","internalType":"uint256"},{"name":"executed","type":"bool","internalType":"bool"},{"name":"deadline","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},{"type":"function","name":"getProposalCount","inputs":[],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},{"type":"function","name":"getProposalDetails","inputs":[{"name":"proposalId","type":"uint256","internalType":"uint256"}],"outputs":[{"name":"target","type":"address","internalType":"address"},{"name":"value","type":"uint256","internalType":"uint256"},{"name":"proposer","type":"address","internalType":"address"},{"name":"createdAt","type":"uint256","internalType":"uint256"},{"name":"hasVoted","type":"bool","internalType":"bool"}],"stateMutability":"view"},{"type":"function","name":"memberCount","inputs":[],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},{"type":"function","name":"members","inputs":[{"name":"","type":"address","internalType":"address"}],"outputs":[{"name":"","type":"bool","internalType":"bool"}],"stateMutability":"view"},{"type":"function","name":"owner","inputs":[],"outputs":[{"name":"","type":"address","internalType":"address"}],"stateMutability":"view"},{"type":"function","name":"proposals","inputs":[{"name":"","type":"uint256","internalType":"uint256"}],"outputs":[{"name":"description","type":"string","internalType":"string"},{"name":"votesFor","type":"uint256","internalType":"uint256"},{"name":"votesAgainst","type":"uint256","internalType":"uint256"},{"name":"executed","type":"bool","internalType":"bool"},{"name":"deadline","type":"uint256","internalType":"uint256"},{"name":"target","type":"address","internalType":"address payable"},{"name":"value","type":"uint256","internalType":"uint256"},{"name":"proposer","type":"address","internalType":"address"},{"name":"createdAt","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},{"type":"function","name":"quorum","inputs":[],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},{"type":"function","name":"removeMember","inputs":[{"name":"memberToRemove","type":"address","internalType":"address"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"updateQuorum","inputs":[{"name":"newQuorum","type":"uint256","internalType":"uint256"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"updateVotingDuration","inputs":[{"name":"newDuration","type":"uint256","internalType":"uint256"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"vote","inputs":[{"name":"proposalId","type":"uint256","internalType":"uint256"},{"name":"support","type":"bool","internalType":"bool"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"voted","inputs":[{"name":"","type":"uint256","internalType":"uint256"},{"name":"","type":"address","internalType":"address"}],"outputs":[{"name":"","type":"bool","internalType":"bool"}],"stateMutability":"view"},{"type":"function","name":"votingDuration","inputs":[],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},{"type":"event","name":"FundsReceived","inputs":[{"name":"sender","type":"address","indexed":false,"internalType":"address"},{"name":"amount","type":"uint256","indexed":false,"internalType":"uint256"}],"anonymous":false},{"type":"event","name":"MemberAdded","inputs":[{"name":"member","type":"address","indexed":false,"internalType":"address"}],"anonymous":false},{"type":"event","name":"MemberRemoved","inputs":[{"name":"member","type":"address","indexed":false,"internalType":"address"}],"anonymous":false},{"type":"event","name":"ProposalCreated","inputs":[{"name":"proposalId","type":"uint256","indexed":false,"internalType":"uint256"},{"name":"description","type":"string","indexed":false,"internalType":"string"},{"name":"deadline","type":"uint256","indexed":false,"internalType":"uint256"},{"name":"target","type":"address","indexed":false,"internalType":"address"},{"name":"value","type":"uint256","indexed":false,"internalType":"uint256"},{"name":"proposer","type":"address","indexed":false,"internalType":"address"}],"anonymous":false},{"type":"event","name":"ProposalExecuted","inputs":[{"name":"proposalId","type":"uint256","indexed":false,"internalType":"uint256"},{"name":"executor","type":"address","indexed":false,"internalType":"address"}],"anonymous":false},{"type":"event","name":"QuorumUpdated","inputs":[{"name":"newQuorum","type":"uint256","indexed":false,"internalType":"uint256"}],"anonymous":false},{"type":"event","name":"Voted","inputs":[{"name":"proposalId","type":"uint256","indexed":false,"internalType":"uint256"},{"name":"voter","type":"address","indexed":false,"internalType":"address"},{"name":"support","type":"bool","indexed":false,"internalType":"bool"}],"anonymous":false}
]

// Landing Page Component
function LandingPage({ onConnect }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2 rounded-xl">
                <Users className="text-white" size={28} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">DAO Governance</h1>
                <p className="text-xs text-gray-600">Decentralized Decision Making</p>
              </div>
            </div>
            <button
              onClick={onConnect}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-2.5 rounded-lg font-semibold flex items-center gap-2 transition shadow-lg hover:shadow-xl"
            >
              <Wallet size={20} />
              Connect Wallet
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <div className="inline-block mb-4 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
            🚀 The Future of Governance
          </div>
          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Empower Your Community with
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"> Decentralized Governance</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Join a transparent, democratic organization where every member has a voice. Create proposals, vote on decisions, and shape the future together.
          </p>
          <button
            onClick={onConnect}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 rounded-xl font-bold text-lg flex items-center gap-3 mx-auto transition shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
          >
            Get Started Now
            <ArrowRight size={24} />
          </button>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition">
            <div className="bg-blue-100 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
              <Shield className="text-blue-600" size={32} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Secure & Transparent</h3>
            <p className="text-gray-600">
              Built on blockchain technology ensuring every vote and decision is recorded immutably and visible to all members.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition">
            <div className="bg-indigo-100 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
              <Vote className="text-indigo-600" size={32} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Democratic Voting</h3>
            <p className="text-gray-600">
              Every member gets an equal vote. Proposals require quorum and majority approval before execution.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition">
            <div className="bg-purple-100 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
              <Zap className="text-purple-600" size={32} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Instant Execution</h3>
            <p className="text-gray-600">
              Approved proposals are executed automatically on-chain, ensuring decisions are implemented without delay.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600">Simple, transparent, and powerful governance in 4 steps</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Connect Wallet</h3>
              <p className="text-gray-600">Connect your Web3 wallet to join the DAO community</p>
            </div>

            <div className="text-center">
              <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Create Proposals</h3>
              <p className="text-gray-600">Submit ideas and initiatives for community consideration</p>
            </div>

            <div className="text-center">
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Vote Together</h3>
              <p className="text-gray-600">Cast your vote and let your voice be heard</p>
            </div>

            <div className="text-center">
              <div className="bg-gradient-to-br from-pink-500 to-pink-600 w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                4
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Execute Decisions</h3>
              <p className="text-gray-600">Approved proposals are automatically executed</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-12 text-white">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Why Choose DAO Governance?</h2>
            <p className="text-xl text-blue-100">Join a growing community of decentralized decision makers</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <TrendingUp size={48} className="mx-auto mb-4" />
              <div className="text-4xl font-bold mb-2">100%</div>
              <p className="text-blue-100">Transparent Governance</p>
            </div>
            <div>
              <Users size={48} className="mx-auto mb-4" />
              <div className="text-4xl font-bold mb-2">Equal</div>
              <p className="text-blue-100">Voting Power</p>
            </div>
            <div>
              <Globe size={48} className="mx-auto mb-4" />
              <div className="text-4xl font-bold mb-2">24/7</div>
              <p className="text-blue-100">Decentralized Access</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-white rounded-3xl shadow-2xl p-12 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Ready to Shape the Future?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Connect your wallet and start participating in democratic governance today
          </p>
          <button
            onClick={onConnect}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-10 py-4 rounded-xl font-bold text-lg inline-flex items-center gap-3 transition shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
          >
            <Wallet size={24} />
            Connect Wallet Now
            <ArrowRight size={24} />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Users size={32} />
            <span className="text-2xl font-bold">DAO Governance</span>
          </div>
          <p className="text-gray-400 mb-4">Empowering communities through decentralized decision making</p>
          <p className="text-gray-500 text-sm">© 2024 DAO Governance. Built with ❤️ on Ethereum</p>
        </div>
      </footer>
    </div>
  );
}

// Main Dashboard Component
function Dashboard({ account, isMember, contract, onDisconnect }) {
  const [proposals, setProposals] = useState([]);
  const [daoBalance, setDaoBalance] = useState('0');
  const [memberCount, setMemberCount] = useState(0);
  const [quorum, setQuorum] = useState(0);
  const [loading, setLoading] = useState(false);
  const [newProposal, setNewProposal] = useState({
    description: '',
    target: '',
    value: ''
  });

  useEffect(() => {
    if (contract) {
      loadDAOData(contract);
    }
  }, [contract]);

  const loadDAOData = async (daoContract) => {
    try {
      setLoading(true);
      
      const balance = await daoContract.getDAOBalance();
      const count = await daoContract.memberCount();
      const q = await daoContract.quorum();
      const proposalCount = await daoContract.getProposalCount();

      setDaoBalance(ethers.formatEther(balance));
      setMemberCount(Number(count));
      setQuorum(Number(q));

      const formattedProposals = [];
      
      for (let i = 0; i < proposalCount; i++) {
        try {
          const basicInfo = await daoContract.getProposal(i);
          const detailedInfo = await daoContract.getProposalDetails(i);
          
          formattedProposals.push({
            id: i,
            description: basicInfo[0],
            votesFor: Number(basicInfo[1]),
            votesAgainst: Number(basicInfo[2]),
            executed: basicInfo[3],
            deadline: Number(basicInfo[4]),
            target: detailedInfo[0],
            value: ethers.formatEther(detailedInfo[1]),
            proposer: detailedInfo[2],
            createdAt: Number(detailedInfo[3]),
            hasVoted: detailedInfo[4]
          });
        } catch (err) {
          console.error(`Error loading proposal ${i}:`, err);
        }
      }

      setProposals(formattedProposals);
      
    } catch (error) {
      console.error('Error loading DAO data:', error);
    } finally {
      setLoading(false);
    }
  };

  const createProposal = async (e) => {
    e.preventDefault();
    if (!isMember) {
      alert('Only members can create proposals');
      return;
    }

    try {
      setLoading(true);
      
      if (!newProposal.description.trim()) {
        alert('Please enter a description');
        setLoading(false);
        return;
      }

      let valueInWei;
      try {
        const cleanValue = newProposal.value.trim();
        valueInWei = cleanValue ? ethers.parseEther(cleanValue) : ethers.parseEther('0');
      } catch (parseError) {
        alert('Invalid ETH amount. Please enter a valid number (e.g., 0.1)');
        setLoading(false);
        return;
      }

      const targetAddress = newProposal.target.trim() || ethers.ZeroAddress;

      const tx = await contract.createProposal(
        newProposal.description,
        targetAddress,
        valueInWei
      );
      
      await tx.wait();
      alert('Proposal created successfully!');
      
      setNewProposal({ description: '', target: '', value: '' });
      await loadDAOData(contract);
      
    } catch (error) {
      console.error('Error creating proposal:', error);
      alert('Failed to create proposal: ' + (error.reason || error.message));
    } finally {
      setLoading(false);
    }
  };

  const voteOnProposal = async (proposalId, support) => {
    if (!isMember) {
      alert('Only members can vote');
      return;
    }

    try {
      setLoading(true);
      const tx = await contract.vote(proposalId, support);
      await tx.wait();
      alert('Vote submitted successfully!');
      await loadDAOData(contract);
    } catch (error) {
      console.error('Error voting:', error);
      alert('Failed to vote: ' + (error.reason || error.message));
    } finally {
      setLoading(false);
    }
  };

  const executeProposal = async (proposalId) => {
    if (!isMember) {
      alert('Only members can execute proposals');
      return;
    }

    try {
      setLoading(true);
      const tx = await contract.executeProposal(proposalId);
      await tx.wait();
      alert('Proposal executed successfully!');
      await loadDAOData(contract);
    } catch (error) {
      console.error('Error executing proposal:', error);
      alert('Failed to execute: ' + (error.reason || error.message));
    } finally {
      setLoading(false);
    }
  };

  const fundDAO = async () => {
    const amount = prompt('Enter amount in ETH to send to DAO:');
    if (!amount) return;

    try {
      setLoading(true);
      const signer = await contract.runner;
      const tx = await signer.sendTransaction({
        to: DAO_ADDRESS,
        value: ethers.parseEther(amount)
      });
      await tx.wait();
      alert('DAO funded successfully!');
      await loadDAOData(contract);
    } catch (error) {
      console.error('Error funding DAO:', error);
      alert('Failed to fund DAO: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const isProposalActive = (deadline) => {
    return Date.now() / 1000 < deadline;
  };

  const canExecute = (proposal) => {
    const isPassed = proposal.votesFor > proposal.votesAgainst;
    const hasQuorum = (proposal.votesFor + proposal.votesAgainst) >= quorum;
    const isExpired = !isProposalActive(proposal.deadline);
    return !proposal.executed && isPassed && hasQuorum && isExpired;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">🏛️ DAO Governance</h1>
              <p className="text-gray-600">Decentralized decision making platform</p>
            </div>
            
            <div className="text-right">
              <div className="text-sm text-gray-600 mb-1">Connected</div>
              <div className="text-sm font-mono bg-gray-100 px-3 py-1 rounded">
                {account.slice(0, 6)}...{account.slice(-4)}
              </div>
              {isMember && (
                <div className="text-xs text-green-600 font-semibold mt-1">✓ DAO Member</div>
              )}
              <button
                onClick={onDisconnect}
                className="mt-2 text-xs text-red-600 hover:text-red-700 font-medium"
              >
                Disconnect
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-3">
              <DollarSign className="text-green-600" size={32} />
              <div>
                <div className="text-sm text-gray-600">Treasury</div>
                <div className="text-2xl font-bold">{daoBalance} ETH</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-3">
              <Users className="text-blue-600" size={32} />
              <div>
                <div className="text-sm text-gray-600">Members</div>
                <div className="text-2xl font-bold">{memberCount}</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-3">
              <FileText className="text-purple-600" size={32} />
              <div>
                <div className="text-sm text-gray-600">Proposals</div>
                <div className="text-2xl font-bold">{proposals.length}</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-3">
              <Vote className="text-orange-600" size={32} />
              <div>
                <div className="text-sm text-gray-600">Quorum</div>
                <div className="text-2xl font-bold">{quorum}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Create Proposal Form */}
        {isMember && (
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <h2 className="text-2xl font-bold mb-6">Create New Proposal</h2>
            <form onSubmit={createProposal} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  value={newProposal.description}
                  onChange={(e) => setNewProposal({...newProposal, description: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows="3"
                  placeholder="Describe your proposal..."
                  required
                  maxLength="500"
                />
                <div className="text-xs text-gray-500 mt-1">
                  {newProposal.description.length}/500 characters
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Target Address (optional)
                  </label>
                  <input
                    type="text"
                    value={newProposal.target}
                    onChange={(e) => setNewProposal({...newProposal, target: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0x... (leave empty for zero address)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Value in ETH (optional)
                  </label>
                  <input
                    type="text"
                    value={newProposal.value}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === '' || /^\d*\.?\d*$/.test(value)) {
                        setNewProposal({...newProposal, value: value});
                      }
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0.0 (e.g., 0.1 or 1.5)"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold disabled:bg-gray-400 transition"
              >
                {loading ? 'Creating...' : 'Create Proposal'}
              </button>
            </form>

            <button
              onClick={fundDAO}
              disabled={loading}
              className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold disabled:bg-gray-400 transition"
            >
              💰 Fund DAO Treasury
            </button>
          </div>
        )}

        {/* Proposals List */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">All Proposals</h2>
            <button
              onClick={() => loadDAOData(contract)}
              disabled={loading}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition disabled:bg-gray-100"
            >
              {loading ? '🔄 Refreshing...' : '🔄 Refresh'}
            </button>
          </div>

          {loading && proposals.length === 0 ? (
            <div className="text-center py-12 text-gray-500">Loading proposals...</div>
          ) : proposals.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <FileText size={48} className="mx-auto mb-4 text-gray-400" />
              <p>No proposals yet. Create the first one!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {proposals.slice().reverse().map((proposal) => (
                <div key={proposal.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold">Proposal #{proposal.id}</h3>
                        {proposal.executed && (
                          <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold">
                            ✓ Executed
                          </span>
                        )}
                        {!proposal.executed && isProposalActive(proposal.deadline) && (
                          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-semibold">
                            🔴 Active
                          </span>
                        )}
                        {!proposal.executed && !isProposalActive(proposal.deadline) && (
                          <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-xs font-semibold">
                            ⏱️ Ended
                          </span>
                        )}
                      </div>
                      <p className="text-gray-700 mb-3">{proposal.description}</p>
                      
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">Proposer:</span>{' '}
                          {proposal.proposer.slice(0, 6)}...{proposal.proposer.slice(-4)}
                        </div>
                        {proposal.target !== ethers.ZeroAddress && (
                          <div>
                            <span className="font-medium">Target:</span>{' '}
                            {proposal.target.slice(0, 6)}...{proposal.target.slice(-4)}
                          </div>
                        )}
                        {proposal.value !== '0.0' && (
                          <div>
                            <span className="font-medium">Value:</span> {proposal.value} ETH
                          </div>
                        )}
                        <div>
                          <span className="font-medium">Deadline:</span>{' '}
                          {new Date(proposal.deadline * 1000).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-green-50 rounded-lg p-4">
                      <div className="flex items-center gap-2 text-green-700 mb-1">
                        <CheckCircle size={20} />
                        <span className="font-semibold">For</span>
                      </div>
                      <div className="text-3xl font-bold text-green-700">{proposal.votesFor}</div>
                    </div>

                    <div className="bg-red-50 rounded-lg p-4">
                      <div className="flex items-center gap-2 text-red-700 mb-1">
                        <XCircle size={20} />
                        <span className="font-semibold">Against</span>
                      </div>
                      <div className="text-3xl font-bold text-red-700">{proposal.votesAgainst}</div>
                    </div>
                  </div>

                  {isMember && !proposal.executed && (
                    <div className="flex gap-3">
                      {isProposalActive(proposal.deadline) && !proposal.hasVoted && (
                        <>
                          <button
                            onClick={() => voteOnProposal(proposal.id, true)}
                            disabled={loading}
                            className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-semibold disabled:bg-gray-400 transition"
                          >
                            👍 Vote For
                          </button>
                          <button
                            onClick={() => voteOnProposal(proposal.id, false)}
                            disabled={loading}
                            className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-semibold disabled:bg-gray-400 transition"
                          >
                            👎 Vote Against
                          </button>
                        </>
                      )}
                      
                      {proposal.hasVoted && isProposalActive(proposal.deadline) && (
                        <div className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg font-semibold text-center">
                          ✓ You already voted
                        </div>
                      )}

                      {canExecute(proposal) && (
                        <button
                          onClick={() => executeProposal(proposal.id)}
                          disabled={loading}
                          className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg font-semibold disabled:bg-gray-400 transition"
                        >
                          ⚡ Execute Proposal
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Main App Component
function App() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState('');
  const [isMember, setIsMember] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        alert('Please install MetaMask!');
        return;
      }

      const web3Provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await web3Provider.send("eth_requestAccounts", []);
      const web3Signer = await web3Provider.getSigner();
      const daoContract = new ethers.Contract(DAO_ADDRESS, DAO_ABI, web3Signer);

      setProvider(web3Provider);
      setSigner(web3Signer);
      setContract(daoContract);
      setAccount(accounts[0]);

      // Check if user is a member
      const memberStatus = await daoContract.members(accounts[0]);
      setIsMember(memberStatus);

      // Show dashboard
      setShowDashboard(true);

    } catch (error) {
      console.error('Error connecting wallet:', error);
      alert('Failed to connect wallet');
    }
  };

  const disconnectWallet = () => {
    setProvider(null);
    setSigner(null);
    setContract(null);
    setAccount('');
    setIsMember(false);
    setShowDashboard(false);
  };

  return (
    <>
      {!showDashboard ? (
        <LandingPage onConnect={connectWallet} />
      ) : (
        <Dashboard 
          account={account} 
          isMember={isMember} 
          contract={contract}
          onDisconnect={disconnectWallet}
        />
      )}
    </>
  );
}

export default App;