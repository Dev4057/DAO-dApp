import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { Wallet, Vote, CheckCircle, XCircle, Clock, Users, DollarSign, FileText } from 'lucide-react';

// ⚠️ REPLACE WITH YOUR DEPLOYED CONTRACT ADDRESS
const DAO_ADDRESS = "0x94E19e5b6934799D68314C36a707aD584d8e7f71";

// DAO ABI (copy from your compiled contract)
const DAO_ABI = [{"type":"constructor","inputs":[{"name":"initialMembers","type":"address[]","internalType":"address[]"},{"name":"_quorum","type":"uint256","internalType":"uint256"}],"stateMutability":"nonpayable"},{"type":"receive","stateMutability":"payable"},{"type":"function","name":"addMember","inputs":[{"name":"newMember","type":"address","internalType":"address"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"createProposal","inputs":[{"name":"description","type":"string","internalType":"string"},{"name":"target","type":"address","internalType":"address payable"},{"name":"value","type":"uint256","internalType":"uint256"}],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"nonpayable"},{"type":"function","name":"executeProposal","inputs":[{"name":"proposalId","type":"uint256","internalType":"uint256"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"getActiveProposals","inputs":[],"outputs":[{"name":"","type":"uint256[]","internalType":"uint256[]"}],"stateMutability":"view"},{"type":"function","name":"getDAOBalance","inputs":[],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},{"type":"function","name":"getProposal","inputs":[{"name":"proposalId","type":"uint256","internalType":"uint256"}],"outputs":[{"name":"description","type":"string","internalType":"string"},{"name":"votesFor","type":"uint256","internalType":"uint256"},{"name":"votesAgainst","type":"uint256","internalType":"uint256"},{"name":"executed","type":"bool","internalType":"bool"},{"name":"deadline","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},{"type":"function","name":"getProposalCount","inputs":[],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},{"type":"function","name":"getProposalDetails","inputs":[{"name":"proposalId","type":"uint256","internalType":"uint256"}],"outputs":[{"name":"target","type":"address","internalType":"address"},{"name":"value","type":"uint256","internalType":"uint256"},{"name":"proposer","type":"address","internalType":"address"},{"name":"createdAt","type":"uint256","internalType":"uint256"},{"name":"hasVoted","type":"bool","internalType":"bool"}],"stateMutability":"view"},{"type":"function","name":"memberCount","inputs":[],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},{"type":"function","name":"members","inputs":[{"name":"","type":"address","internalType":"address"}],"outputs":[{"name":"","type":"bool","internalType":"bool"}],"stateMutability":"view"},{"type":"function","name":"owner","inputs":[],"outputs":[{"name":"","type":"address","internalType":"address"}],"stateMutability":"view"},{"type":"function","name":"proposals","inputs":[{"name":"","type":"uint256","internalType":"uint256"}],"outputs":[{"name":"description","type":"string","internalType":"string"},{"name":"votesFor","type":"uint256","internalType":"uint256"},{"name":"votesAgainst","type":"uint256","internalType":"uint256"},{"name":"executed","type":"bool","internalType":"bool"},{"name":"deadline","type":"uint256","internalType":"uint256"},{"name":"target","type":"address","internalType":"address payable"},{"name":"value","type":"uint256","internalType":"uint256"},{"name":"proposer","type":"address","internalType":"address"},{"name":"createdAt","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},{"type":"function","name":"quorum","inputs":[],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},{"type":"function","name":"removeMember","inputs":[{"name":"memberToRemove","type":"address","internalType":"address"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"updateQuorum","inputs":[{"name":"newQuorum","type":"uint256","internalType":"uint256"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"updateVotingDuration","inputs":[{"name":"newDuration","type":"uint256","internalType":"uint256"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"vote","inputs":[{"name":"proposalId","type":"uint256","internalType":"uint256"},{"name":"support","type":"bool","internalType":"bool"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"voted","inputs":[{"name":"","type":"uint256","internalType":"uint256"},{"name":"","type":"address","internalType":"address"}],"outputs":[{"name":"","type":"bool","internalType":"bool"}],"stateMutability":"view"},{"type":"function","name":"votingDuration","inputs":[],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},{"type":"event","name":"FundsReceived","inputs":[{"name":"sender","type":"address","indexed":false,"internalType":"address"},{"name":"amount","type":"uint256","indexed":false,"internalType":"uint256"}],"anonymous":false},{"type":"event","name":"MemberAdded","inputs":[{"name":"member","type":"address","indexed":false,"internalType":"address"}],"anonymous":false},{"type":"event","name":"MemberRemoved","inputs":[{"name":"member","type":"address","indexed":false,"internalType":"address"}],"anonymous":false},{"type":"event","name":"ProposalCreated","inputs":[{"name":"proposalId","type":"uint256","indexed":false,"internalType":"uint256"},{"name":"description","type":"string","indexed":false,"internalType":"string"},{"name":"deadline","type":"uint256","indexed":false,"internalType":"uint256"},{"name":"target","type":"address","indexed":false,"internalType":"address"},{"name":"value","type":"uint256","indexed":false,"internalType":"uint256"},{"name":"proposer","type":"address","indexed":false,"internalType":"address"}],"anonymous":false},{"type":"event","name":"ProposalExecuted","inputs":[{"name":"proposalId","type":"uint256","indexed":false,"internalType":"uint256"},{"name":"executor","type":"address","indexed":false,"internalType":"address"}],"anonymous":false},{"type":"event","name":"QuorumUpdated","inputs":[{"name":"newQuorum","type":"uint256","indexed":false,"internalType":"uint256"}],"anonymous":false},{"type":"event","name":"Voted","inputs":[{"name":"proposalId","type":"uint256","indexed":false,"internalType":"uint256"},{"name":"voter","type":"address","indexed":false,"internalType":"address"},{"name":"support","type":"bool","indexed":false,"internalType":"bool"}],"anonymous":false}
]

function App() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState('');
  const [isMember, setIsMember] = useState(false);
  const [proposals, setProposals] = useState([]);
  const [daoBalance, setDaoBalance] = useState('0');
  const [memberCount, setMemberCount] = useState(0);
  const [quorum, setQuorum] = useState(0);
  const [loading, setLoading] = useState(false);

  // Form states
  const [newProposal, setNewProposal] = useState({
    description: '',
    target: '',
    value: ''
  });

  // Connect Wallet
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

      // Load DAO data
      await loadDAOData(daoContract);

    } catch (error) {
      console.error('Error connecting wallet:', error);
      alert('Failed to connect wallet');
    }
  };

  // Load DAO Data - FIXED VERSION
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

      console.log('Total proposals:', Number(proposalCount));

      // Load all proposals - CALLING BOTH FUNCTIONS NOW
      const formattedProposals = [];
      
      for (let i = 0; i < proposalCount; i++) {
        try {
          // Get basic proposal info (5 values)
          const basicInfo = await daoContract.getProposal(i);
          
          // Get detailed proposal info (5 more values)
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

      console.log('Loaded proposals:', formattedProposals);
      setProposals(formattedProposals);
      
    } catch (error) {
      console.error('Error loading DAO data:', error);
      alert('Error loading DAO data: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Create Proposal - FIXED VERSION
  const createProposal = async (e) => {
    e.preventDefault();
    if (!isMember) {
      alert('Only members can create proposals');
      return;
    }

    try {
      setLoading(true);
      
      // Validate description
      if (!newProposal.description.trim()) {
        alert('Please enter a description');
        setLoading(false);
        return;
      }

      // Parse value - handle empty or invalid input
      let valueInWei;
      try {
        const cleanValue = newProposal.value.trim();
        valueInWei = cleanValue ? ethers.parseEther(cleanValue) : ethers.parseEther('0');
      } catch (parseError) {
        alert('Invalid ETH amount. Please enter a valid number (e.g., 0.1)');
        setLoading(false);
        return;
      }

      // Use zero address if target is empty
      const targetAddress = newProposal.target.trim() || ethers.ZeroAddress;

      console.log('Creating proposal:', {
        description: newProposal.description,
        target: targetAddress,
        value: valueInWei.toString()
      });

      const tx = await contract.createProposal(
        newProposal.description,
        targetAddress,
        valueInWei
      );
      
      console.log('Transaction sent:', tx.hash);
      const receipt = await tx.wait();
      console.log('Transaction confirmed:', receipt);
      
      alert('Proposal created successfully!');
      
      // Reset form
      setNewProposal({ description: '', target: '', value: '' });
      
      // Reload DAO data to show new proposal
      await loadDAOData(contract);
      
    } catch (error) {
      console.error('Error creating proposal:', error);
      alert('Failed to create proposal: ' + (error.reason || error.message));
    } finally {
      setLoading(false);
    }
  };

  // Vote on Proposal
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

  // Execute Proposal
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

  // Fund DAO
  const fundDAO = async () => {
    const amount = prompt('Enter amount in ETH to send to DAO:');
    if (!amount) return;

    try {
      setLoading(true);
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
            
            {!account ? (
              <button
                onClick={connectWallet}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition"
              >
                <Wallet size={20} />
                Connect Wallet
              </button>
            ) : (
              <div className="text-right">
                <div className="text-sm text-gray-600 mb-1">Connected</div>
                <div className="text-sm font-mono bg-gray-100 px-3 py-1 rounded">
                  {account.slice(0, 6)}...{account.slice(-4)}
                </div>
                {isMember && (
                  <div className="text-xs text-green-600 font-semibold mt-1">✓ DAO Member</div>
                )}
              </div>
            )}
          </div>
        </div>

        {account && (
          <>
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
                          // Only allow numbers and one decimal point
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
          </>
        )}

        {!account && (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <Wallet size={64} className="mx-auto mb-4 text-gray-400" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome to DAO Governance</h2>
            <p className="text-gray-600 mb-6">Connect your wallet to participate in decision making</p>
            <button
              onClick={connectWallet}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold inline-flex items-center gap-2 transition"
            >
              <Wallet size={20} />
              Connect Wallet
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;