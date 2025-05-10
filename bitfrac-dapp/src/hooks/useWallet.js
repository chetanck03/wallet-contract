// src/hooks/useWallet.js
import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';

export const useWallet = () => {
    const [account, setAccount] = useState(null);
    const [provider, setProvider] = useState(null);
    const [signer, setSigner] = useState(null);
    const [error, setError] = useState('');
    const [network, setNetwork] = useState(null);

    const connectWallet = useCallback(async () => {
        if (typeof window.ethereum !== 'undefined') {
            try {
                setError('');
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                setAccount(accounts[0]);

                const web3Provider = new ethers.BrowserProvider(window.ethereum);
                setProvider(web3Provider);

                const signerInstance = await web3Provider.getSigner();
                setSigner(signerInstance);

                const net = await web3Provider.getNetwork();
                setNetwork(net);

            } catch (err) {
                console.error("Error connecting wallet:", err);
                if (err.code === 4001) {
                    setError('Connection rejected by user.');
                } else {
                    setError(err.message || 'Error connecting wallet.');
                }
                setAccount(null);
                setProvider(null);
                setSigner(null);
                setNetwork(null);
            }
        } else {
            setError('MetaMask is not installed. Please install it to use this DApp.');
        }
    }, []);

    const disconnectWallet = () => {
        setAccount(null);
        setProvider(null);
        setSigner(null);
        setNetwork(null);
        // You might want to add logic to clear other relevant state in your app
    };

    useEffect(() => {
        if (window.ethereum) {
            window.ethereum.on('accountsChanged', (accounts) => {
                if (accounts.length > 0) {
                    setAccount(accounts[0]);
                    // Re-initialize provider and signer if account changes
                    const web3Provider = new ethers.BrowserProvider(window.ethereum);
                    setProvider(web3Provider);
                    web3Provider.getSigner().then(setSigner);
                } else {
                    disconnectWallet();
                }
            });

            window.ethereum.on('chainChanged', (_chainId) => {
                // Reload the page or re-initialize app state for the new network
                window.location.reload();
            });
        }
    }, []);

    return { account, provider, signer, network, error, connectWallet, disconnectWallet };
};