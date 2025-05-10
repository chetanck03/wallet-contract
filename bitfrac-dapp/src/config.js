import BitFracTokenAbi from './abis/BitFracToken.json';
import BitFracPresaleAbi from './abis/BitFracPresale.json';
import BitFracRevenueDistributionAbi from './abis/BitFracRevenueDistribution.json';
import MockStableCoinAbi from './abis/MockStableCoin.json'; // ABI for MockStableCoin

// Deployed contract addresses on Sepolia testnet
const CONTRACT_ADDRESSES = {
  bitFracToken: '0x39b9271A02b44Dfdf0bD74eF72dE40644D86C571',
  bitFracPresale: '0x0Cd48D51b605cbc4840B43AF0d8555A007Aa6378',
  bitFracRevenueDistribution: '0x5d9c0851A7808B73C751BB074d666d6478f9C24E',
  mockStableCoin: '0x457c6491c2A1F85F0B01Cf75C25580A2523eD420',
};

const CHAIN_ID = '0xaa36a7'; // Sepolia testnet (ID: 11155111)

export const bitFracTokenConfig = {
  address: CONTRACT_ADDRESSES.bitFracToken,
  abi: BitFracTokenAbi.abi || BitFracTokenAbi, // Handles if abi is nested or direct
};

export const bitFracPresaleConfig = {
  address: CONTRACT_ADDRESSES.bitFracPresale,
  abi: BitFracPresaleAbi.abi || BitFracPresaleAbi, // Handles if abi is nested or direct
};

export const bitFracRevenueDistributionConfig = {
  address: CONTRACT_ADDRESSES.bitFracRevenueDistribution,
  abi: BitFracRevenueDistributionAbi.abi || BitFracRevenueDistributionAbi, // Handles if abi is nested or direct
};

export const mockStableCoinConfig = {
  address: CONTRACT_ADDRESSES.mockStableCoin,
  abi: MockStableCoinAbi, // MockStableCoin.json is an array (the ABI itself)
};

export const appConfig = {
    CHAIN_ID,
    CONTRACT_ADDRESSES
};

// Helper function to get contract instance
// import { ethers } from 'ethers';
// export const getContract = (config, providerOrSigner) => {
//   return new ethers.Contract(config.address, config.abi, providerOrSigner);
// };
