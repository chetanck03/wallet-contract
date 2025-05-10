import React, { useState, useEffect } from 'react';
import { useWallet } from '../hooks/useWallet';

// Example Icons
const LockClosedIcon = ({className = "w-5 h-5"}) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}><path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" /></svg>;
const ArrowDownTrayIcon = ({className = "w-5 h-5"}) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>;
const InformationCircleIcon = ({className = "w-5 h-5"}) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" /></svg>;
const ArrowRightIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 ml-2 group-hover:translate-x-0.5 transition-transform"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>;

const StakingPage = () => {
  const { account, connectWallet, error: walletError } = useWallet();
  const [stakeAmount, setStakeAmount] = useState('');
  const [selectedDuration, setSelectedDuration] = useState(90); 
  const [isProcessing, setIsProcessing] = useState(false);
  const [transactionFeedback, setTransactionFeedback] = useState('');
  const [showApprovalStep, setShowApprovalStep] = useState(false);

  const mockBft = { symbol: 'BFT', decimals: 18, userBalance: '25000' };
  const stakingDurations = [
    { days: 30, label: '30 Days', apy: '5.0' },
    { days: 90, label: '90 Days', apy: '7.5' },
    { days: 180, label: '180 Days', apy: '10.0' },
    { days: 365, label: '1 Year', apy: '15.0' },
  ];

  const [protocolStats, setProtocolStats] = useState({
    totalStakedBFT: '15,750,000',
    minStakingPeriodDays: 30,
    baseApy: '7.5', 
  });

  const [userStakes, setUserStakes] = useState([
    {
      id: 'stake1',
      amount: '5000',
      startTime: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
      endTime: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
      durationDays: 90,
      apy: '7.5',
      accruedRewards: '46.87',
      canUnstake: false,
    },
    {
      id: 'stake2',
      amount: '10000',
      startTime: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      endTime: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
      durationDays: 30,
      apy: '5.0',
      accruedRewards: '13.70',
      canUnstake: false,
    },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setUserStakes(prevStakes => 
        prevStakes.map(stake => ({
          ...stake,
          canUnstake: new Date(stake.endTime) <= new Date(),
          accruedRewards: (parseFloat(stake.amount) * (parseFloat(stake.apy)/100) / 365 * ((Math.max(0, new Date() - new Date(stake.startTime)))/(24*60*60*1000)) ).toFixed(2)
        }))
      );
    }, 5000); 
    return () => clearInterval(interval);
  }, []);

  const handleApprove = async () => {
    if (!account) { setTransactionFeedback('Please connect wallet.'); return; }
    setIsProcessing(true);
    setTransactionFeedback('Simulating BFT approval for staking...');
    await new Promise(resolve => setTimeout(resolve, 2000));
    setShowApprovalStep(false);
    setTransactionFeedback('Approval successful! You can now confirm your stake.');
    setIsProcessing(false);
  };

  const handleStake = async () => {
    if (!account) { setTransactionFeedback('Please connect wallet.'); return; }
    const numericAmount = parseFloat(stakeAmount);
    if (isNaN(numericAmount) || numericAmount <= 0) { setTransactionFeedback('Please enter a valid amount to stake.'); return; }
    if (numericAmount > parseFloat(mockBft.userBalance)) { setTransactionFeedback('Insufficient BFT balance.'); return; }
    
    const MOCK_NEEDS_APPROVAL = true; 
    if (!showApprovalStep && MOCK_NEEDS_APPROVAL) {
        setShowApprovalStep(true);
        setTransactionFeedback('Please approve BFT spending for the staking contract.');
        return;
    }

    setIsProcessing(true);
    setTransactionFeedback('Simulating stake transaction...');
    await new Promise(resolve => setTimeout(resolve, 2500));

    const newStake = {
      id: `stake${Date.now()}`,
      amount: numericAmount.toString(),
      startTime: new Date().toISOString(),
      endTime: new Date(Date.now() + selectedDuration * 24 * 60 * 60 * 1000).toISOString(),
      durationDays: selectedDuration,
      apy: stakingDurations.find(d => d.days === selectedDuration)?.apy || '0',
      accruedRewards: '0.00',
      canUnstake: false,
    };
    setUserStakes(prev => [newStake, ...prev]);
    setProtocolStats(prev => ({...prev, totalStakedBFT: (parseFloat(prev.totalStakedBFT.replace(/,/g, '')) + numericAmount).toLocaleString() }));
    mockBft.userBalance = (parseFloat(mockBft.userBalance) - numericAmount).toString();
    setTransactionFeedback(`Successfully staked ${numericAmount.toLocaleString()} BFT! (Simulated)`);
    setStakeAmount('');
    setShowApprovalStep(false);
    setIsProcessing(false);
  };

  const handleUnstake = async (stakeId) => {
    setIsProcessing(true);
    setTransactionFeedback(`Simulating unstake for stake ID: ${stakeId}...`);
    await new Promise(resolve => setTimeout(resolve, 2000));
    const stakeToUnstake = userStakes.find(s => s.id === stakeId);
    if (stakeToUnstake) {
        mockBft.userBalance = (parseFloat(mockBft.userBalance) + parseFloat(stakeToUnstake.amount)).toString();
        setProtocolStats(prev => ({...prev, totalStakedBFT: (parseFloat(prev.totalStakedBFT.replace(/,/g, '')) - parseFloat(stakeToUnstake.amount)).toLocaleString() }));
    }
    setUserStakes(prev => prev.filter(s => s.id !== stakeId));
    setTransactionFeedback(`Successfully unstaked stake ID: ${stakeId} & claimed rewards! (Simulated)`);
    setIsProcessing(false);
  };

  const estimatedReward = () => {
    if (!stakeAmount || !selectedDuration) return '0.00';
    const durationInfo = stakingDurations.find(d => d.days === selectedDuration);
    if (!durationInfo) return '0.00';
    const dailyRate = parseFloat(durationInfo.apy) / 100 / 365;
    return (parseFloat(stakeAmount) * dailyRate * selectedDuration).toFixed(2);
  };

  if (walletError && !account) {
    return (
      <div className="max-w-lg mx-auto bg-red-800/40 backdrop-blur-sm p-6 rounded-xl shadow-2xl my-10 border border-red-600/50 text-center">
        <h3 className="text-2xl font-semibold text-red-300 mb-3">Wallet Connection Error</h3>
        <p className="text-red-200 mb-4">{walletError}</p>
        <p className="text-gray-400">Please ensure your wallet is installed, unlocked, and connected correctly.</p>
      </div>
    );
  }

  const StakingStatCard = ({ title, value, unit = ''}) => (
    <div className="bg-gray-800/60 backdrop-blur-md p-5 rounded-xl shadow-xl border border-gray-700/50 text-center transform hover:scale-[1.03] transition-transform duration-200">
        <p className="text-sm font-medium text-indigo-300 uppercase tracking-wider">{title}</p>
        <p className="text-2xl sm:text-3xl font-bold text-gray-100 mt-1.5">{value} <span className="text-base text-gray-400">{unit}</span></p>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto py-8 sm:py-12 px-4 sm:px-0 space-y-12">
      <header className="text-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">
           {/* Unified title gradient with Presale page */}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-indigo-500 to-pink-500">
            BitFrac Staking Protocol
          </span>
        </h1>
        <p className="text-xl text-gray-300">Stake Your BFT. Earn Rewards. Secure the Network.</p>
      </header>

      <section className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StakingStatCard title="Total BFT Staked" value={protocolStats.totalStakedBFT} unit={mockBft.symbol} />
        <StakingStatCard title="Indicative APY" value={`${protocolStats.baseApy}%`} unit="(Variable)" />
        <StakingStatCard title="Min. Staking Period" value={`${protocolStats.minStakingPeriodDays} Days`} />
      </section>

      <section className="grid md:grid-cols-2 gap-8 lg:gap-12 items-start">
        <div className="bg-gray-800/70 backdrop-blur-xl p-6 sm:p-8 rounded-2xl shadow-2xl border border-gray-700/60 space-y-6">
          <h2 className="text-2xl font-semibold text-indigo-300 mb-1">Stake Your BFT Tokens</h2>
          {!account ? (
            <div className="text-center p-8 bg-gradient-to-br from-indigo-900/50 to-purple-900/50 rounded-xl border border-indigo-700/60 shadow-xl">
              <h4 className="text-xl font-semibold text-indigo-200 mb-4">Ready to Earn?</h4>
              <p className="text-gray-300 mb-6">Connect your wallet to start staking BFT and earning rewards.</p>
              <button onClick={connectWallet} className="group bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold py-3.5 px-10 rounded-lg shadow-lg hover:shadow-xl transition-all duration-150 ease-in-out text-base transform hover:scale-105 flex items-center justify-center mx-auto">
                Connect Wallet to Stake <ArrowRightIcon />
              </button>
            </div>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); showApprovalStep ? handleApprove() : handleStake(); }} className="space-y-5">
              <div>
                <label htmlFor="stakeAmount" className="block text-sm font-medium text-gray-200 mb-1.5">Amount to Stake ({mockBft.symbol})</label>
                <input 
                  type="number" 
                  id="stakeAmount" 
                  value={stakeAmount}
                  onChange={(e) => setStakeAmount(e.target.value)} 
                  placeholder={`Your balance: ${parseFloat(mockBft.userBalance).toLocaleString()} ${mockBft.symbol}`}
                  className="w-full p-4 rounded-lg bg-gray-700/80 border-2 border-gray-600/80 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/70 text-white shadow-sm transition-colors text-lg placeholder-gray-500"
                  disabled={isProcessing || showApprovalStep}
                />
              </div>
              <div>
                <label htmlFor="stakeDuration" className="block text-sm font-medium text-gray-200 mb-1.5">Select Staking Duration</label>
                <select 
                  id="stakeDuration" 
                  value={selectedDuration} 
                  onChange={(e) => setSelectedDuration(Number(e.target.value))}
                  className="w-full p-4 rounded-lg bg-gray-700/80 border-2 border-gray-600/80 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/70 text-white shadow-sm transition-colors text-lg appearance-none"
                  disabled={isProcessing || showApprovalStep}
                >
                  {stakingDurations.map(duration => (
                    <option key={duration.days} value={duration.days}>{duration.label} (~{duration.apy}% APY)</option>
                  ))}
                </select>
              </div>
              {stakeAmount && parseFloat(stakeAmount) > 0 && (
                <div className="p-4 bg-gray-700/70 rounded-lg shadow-inner space-y-1">
                  <p className="flex justify-between text-gray-300"><span>Estimated Rewards:</span> <span className="font-bold text-xl text-indigo-300">{estimatedReward()} {mockBft.symbol}</span></p>
                  <p className="text-xs text-gray-400 mt-1.5">Rewards are estimated and subject to change. Distributed upon unstaking.</p>
                </div>
              )}
              {showApprovalStep ? (
                <button type="submit" className="group w-full bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold py-3.5 px-6 rounded-lg shadow-xl hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-150 ease-in-out disabled:opacity-70 text-base focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 focus:ring-offset-gray-900 flex items-center justify-center" disabled={isProcessing}>
                  {isProcessing ? 'Processing Approval...' : 'Approve BFT Spending'} {!isProcessing && <LockClosedIcon className="ml-2 w-4 h-4"/>}
                </button>
              ) : (
                <button type="submit" className="group w-full bg-gradient-to-r from-indigo-600 to-purple-700 hover:from-indigo-700 hover:to-purple-800 text-white font-semibold py-3.5 px-6 rounded-lg shadow-xl hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-150 ease-in-out disabled:opacity-70 disabled:cursor-not-allowed text-base focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900 flex items-center justify-center" disabled={isProcessing || !stakeAmount || parseFloat(stakeAmount) <= 0}>
                  {isProcessing ? 'Processing Stake...' : 'Stake BFT Now'} {!isProcessing && <LockClosedIcon className="ml-2 w-4 h-4"/>}
                </button>
              )}
            </form>
          )}
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-indigo-300 mb-1">Your Active Stakes ({userStakes.length})</h2>
          {account ? (
            userStakes.length === 0 ? (
              <div className="text-center py-12 bg-gray-800/50 rounded-xl border border-gray-700/50 shadow-inner">
                <InformationCircleIcon className="mx-auto h-12 w-12 text-gray-500" />
                <p className="mt-4 text-lg text-gray-400">You have no BFT currently staked.</p>
                <p className="text-sm text-gray-500">Stake BFT to start earning rewards.</p>
              </div>
            ) : (
              userStakes.map(stake => (
                <div key={stake.id} className="bg-gray-800/70 backdrop-blur-xl p-5 rounded-xl shadow-lg border border-gray-700/50">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                    <h3 className="text-lg font-semibold text-indigo-300 mb-1 sm:mb-0">Staked: {parseFloat(stake.amount).toLocaleString()} {mockBft.symbol}</h3>
                    <span className={`px-3 py-1 text-xs font-medium rounded-full shadow-sm ring-1 ring-inset ${stake.canUnstake ? 'bg-red-600/20 text-red-300 ring-red-500/70' : 'bg-gray-600/20 text-gray-300 ring-gray-500/70'}`}>
                      {stake.canUnstake ? 'Ready to Unstake' : `Locks: ${new Date(stake.endTime).toLocaleDateString()}`}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm mb-5">
                    <p><span className="text-gray-400">APY:</span> <span className="font-medium text-gray-100">{stake.apy}%</span></p>
                    <p><span className="text-gray-400">Duration:</span> <span className="font-medium text-gray-100">{stake.durationDays} Days</span></p>
                    <p><span className="text-gray-400">Start Date:</span> <span className="font-medium text-gray-100">{new Date(stake.startTime).toLocaleDateString()}</span></p>
                    <p><span className="text-gray-400">End Date:</span> <span className="font-medium text-gray-100">{new Date(stake.endTime).toLocaleDateString()}</span></p>
                    <p className="col-span-2"><span className="text-gray-400">Accrued Rewards:</span> <span className="font-semibold text-xl text-purple-300 animate-pulse">{stake.accruedRewards} {mockBft.symbol}</span></p>
                  </div>
                  <button 
                    onClick={() => handleUnstake(stake.id)}
                    className="group w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition-colors duration-150 ease-in-out disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center text-sm transform hover:scale-[1.02]"
                    disabled={isProcessing || !stake.canUnstake}
                  >
                    <ArrowDownTrayIcon className="w-4 h-4 mr-2"/> Unstake & Claim Rewards
                  </button>
                </div>
              ))
            )
          ) : (
             <p className="text-center text-gray-400 py-6">Connect your wallet to view and manage your stakes.</p>
          )}
        </div>
      </section>
      {transactionFeedback && (
        <p className={`mt-8 p-4 rounded-lg text-center font-medium shadow-md text-sm ${transactionFeedback.toLowerCase().includes('error') || transactionFeedback.toLowerCase().includes('please') ? 'bg-red-800/50 text-red-100 border border-red-700/60' : 'bg-green-800/50 text-green-100 border border-green-700/60'}`}>
            {transactionFeedback}
        </p>
      )}
    </div>
  );
};

export default StakingPage;
