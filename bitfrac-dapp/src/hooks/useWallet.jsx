import { useState, createContext, useContext, useCallback } from 'react';
import { ethers } from 'ethers';

const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [error, setError] = useState(null);

  const connectWallet = useCallback(async () => {
    if (window.ethereum) {
      try {
        const web3Provider = new ethers.BrowserProvider(window.ethereum);
        await web3Provider.send("eth_requestAccounts", []);
        const currentSigner = await web3Provider.getSigner();
        const connectedAccount = await currentSigner.getAddress();

        setProvider(web3Provider);
        setSigner(currentSigner);
        setAccount(connectedAccount);
        setError(null);

        // Listen for account changes
        window.ethereum.on('accountsChanged', (accounts) => {
          if (accounts.length > 0) {
            setAccount(accounts[0]);
            // Update signer as well if needed
            (async () => {
              const newSigner = await web3Provider.getSigner();
              setSigner(newSigner);
            })();
          } else {
            disconnectWallet();
          }
        });

        // Listen for chain changes
        window.ethereum.on('chainChanged', () => {
          // For simplicity, we reload the page. You might want a more sophisticated handling.
          window.location.reload();
        });

      } catch (err) {
        console.error("Error connecting to wallet:", err);
        setError(err.message || 'Failed to connect wallet.');
        setAccount(null);
        setProvider(null);
        setSigner(null);
      }
    } else {
      alert("Please install MetaMask or another Ethereum-compatible browser extension!");
      setError('MetaMask not detected.');
    }
  }, []);

  const disconnectWallet = useCallback(() => {
    setAccount(null);
    setProvider(null);
    setSigner(null);
    setError(null);
    // Optional: Add logic to clear any other wallet-related state in your app
    console.log("Wallet disconnected");
  }, []);

  return (
    <WalletContext.Provider value={{ account, provider, signer, error, connectWallet, disconnectWallet }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => useContext(WalletContext);
