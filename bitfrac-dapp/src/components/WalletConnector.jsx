import React, { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { useWallet } from '../hooks/useWallet';
import { bitFracTokenConfig } from '../config'; // Assuming this path is correct

// Placeholder for a User/Account Icon
const UserCircleIconSm = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-indigo-300">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-5.5-2.5a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0zM10 12a5.99 5.99 0 00-4.793 2.39A6.483 6.483 0 0010 16.5a6.483 6.483 0 004.793-2.11A5.99 5.99 0 0010 12z" clipRule="evenodd" />
    </svg>
);

const WalletIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12V7.5M21 12H3M21 12C21 12.75 20.75 13.5 20.25 14.1C19.75 14.7 19 15 18 15H6C5 15 4.25 14.7 3.75 14.1C3.25 13.5 3 12.75 3 12M3 12V7.5A2.25 2.25 0 015.25 5.25H18.75A2.25 2.25 0 0121 7.5M7.5 21H16.5M7.5 17.25H16.5" />
    </svg>
);

const WalletConnector = ({ isMobileView = false }) => { // Added isMobileView prop
  const { account, provider, connectWallet, disconnectWallet, error } = useWallet();
  const [bftBalance, setBftBalance] = useState('0');
  const [bftSymbol, setBftSymbol] = useState('BFT');
  // const [bftDecimals, setBftDecimals] = useState(18); // We get this from contract

  const fetchBftData = useCallback(async () => {
    if (account && provider && bitFracTokenConfig && bitFracTokenConfig.address && bitFracTokenConfig.abi) {
      try {
        const tokenContract = new ethers.Contract(bitFracTokenConfig.address, bitFracTokenConfig.abi, provider);
        
        const [balance, decimals, symbol] = await Promise.all([
          tokenContract.balanceOf(account),
          tokenContract.decimals(), // Assuming your BFT contract has a decimals function
          tokenContract.symbol()    // Assuming your BFT contract has a symbol function
        ]);

        // setBftDecimals(Number(decimals)); // Not strictly needed to store if only used here
        setBftBalance(ethers.formatUnits(balance, Number(decimals)));
        setBftSymbol(symbol);
      } catch (err) {
        console.error("Error fetching BFT data:", err);
        setBftBalance('Error');
      }
    } else {
      // Reset if account or provider is not available, or config is missing
      setBftBalance('0');
      setBftSymbol('BFT');
    }
  }, [account, provider]);

  useEffect(() => {
    fetchBftData();
  }, [fetchBftData]);
  
  useEffect(() => {
    if (window.ethereum) {
      const handleAccountsChanged = (accounts) => {
        fetchBftData(); 
      };
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      };
    }
  }, [fetchBftData]);

  if (!account) {
    // For mobile view, stack button and error, center them
    const buttonContainerClass = isMobileView ? "flex flex-col items-center w-full" : "";
    const buttonClass = isMobileView 
        ? "group w-full max-w-xs flex items-center justify-center bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold py-3 px-5 rounded-lg shadow-md hover:shadow-lg transition-all duration-150 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900"
        : "group flex items-center justify-center bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold py-2.5 px-5 rounded-lg shadow-md hover:shadow-lg transition-all duration-150 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900";
    return (
        <div className={buttonContainerClass}> 
            <button 
                onClick={connectWallet} 
                className={buttonClass}
            >
                <WalletIcon /> Connect Wallet
            </button>
            {error && <p className="text-xs text-red-400 mt-2 text-center px-2 break-words">Error: {typeof error === 'string' ? error : error.message}</p>}
        </div>
    );
  }

  // Connected State - Different rendering for mobile view
  if (isMobileView) {
    return (
      <div className="flex flex-col items-center space-y-3 w-full py-2">
        <div className="text-center p-3 bg-gray-700/70 rounded-lg shadow-md w-full max-w-xs">
            <p className="text-xs text-indigo-300 uppercase tracking-wider">Connected Wallet</p>
            <p className="text-sm font-medium text-gray-100 break-all">
                {account}
            </p>
            <hr className="border-gray-600/70 my-2" />
            <p className="text-xs text-indigo-300 uppercase tracking-wider">Balance</p>
            <p className="text-lg font-bold text-gray-100">
                {parseFloat(bftBalance).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: bftBalance === 'Error' ? 2 : 4 })}
                <span className="ml-1.5 text-sm text-indigo-300">{bftSymbol}</span>
            </p>
        </div>
        <button 
            onClick={disconnectWallet} 
            title="Disconnect Wallet"
            className="w-full max-w-xs flex items-center justify-center p-2.5 bg-red-600/80 hover:bg-red-700/80 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-150 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-900 text-sm font-semibold"
        >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 mr-2"><path fillRule="evenodd" d="M3 4.25A2.25 2.25 0 015.25 2h5.5A2.25 2.25 0 0113 4.25v2a.75.75 0 01-1.5 0v-2a.75.75 0 00-.75-.75h-5.5a.75.75 0 00-.75.75v11.5c0 .414.336.75.75.75h5.5a.75.75 0 00.75-.75v-2a.75.75 0 011.5 0v2A2.25 2.25 0 0110.75 18h-5.5A2.25 2.25 0 013 15.75V4.25z" clipRule="evenodd" /><path fillRule="evenodd" d="M6 10a.75.75 0 01.75-.75h9.546l-1.048-1.047a.75.75 0 111.06-1.06l2.5 2.5a.75.75 0 010 1.06l-2.5 2.5a.75.75 0 11-1.06-1.06L16.296 10.75H6.75A.75.75 0 016 10z" clipRule="evenodd" /></svg>
            Disconnect
        </button>
        {error && account && <p className="text-xs text-red-400 mt-1.5 text-center px-2 break-words">Error: {typeof error === 'string' ? error : error.message}</p>}
      </div>
    );
  }

  // Default Desktop Connected State (with hover dropdown)
  return (
    <div className="flex items-center space-x-3">
      <div className="relative group">
        <button className="flex items-center p-2 bg-gray-700/70 hover:bg-gray-600/70 rounded-lg shadow-md transition-colors duration-150">
          <UserCircleIconSm />
          <span className="ml-2 text-sm font-medium text-gray-200 hidden sm:inline">
            {`${account.substring(0, 6)}...${account.substring(account.length - 4)}`}
          </span>
        </button>
        {/* Tooltip / Dropdown for details - vertical layout */}
        <div className="absolute top-full right-0 mt-2 w-64 bg-gray-700/95 backdrop-blur-xl rounded-xl shadow-2xl border border-gray-600/50 p-4 z-20 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 invisible group-hover:visible group-focus-within:visible transition-all duration-200 ease-in-out transform group-hover:translate-y-0 translate-y-1">
          <div className="space-y-3">
            <div>
              <p className="text-xs text-indigo-300 uppercase tracking-wider">Connected Wallet</p>
              <p className="text-sm font-medium text-gray-100 break-all">
                {account}
              </p>
            </div>
            <hr className="border-gray-600/70" />
            <div>
              <p className="text-xs text-indigo-300 uppercase tracking-wider">Balance</p>
              <p className="text-lg font-bold text-gray-100">
                {parseFloat(bftBalance).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: bftBalance === 'Error' ? 2 : 4 })}
                <span className="ml-1.5 text-sm text-indigo-300">{bftSymbol}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
      <button 
        onClick={disconnectWallet} 
        title="Disconnect Wallet"
        className="p-2.5 bg-red-600/80 hover:bg-red-700/80 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-150 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-900"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M3 4.25A2.25 2.25 0 015.25 2h5.5A2.25 2.25 0 0113 4.25v2a.75.75 0 01-1.5 0v-2a.75.75 0 00-.75-.75h-5.5a.75.75 0 00-.75.75v11.5c0 .414.336.75.75.75h5.5a.75.75 0 00.75-.75v-2a.75.75 0 011.5 0v2A2.25 2.25 0 0110.75 18h-5.5A2.25 2.25 0 013 15.75V4.25z" clipRule="evenodd" /><path fillRule="evenodd" d="M6 10a.75.75 0 01.75-.75h9.546l-1.048-1.047a.75.75 0 111.06-1.06l2.5 2.5a.75.75 0 010 1.06l-2.5 2.5a.75.75 0 11-1.06-1.06L16.296 10.75H6.75A.75.75 0 016 10z" clipRule="evenodd" /></svg>
      </button>
      {/* Error display for wallet connection if not already handled by connectWallet prompt */}
      {error && account && <p className="text-xs text-red-400 mt-1.5 absolute right-0 top-full">Error: {error.message || error}</p>}
    </div>
  );
};

export default WalletConnector;
