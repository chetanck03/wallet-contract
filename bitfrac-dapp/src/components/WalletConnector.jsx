// src/components/WalletConnector.jsx
import React from 'react';
import { useWallet } from '../hooks/useWallet';

function WalletConnector() {
    const { account, network, error, connectWallet, disconnectWallet } = useWallet();

    return (
        <div>
            {error && <p style={{ color: 'red' }}>Error: {error}</p>}
            {account ? (
                <div>
                    <p>Connected Account: {account}</p>
                    <p>Network: {network ? `${network.name} (Chain ID: ${network.chainId})` : 'Loading...'}</p>
                    <button onClick={disconnectWallet}>Disconnect Wallet</button>
                </div>
            ) : (
                <button onClick={connectWallet}>Connect MetaMask</button>
            )}
        </div>
    );
}

export default WalletConnector;