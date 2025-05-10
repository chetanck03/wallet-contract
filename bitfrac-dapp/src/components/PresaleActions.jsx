// src/components/PresaleActions.jsx
import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useWallet } from '../hooks/useWallet';
import { BITFRAC_PRESALE_ADDRESS, BITFRAC_PRESALE_ABI, CURRENCY_DECIMALS } from '../config';

function PresaleActions() {
    const { signer, account, provider } = useWallet();
    const [presaleContract, setPresaleContract] = useState(null);
    const [paymentAddresses, setPaymentAddresses] = useState([]);
    const [currency, setCurrency] = useState('ETH'); // Default currency
    const [amount, setAmount] = useState(''); // Amount in smallest unit
    const [txHash, setTxHash] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (signer) {
            const contract = new ethers.Contract(BITFRAC_PRESALE_ADDRESS, BITFRAC_PRESALE_ABI, signer);
            setPresaleContract(contract);
        }
    }, [signer]);

    const fetchPaymentAddresses = async () => {
        if (!presaleContract) return;
        try {
            // getSupportedPaymentMethods returns [string[] currencies, string[] addresses]
            const [currencies, addresses] = await presaleContract.getSupportedPaymentMethods();
            const combined = currencies.map((c, i) => ({ currency: c, address: addresses[i] }));
            setPaymentAddresses(combined);
        } catch (error) {
            console.error("Error fetching payment addresses:", error);
            setMessage(`Error fetching payment addresses: ${error.message}`);
        }
    };

    const handleRegisterInvestment = async (e) => {
        e.preventDefault();
        if (!presaleContract || !amount || !txHash || !currency) {
            setMessage("Please fill all fields and connect wallet.");
            return;
        }
        setMessage('Processing...');
        try {
            // Ensure 'amount' is in the smallest unit of the currency
            // Example: If user enters "1" ETH, amount should be "1000000000000000000" (wei)
            // The CURRENCY_DECIMALS in config can help the UI convert user input to smallest unit.
            // For this example, we assume 'amount' state already holds the value in smallest unit.

            const tx = await presaleContract.registerInvestment(currency, txHash, ethers.parseUnits(amount, CURRENCY_DECIMALS[currency]));
            await tx.wait();
            setMessage(`Investment registered successfully! Tx: ${tx.hash}`);
        } catch (error) {
            console.error("Error registering investment:", error);
            setMessage(`Error: ${error?.data?.message || error.message}`);
        }
    };

    return (
        <div>
            <h3>Presale Actions</h3>
            <button onClick={fetchPaymentAddresses}>Show Payment Addresses</button>
            {paymentAddresses.length > 0 && (
                <ul>
                    {paymentAddresses.map(pa => (
                        <li key={pa.currency}>{pa.currency}: {pa.address}</li>
                    ))}
                </ul>
            )}

            <form onSubmit={handleRegisterInvestment}>
                <h4>Register Your Investment (After sending crypto manually)</h4>
                <div>
                    <label>Currency Sent: </label>
                    <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
                        <option value="BTC">BTC</option>
                        <option value="ETH">ETH</option>
                        <option value="USDT_on_ETH">USDT (on ETH)</option> {/* Add if you support USDT */}
                        <option value="XRP">XRP</option>
                        <option value="DOGE">DOGE</option>
                    </select>
                </div>
                <div>
                    <label>Amount Sent (e.g., 1.5 for ETH, 0.05 for BTC): </label>
                    <input type="text" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="e.g., 1.5" />
                     {/* UI should convert this to smallest unit using CURRENCY_DECIMALS[currency] before calling contract */}
                </div>
                <div>
                    <label>Transaction Hash: </label>
                    <input type="text" value={txHash} onChange={(e) => setTxHash(e.target.value)} placeholder="0x..." />
                </div>
                <button type="submit" disabled={!signer}>Register Investment</button>
            </form>
            {message && <p>{message}</p>}
            <p style={{fontSize: '0.8em', color: 'gray'}}>
                Note for UI: The 'Amount Sent' field should be user-friendly (e.g., "1.5" ETH).
                Your frontend code will need to convert this to the currency's smallest unit
                (e.g., wei for ETH, satoshis for BTC) using `ethers.parseUnits(userInput, decimals)`
                before sending it to the `registerInvestment` function. The `amount` state above
                should ideally store this user-friendly value, and conversion happens upon submission.
                The `CURRENCY_DECIMALS` in `config.js` is for this purpose.
            </p>
        </div>
    );
}
export default PresaleActions;