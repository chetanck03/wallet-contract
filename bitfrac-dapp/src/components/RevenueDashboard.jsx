import React, { useState, useEffect } from 'react';
import { useWallet } from '../hooks/useWallet';

// Example Icons
const ClockIcon = ({className = "w-5 h-5"}) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const CheckCircleIcon = ({className = "w-5 h-5"}) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const GiftIcon = ({className = "w-5 h-5"}) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5v-8.25M12 4.875A3.375 3.375 0 006.375 8.25H17.625A3.375 3.375 0 0012 4.875z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.875v16.5M17.625 8.25h3.375V11.25h-3.375zM6.375 8.25H3v3h3.375z" /></svg>;
const ExclamationTriangleIcon = ({className = "w-5 h-5"}) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>;
const ArrowRightIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 ml-2 group-hover:translate-x-0.5 transition-transform"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>;

const RevenueDashboard = () => {
  const { account, connectWallet, error: walletError } = useWallet();
  const [isLoading, setIsLoading] = useState(false);
  const [transactionFeedback, setTransactionFeedback] = useState('');

  const mockStablecoin = { symbol: 'USDC', decimals: 6 };

  const [userGlobalStats, setUserGlobalStats] = useState({
    totalClaimed: '125.50',
    eligiblePools: 1, 
  });

  const [revenuePoolsData, setRevenuePoolsData] = useState([
    {
      id: '3',
      status: 'Claimable',
      totalAmount: '15000.00',
      userClaimableAmount: '75.20',
      startTime: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      endTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      snapshotId: '102',
      totalEligibleTokens: '2500000',
      hasUserClaimed: false,
    },
    {
      id: '2',
      status: 'Claimed',
      totalAmount: '12000.00',
      userClaimableAmount: '50.30',
      startTime: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      endTime: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
      snapshotId: '95',
      totalEligibleTokens: '2200000',
      hasUserClaimed: true,
    },
    {
      id: '1',
      status: 'Ended',
      totalAmount: '10000.00',
      userClaimableAmount: '0.00', 
      startTime: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      endTime: new Date(Date.now() - 23 * 24 * 60 * 60 * 1000).toISOString(),
      snapshotId: '88',
      totalEligibleTokens: '2000000',
      hasUserClaimed: false, 
    },
  ]);

  const [protocolInfo, setProtocolInfo] = useState({
    minimumTokensForRevenue: '1000',
    distributionPeriod: 'Weekly (approx)',
  });

  useEffect(() => {
    setIsLoading(true);
    setTransactionFeedback('Loading revenue pool data...');
    const timer = setTimeout(() => {
      setIsLoading(false);
      setTransactionFeedback('');
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleClaimRevenue = async (poolId) => {
    setIsLoading(true);
    setTransactionFeedback(`Simulating claim from pool #${poolId}...`);
    await new Promise(resolve => setTimeout(resolve, 2000)); 

    setRevenuePoolsData(prevPools => 
      prevPools.map(pool => 
        pool.id === poolId 
          ? { ...pool, hasUserClaimed: true, status: 'Claimed' } 
          : pool
      )
    );
    setUserGlobalStats(prev => ({ ...prev, totalClaimed: (parseFloat(prev.totalClaimed) + parseFloat(revenuePoolsData.find(p=>p.id===poolId)?.userClaimableAmount || '0')).toFixed(2), eligiblePools: Math.max(0, prev.eligiblePools -1) }));
    setTransactionFeedback(`Successfully claimed revenue from pool #${poolId}! (Simulated)`);
    setIsLoading(false);
  };

  const PoolStatusBadge = ({ status }) => {
    let bgColor, textColor, ringColor, Icon;
    // Unified status colors, can be adjusted if specific ones are preferred
    switch (status) {
      case 'Claimable': bgColor = 'bg-yellow-600/20'; textColor = 'text-yellow-300'; ringColor='ring-yellow-500/70'; Icon = GiftIcon; break;
      case 'Claimed': bgColor = 'bg-green-600/20'; textColor = 'text-green-300'; ringColor='ring-green-500/70'; Icon = CheckCircleIcon; break;
      case 'Active': bgColor = 'bg-sky-600/20'; textColor = 'text-sky-300'; ringColor='ring-sky-500/70'; Icon = ClockIcon; break;
      case 'Ended': bgColor = 'bg-gray-600/20'; textColor = 'text-gray-400'; ringColor='ring-gray-500/70'; Icon = ExclamationTriangleIcon; break;
      default: bgColor = 'bg-gray-700/30'; textColor = 'text-gray-200'; ringColor='ring-gray-600/70'; Icon = ExclamationTriangleIcon; break;
    }
    return (
      <div className={`inline-flex items-center px-3.5 py-1.5 rounded-full text-xs font-semibold ${bgColor} ${textColor} shadow-sm ring-1 ring-inset ${ringColor}`}>
        <Icon className="w-4 h-4 mr-1.5"/> {status}
      </div>
    );
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
  
  return (
    <div className="max-w-5xl mx-auto py-8 sm:py-12 px-4 sm:px-0 space-y-12">
      <header className="text-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">
          {/* Unified title gradient with Presale page */}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-indigo-500 to-pink-500">
            Revenue Dashboard
          </span>
        </h1>
        <p className="text-xl text-gray-300">Track and Claim Your Earnings from BitFrac Protocol.</p>
      </header>

      {account && (
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
          <div className="bg-gray-800/60 backdrop-blur-md p-6 rounded-xl shadow-xl border border-gray-700/50 transform hover:scale-[1.03] transition-transform duration-200">
            <h3 className="text-sm font-medium text-indigo-300 uppercase tracking-wider">Your Total Claimed Revenue</h3>
            <p className="text-3xl font-bold text-gray-100 mt-1.5">{userGlobalStats.totalClaimed} <span className="text-lg text-gray-400">{mockStablecoin.symbol}</span></p>
          </div>
          <div className="bg-gray-800/60 backdrop-blur-md p-6 rounded-xl shadow-xl border border-gray-700/50 transform hover:scale-[1.03] transition-transform duration-200">
            <h3 className="text-sm font-medium text-indigo-300 uppercase tracking-wider">Pools Ready to Claim</h3>
            <p className="text-3xl font-bold text-gray-100 mt-1.5">{userGlobalStats.eligiblePools} <span className="text-lg text-gray-400">Pool(s)</span></p>
          </div>
        </section>
      )}

      {isLoading && <p className="text-center text-yellow-200 py-3.5 bg-yellow-700/40 rounded-lg animate-pulse text-sm">{transactionFeedback || 'Loading data...'}</p>}
      {!isLoading && transactionFeedback && !transactionFeedback.toLowerCase().includes('simulating') && (
        <p className={`text-center p-3.5 rounded-lg mb-6 font-medium shadow-md text-sm ${transactionFeedback.startsWith('Error') ? 'bg-red-800/50 text-red-100 border border-red-700/60' : 'bg-green-800/50 text-green-100 border border-green-700/60'}`}>
          {transactionFeedback}
        </p>
      )}

      {!account && (
        <div className="mt-10 text-center p-8 bg-gradient-to-br from-indigo-900/50 to-purple-900/50 rounded-2xl border border-indigo-700/60 shadow-xl">
          <h2 className="text-2xl font-semibold text-indigo-200 mb-4">View Your Revenue Share</h2>
          <p className="text-gray-300 mb-6">Connect your wallet to access your revenue dashboard and claim available earnings.</p>
          <button 
            onClick={connectWallet} 
            className="group bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold py-3.5 px-10 rounded-lg shadow-lg hover:shadow-xl transition-all duration-150 ease-in-out text-base transform hover:scale-105 flex items-center justify-center mx-auto"
          >
            Connect Wallet <ArrowRightIcon />
          </button>
        </div>
      )}

      {account && (
        <div className="space-y-8">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-1">
            <h3 className="text-3xl font-semibold text-gray-100 mb-3 sm:mb-0">Available Revenue Pools</h3>
          </div>
          {revenuePoolsData.length === 0 && !isLoading && (
            <div className="text-center py-12 bg-gray-800/50 rounded-xl border border-gray-700/50 shadow-inner">
              <ExclamationTriangleIcon className="mx-auto h-12 w-12 text-gray-500" />
              <p className="mt-4 text-lg text-gray-400">No revenue pools available at the moment.</p>
              <p className="text-sm text-gray-500">Check back later for new distribution rounds.</p>
            </div>
          )}
          {revenuePoolsData.map((pool) => (
            <div key={pool.id} className="bg-gray-800/70 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-700/60 overflow-hidden transition-all hover:shadow-purple-500/10 duration-300 ease-out">
              <div className="p-5 sm:p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-5">
                  <h4 className="text-xl font-semibold text-indigo-300 mb-2 sm:mb-0">Revenue Pool #{pool.id}</h4>
                  <PoolStatusBadge status={pool.status} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 text-sm mb-3">
                  <div className="space-y-1">
                    <p className="text-gray-400">Total in Pool:</p>
                    <p className="text-xl font-medium text-gray-100">{parseFloat(pool.totalAmount).toLocaleString()} {mockStablecoin.symbol}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-gray-400">Your Claimable Amount:</p>
                    <p className={`text-xl font-medium ${pool.status === 'Claimable' && !pool.hasUserClaimed ? 'text-yellow-300 animate-pulse' : 'text-gray-100'}`}>
                      {pool.status === 'Claimable' || pool.status === 'Claimed' ? `${parseFloat(pool.userClaimableAmount).toLocaleString()} ${mockStablecoin.symbol}` : 'N/A'}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-gray-400 flex items-center"><ClockIcon className="w-4 h-4 mr-1.5 text-gray-500"/>Distribution Period:</p>
                    <p className="text-gray-200">{new Date(pool.startTime).toLocaleDateString()} - {new Date(pool.endTime).toLocaleDateString()}</p>
                  </div>
                  {pool.status !== 'Active' && 
                    <div className="space-y-1">
                      <p className="text-gray-400">Eligible BFT (Snapshot #{pool.snapshotId}):</p>
                      <p className="text-gray-200">{parseFloat(pool.totalEligibleTokens).toLocaleString()} BFT</p>
                    </div>
                  }
                </div>
              </div>
              {(pool.status === 'Claimable' && !pool.hasUserClaimed) && (
                <div className="bg-gray-700/60 px-5 py-4 sm:px-6 border-t border-gray-700/50">
                  <button 
                    onClick={() => handleClaimRevenue(pool.id)} 
                    disabled={isLoading} 
                    className="group w-full bg-gradient-to-r from-indigo-600 to-purple-700 hover:from-indigo-700 hover:to-purple-800 text-white font-bold py-3.5 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-150 ease-in-out disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center text-base transform hover:scale-[1.02]"
                  >
                    <GiftIcon className="w-5 h-5 mr-2 "/> Claim {parseFloat(pool.userClaimableAmount).toLocaleString()} {mockStablecoin.symbol}
                    {!isLoading && <ArrowRightIcon />}
                  </button>
                </div>
              )}
              {pool.status === 'Claimed' && (
                 <div className="bg-green-700/40 px-5 py-3 sm:px-6 text-center border-t border-green-700/30">
                    <p className="font-semibold text-green-300 flex items-center justify-center"><CheckCircleIcon className="w-5 h-5 mr-2 text-green-400"/> Revenue Successfully Claimed</p>
                 </div>
              )}
            </div>
          ))}
        </div>
      )}

      {account && (
        <section className="mt-16 pt-10 border-t border-gray-700/50">
            <h3 className="text-2xl font-semibold text-gray-200 mb-6 text-center">Revenue Protocol Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
                <div className="bg-gray-800/60 backdrop-blur-md p-6 rounded-xl shadow-xl text-center border border-gray-700/50">
                    <p className="text-sm font-medium text-indigo-300 uppercase tracking-wider">Minimum BFT for Eligibility</p>
                    <p className="text-2xl font-bold text-gray-100 mt-1.5">{parseFloat(protocolInfo.minimumTokensForRevenue).toLocaleString()} BFT</p>
                </div>
                <div className="bg-gray-800/60 backdrop-blur-md p-6 rounded-xl shadow-xl text-center border border-gray-700/50">
                    <p className="text-sm font-medium text-indigo-300 uppercase tracking-wider">Typical Distribution Period</p>
                    <p className="text-2xl font-bold text-gray-100 mt-1.5">{protocolInfo.distributionPeriod}</p>
                </div>
            </div>
        </section>
      )}
    </div>
  );
};

export default RevenueDashboard;
