# BitFrac (BFC) Smart Contracts

This repository contains the smart contracts for the BitFrac (BFC) token ecosystem, which bridges digital finance with real-world mining infrastructure.

## Overview

BitFrac (BFC) is a pioneering ERC-20 token project that offers fractionalized ownership of high-performance crypto mining infrastructure housed within secure, revenue-generating industrial facilities. The project democratizes access to traditionally high-barrier investments and makes crypto mining profits available to everyone.

## Key   

- **Fractional Ownership**: Tokenized ownership of industrial-grade crypto mining operations
- **Revenue Sharing**: BFC holders receive returns from actual mining activity
- **Asset-Backed Tokens**: Backed by real, operational infrastructure 
- **Multi-Currency Support**: Accepts investments in BTC, ETH, XRP, and DOGE
- **Staking Rewards**: Earn additional tokens by staking your BFC

## Smart Contracts

The BitFrac ecosystem consists of three main contracts:

### BitFracToken.sol

The core ERC-20 token contract with:
- Total supply of 55 million BFC tokens
- 7 presale rounds with increasing token prices
- Built-in staking mechanism
- Mining revenue distribution capabilities

### BitFracPresale.sol

Manages the presale process with:
- Multi-cryptocurrency support (BTC, ETH, XRP, DOGE)
- Manual verification of external blockchain transactions
- Token allocation with round-specific bonuses
- Ability to add/update payment addresses

### BitFracRevenueDistribution.sol

Handles revenue distribution from mining operations:
- Creates revenue pools from mining profits
- Distributes revenue based on token holdings
- Tracks mining facilities and hash rates
- Allows transparent claiming of mining profits

## Token Economics

- **Total Supply**: 55,000,000 BFC
- **Distribution**:
  - Presale: 30,000,000 BFC (55%)
  - Team: 5,500,000 BFC (10%)
  - Mining Rewards: 13,750,000 BFC (25%)
  - Marketing: 5,500,000 BFC (10%)

## Presale Rounds

BitFrac will be offered through 7 presale rounds:

| Round | Price (USD) | Tokens Available | Bonus |
|-------|-------------|------------------|-------|
| 1     | $0.04       | 4,285,714        | 20%   |
| 2     | $0.045      | 4,285,714        | 15%   |
| 3     | $0.05       | 4,285,714        | 10%   |
| 4     | $0.055      | 4,285,714        | 7%    |
| 5     | $0.06       | 4,285,714        | 5%    |
| 6     | $0.065      | 4,285,714        | 3%    |
| 7     | $0.07       | 4,285,716        | 0%    |

## Payment Addresses

Investors can make payments using the following cryptocurrencies:

- **BTC**: bc1q5j59e3dsggy9a5lemx202xzymlxzzn4dx6uqh2
- **ETH**: 0x5230785a457e673E290eDcEEc1Fc065115762A22
- **XRP**: rTuKnJH5LyVCtvTUTjJ2DvTJcDP1KkmrM
- **DOGE**: D67ZgbZYPeqyUCSHEKD9MwPMB6PB2MorLn

## Development

### Requirements

- Node.js
- npm or yarn
- Hardhat
- OpenZeppelin Contracts

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/bitfrac-contracts.git
cd bitfrac-contracts

# Install dependencies
npm install

# Compile contracts
npx hardhat compile
```

### Deployment

To deploy the contracts to a network:

```bash
npx hardhat run scripts/deploy.js --network <network-name>
```

## License

These contracts are licensed under the MIT License. 