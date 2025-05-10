// src/config.js
// Replace with your actual deployed contract addresses and ABIs
// Testnet (e.g., Sepolia)
export const BITFRAC_TOKEN_ADDRESS = "YOUR_BITFRAC_TOKEN_ADDRESS";
export const BITFRAC_PRESALE_ADDRESS = "YOUR_BITFRAC_PRESALE_ADDRESS";
export const BITFRAC_REVENUE_DIST_ADDRESS = "YOUR_BITFRAC_REVENUE_DIST_ADDRESS";

// Import your ABIs (assuming they are in src/abis/)
import BitFracTokenAbi from './abis/BitFracToken.json';
import BitFracPresaleAbi from './abis/BitFracPresale.json';
import BitFracRevenueDistributionAbi from './abis/BitFracRevenueDistribution.json';

export const BITFRAC_TOKEN_ABI = BitFracTokenAbi.abi; // Adjust if ABI structure is different
export const BITFRAC_PRESALE_ABI = BitFracPresaleAbi.abi;
export const BITFRAC_REVENUE_DIST_ABI = BitFracRevenueDistributionAbi.abi;

// Add Stablecoin address if you are using one for revenue distribution (for testnet)
export const STABLECOIN_ADDRESS_FOR_REVENUE = "STABLECOIN_ON_TESTNET_ADDRESS";

// Decimals for input currencies (smallest unit)
// This is crucial for the frontend to send the correct 'amount' to registerInvestment
export const CURRENCY_DECIMALS = {
    "BTC": 8,  // User inputs BTC amount, frontend converts to satoshis * 10^0 for the 'amount' field? Or just satoshis directly.
               // The contract expects amount in satoshis.
    "ETH": 18, // User inputs ETH, frontend converts to wei. Contract expects wei.
    "XRP": 6,  // Example, ensure this matches how you want to handle XRP input and contract expectation.
    "DOGE": 8, // Example
    "USDT": 6  // Example for USDT (usually 6 or 18 depending on the version)
};