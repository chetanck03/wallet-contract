import React, { useState, useEffect } from 'react';
import { useWallet } from '../hooks/useWallet';

// Example Icons
const InfoIcon = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
  </svg>
);
const ArrowRightIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 ml-2 group-hover:translate-x-0.5 transition-transform"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>;


const PresaleActions = () => {
  const { account, connectWallet, error: walletError } = useWallet();
  
  const [amount, setAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [transactionFeedback, setTransactionFeedback] = useState('');

  const [presaleData, setPresaleData] = useState({
    isActive: true,
    roundName: 'Seed Round - Phase 1',
    tokenPriceUSD: '0.10',
    paymentSymbol: 'USDC',
    minPurchaseBFT: 500,
    maxPurchaseBFT: 50000,
    tokensSoldBFT: 1850000,
    roundGoalBFT: 5000000,
    presaleEndTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    userContributionBFT: 0,
    bonusInfo: '10% bonus for purchases over 10,000 BFT',
    stablecoinDecimals: 6,
    bftDecimals: 18,
  });
  const [userPaymentTokenBalance, setUserPaymentTokenBalance] = useState('1250.75');

  useEffect(() => {
    if (account) {
      setUserPaymentTokenBalance('1250.75'); 
      setPresaleData(prev => ({ ...prev, userContributionBFT: 1250 })); 
    } else {
      setUserPaymentTokenBalance('0.00');
      setPresaleData(prev => ({ ...prev, userContributionBFT: 0 }));
    }
  }, [account]);

  const handleBuyTokens = async () => {
    if (!account) { setTransactionFeedback('Please connect your wallet first.'); return; }
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) { setTransactionFeedback('Please enter a valid amount of BFT to buy.'); return; }
    if (numericAmount < presaleData.minPurchaseBFT) { setTransactionFeedback(`Minimum purchase is ${presaleData.minPurchaseBFT} BFT.`); return; }
    if (numericAmount > presaleData.maxPurchaseBFT) { setTransactionFeedback(`Maximum purchase is ${presaleData.maxPurchaseBFT} BFT.`); return; }

    setIsProcessing(true);
    setTransactionFeedback('Simulating transaction processing (approve & buy)...');
    await new Promise(resolve => setTimeout(resolve, 3000));

    if (Math.random() > 0.05) {
      setTransactionFeedback(`Successfully purchased ${numericAmount.toLocaleString()} BFT! (Simulated)`);
      setPresaleData(prev => ({
        ...prev,
        userContributionBFT: prev.userContributionBFT + numericAmount,
        tokensSoldBFT: prev.tokensSoldBFT + numericAmount,
      }));
      setAmount('');
    } else {
      setTransactionFeedback('Transaction failed. Please try again. (Simulated)');
    }
    setIsProcessing(false);
  };

  const calculatedCost = amount && presaleData.tokenPriceUSD 
    ? (parseFloat(amount) * parseFloat(presaleData.tokenPriceUSD)).toFixed(presaleData.stablecoinDecimals) 
    : '0.00';
  
  const progressPercentage = presaleData.roundGoalBFT > 0 
    ? (presaleData.tokensSoldBFT / presaleData.roundGoalBFT) * 100 
    : 0;

  if (walletError && !account) {
    return (
      <div className="max-w-lg mx-auto bg-red-800/40 backdrop-blur-sm p-6 rounded-xl shadow-2xl my-10 border border-red-600/50 text-center">
        <h3 className="text-2xl font-semibold text-red-300 mb-3">Wallet Connection Error</h3>
        <p className="text-red-200 mb-4">{walletError}</p>
        <p className="text-gray-400">Please ensure your wallet is installed, unlocked, and connected correctly.</p>
      </div>
    );
  }

  const PresaleStat = ({ label, value, subValue = '' , className = '' }) => (
    <div className={`py-3 ${className}`}>
      <p className="text-xs text-indigo-300 uppercase tracking-wider font-medium">{label}</p>
      <p className="text-xl font-semibold text-gray-100">{value}</p>
      {subValue && <p className="text-xs text-gray-400">{subValue}</p>}
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto py-8 sm:py-12 px-4 sm:px-0 space-y-12">
      <header className="text-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-indigo-500 to-pink-500">
            BitFrac Token Presale
          </span>
        </h1>
        <p className="text-xl text-gray-300">Be an Early Adopter. Secure Your BFT Tokens Now.</p>
        {!presaleData.isActive && (
            <p className="mt-8 text-2xl text-yellow-300 p-5 bg-yellow-700/30 rounded-lg border border-yellow-600/50 shadow-lg">
              The presale is currently <span className="font-bold">NOT ACTIVE</span>.
            </p>
        )}
      </header>

      {presaleData.isActive && (
        <div className="bg-gray-800/70 backdrop-blur-xl p-6 sm:p-8 rounded-2xl shadow-2xl border border-gray-700/60">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 pb-6 border-b border-gray-700/50">
            <h2 className="text-2xl font-semibold text-indigo-300 mb-2 sm:mb-0">{presaleData.roundName}</h2>
            <div className="flex items-center px-3.5 py-1.5 text-sm font-semibold text-green-200 bg-green-600/40 rounded-full shadow-md ring-1 ring-green-500/70">
              <span className="w-2.5 h-2.5 bg-green-400 rounded-full mr-2.5 animate-pulse"></span> ACTIVE
            </div>
          </div>

          <div className="mb-8">
            <div className="flex justify-between text-sm text-gray-200 mb-1.5">
              <span>Round Progress</span>
              <span className="font-semibold">{progressPercentage.toFixed(2)}%</span>
            </div>
            <div className="w-full bg-gray-700/80 rounded-full h-3.5 shadow-inner overflow-hidden">
              <div 
                className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-600 h-3.5 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-gray-400 mt-2">
                <span>{presaleData.tokensSoldBFT.toLocaleString()} BFT Sold</span>
                <span>Goal: {presaleData.roundGoalBFT.toLocaleString()} BFT</span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-5 gap-y-3 mb-8 text-center sm:text-left">
            <PresaleStat label="Token Price" value={`${presaleData.tokenPriceUSD} ${presaleData.paymentSymbol}/BFT`} />
            <PresaleStat label="Min Purchase" value={`${presaleData.minPurchaseBFT.toLocaleString()} BFT`} />
            <PresaleStat label="Max Purchase" value={`${presaleData.maxPurchaseBFT.toLocaleString()} BFT`} />
            <PresaleStat label="Round Ends" value={new Date(presaleData.presaleEndTime).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })} />
            {account && <PresaleStat label="Your Contribution" value={`${presaleData.userContributionBFT.toLocaleString()} BFT`} />}
            {account && <PresaleStat label="Your Balance" value={`${userPaymentTokenBalance} ${presaleData.paymentSymbol}`} />}
          </div>
          {presaleData.bonusInfo && 
            <div className="flex items-center text-sm text-center text-purple-300 bg-purple-800/40 p-3.5 rounded-lg mb-8 border border-purple-700/50 shadow">
                <InfoIcon className="w-5 h-5 mr-2 flex-shrink-0 text-purple-400"/> {presaleData.bonusInfo}
            </div>
          }

          {account ? (
            <div className="space-y-6 pt-6 border-t border-gray-700/50">
              <div>
                <label htmlFor="amountBFT" className="block text-sm font-medium text-gray-200 mb-1.5">Amount of BFT to Purchase</label>
                <input 
                  type="number" 
                  id="amountBFT" 
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)} 
                  placeholder={`Min ${presaleData.minPurchaseBFT.toLocaleString()}`}
                  className="w-full p-4 rounded-lg bg-gray-700/80 border-2 border-gray-600/80 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/70 text-white shadow-sm transition-colors text-lg placeholder-gray-500"
                  disabled={isProcessing}
                />
              </div>
              {amount && parseFloat(amount) > 0 && (
                <div className="p-4 bg-gray-700/70 rounded-lg shadow-inner space-y-1">
                  <p className="flex justify-between text-gray-300"><span>Estimated Cost:</span> <span className="font-bold text-xl text-indigo-300">{calculatedCost} {presaleData.paymentSymbol}</span></p>
                  <p className="text-xs text-gray-400">Final cost subject to network conditions. Bonus tokens will be applied if eligible.</p>
                </div>
              )}
              <button 
                onClick={handleBuyTokens} 
                className="group w-full bg-gradient-to-r from-indigo-600 to-purple-700 hover:from-indigo-700 hover:to-purple-800 text-white font-semibold py-4 px-6 rounded-lg shadow-xl hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-150 ease-in-out disabled:opacity-70 disabled:cursor-not-allowed text-base focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900 flex items-center justify-center"
                disabled={isProcessing || !amount || parseFloat(amount) <= 0}
              >
                {isProcessing ? 'Processing Purchase...' : `Buy ${amount ? parseFloat(amount).toLocaleString() : ''} BFT Now`}
                {!isProcessing && <ArrowRightIcon />}
              </button>
            </div>
          ) : (
            <div className="mt-10 text-center p-8 bg-gradient-to-br from-indigo-900/50 to-purple-900/50 rounded-xl border border-indigo-700/60 shadow-xl">
              <h4 className="text-xl font-semibold text-indigo-200 mb-4">Get Started with BitFrac</h4>
              <p className="text-gray-300 mb-6">Connect your wallet to participate in the token presale and shape the future of RWA tokenization.</p>
              <button 
                onClick={connectWallet} 
                className="group bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold py-3.5 px-10 rounded-lg shadow-lg hover:shadow-xl transition-all duration-150 ease-in-out text-base transform hover:scale-105 flex items-center justify-center mx-auto"
              >
                Connect Wallet to Participate <ArrowRightIcon />
              </button>
            </div>
          )}
          {transactionFeedback && (
            <p className={`mt-6 p-4 rounded-lg text-center font-medium shadow-md text-sm ${transactionFeedback.toLowerCase().includes('error') || transactionFeedback.toLowerCase().includes('please') ? 'bg-red-800/50 text-red-100 border border-red-700/60' : 'bg-green-800/50 text-green-100 border border-green-700/60'}`}>
              {transactionFeedback}
            </p>
          )}
        </div>
      )}

      {!presaleData.isActive && account && presaleData.userContributionBFT > 0 && (
          <div className="mt-12 bg-gray-800/70 backdrop-blur-xl p-6 sm:p-8 rounded-2xl shadow-2xl border border-gray-700/60 text-center">
              <h3 className="text-2xl font-semibold text-purple-300 mb-4">Presale Ended: Claim Your Tokens</h3>
              <p className="text-gray-300 mb-6">The presale round has concluded. If you participated, you can now claim your purchased BFT tokens.</p>
              <p className="text-lg text-white mb-6">You can claim: <span className="font-bold text-xl">{presaleData.userContributionBFT.toLocaleString()} BFT</span></p>
              <button 
                className="group bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white font-bold py-3.5 px-10 rounded-lg shadow-lg hover:shadow-xl transition-all duration-150 ease-in-out text-base transform hover:scale-105 flex items-center justify-center mx-auto"
                disabled={isProcessing || presaleData.userContributionBFT === 0}
              >
                {isProcessing ? 'Processing Claim...' : 'Claim My BFT Tokens'} {!isProcessing && <ArrowRightIcon />}
              </button>
          </div>
      )}
    </div>
  );
};

export default PresaleActions;
