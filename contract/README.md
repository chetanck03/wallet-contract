# BitFrac Smart Contracts Overview

This folder contains the Solidity smart contracts for the BitFrac project. These contracts manage the BitFrac Token (BFC), its presale, staking, and revenue distribution from mining operations.

## Contracts

### 1. `BitFracToken.sol`

*   **Type:** ERC-20 Token (`BFC`)
*   **Total Supply:** 1,000,000 BFC (fixed)
*   **Functionality:**
    *   Standard ERC-20 operations (transfer, balanceOf, etc.).
    *   **Ownable:** Administrative functions are restricted to the owner.
    *   **Burnable:** Tokens can be burned, reducing total supply.
    *   **Snapshot:** Allows capturing token balances at specific points in time, crucial for revenue distribution.
    *   **Presale Rounds:** Defines 7 presale rounds with increasing prices and decreasing token bonuses. Manages token allocations for presale, team, mining rewards, and marketing.
    *   **Staking:**
        *   Allows BFC holders to stake their tokens for a defined period.
        *   Rewards for staking are minted from the `MINING_REWARDS` allocation.
        *   Configurable staking reward rate and minimum staking period.
    *   **Reentrancy Guard:** Protects against reentrancy attacks on certain functions.

### 2. `BitFracPresale.sol`

*   **Functionality:**
    *   Manages the multi-stage presale of BFC tokens.
    *   **Multi-Currency Acceptance:**
        *   Facilitates investments using BTC, ETH, XRP, and DOGE.
        *   Investors send funds to designated external wallet addresses.
        *   Transactions are registered on-chain by the investor (`registerInvestment`).
        *   An administrator verifies the off-chain payment and calls `verifyInvestment` to allocate BFC tokens (including bonuses) to the investor. This process utilizes the `addPresaleInvestor` function in `BitFracToken.sol`.
    *   **Price Oracles:**
        *   Uses Chainlink price feeds (for ETH, BTC) to determine the USD value of investments.
        *   Uses manually set prices for currencies without direct Chainlink feeds (XRP, DOGE).
    *   **Round Management:** Associates investments with the correct presale round active at the time of registration.
    *   **Ownable & Reentrancy Guard.**

### 3. `BitFracRevenueDistribution.sol`

*   **Functionality:**
    *   Manages the distribution of revenue generated from mining operations to BFC token holders.
    *   **Revenue Pools:**
        *   The owner creates revenue pools by depositing a stablecoin (e.g., USDT, USDC) into this contract.
        *   Each pool is tied to a snapshot of BFC token balances taken via `BitFracToken.sol`'s snapshot feature.
    *   **Claiming Revenue:**
        *   Eligible BFC holders (those holding a minimum number of tokens at the time of the snapshot) can claim their share of the revenue pool.
        *   Revenue is distributed proportionally to the amount of BFC held at the snapshot.
    *   **Snapshot Integration:** Relies on `BitFracToken.triggerSnapshot()` to capture token holder balances for fair distribution.
    *   **Mining Facility Tracking:** Includes functionality to add and manage information about mining facilities (name, location, hashrate), though this is primarily for informational purposes on-chain.
    *   **Ownable & Reentrancy Guard.**
    *   **Stablecoin Payouts:** Revenue is distributed in a designated stablecoin.

## Workflow Summary

1.  **Deployment:**
    *   Deploy `BitFracToken.sol`.
    *   Deploy `BitFracPresale.sol`, providing the `BitFracToken` address.
    *   Deploy `BitFracRevenueDistribution.sol`, providing `BitFracToken` and the chosen stablecoin contract addresses.
2.  **Presale:**
    *   Owner starts presale rounds via `BitFracToken.startNextRound()`.
    *   Investors view accepted cryptocurrencies and wallet addresses via `BitFracPresale.getPaymentAddress()` or `BitFracPresale.getSupportedPaymentMethods()`.
    *   Investors send crypto (BTC, ETH, etc.) to the respective addresses.
    *   Investors call `BitFracPresale.registerInvestment()` with their transaction details.
    *   Admin verifies the off-chain transaction and calls `BitFracPresale.verifyInvestment()`, which triggers token minting in `BitFracToken.sol`.
3.  **Staking:**
    *   Token holders call `BitFracToken.stake()` to stake BFC.
    *   After the staking period, they call `BitFracToken.unstake()` to retrieve their principal and earned rewards (minted from `MINING_REWARDS`).
4.  **Revenue Distribution:**
    *   Owner deposits stablecoin revenue into `BitFracRevenueDistribution.sol` and calls `createRevenuePool()`. This also triggers a snapshot in `BitFracToken.sol`.
    *   Owner calls `finalizeRevenuePool()` to calculate total eligible tokens from the snapshot.
    *   Token holders call `BitFracRevenueDistribution.claimRevenue()` to receive their share of the stablecoin revenue.

## Key Considerations

*   **Multi-Currency Payments:** Payments in non-Ethereum native currencies (BTC, XRP, DOGE) rely on an off-chain verification process. The security and reliability of this process are external to the smart contracts.
*   **Price Feeds:** The accuracy of Chainlink price feeds and the timely update of manual prices are crucial for fair presale token valuation.
*   **Gas Costs:** Snapshot creation and complex calculations can incur gas costs.
*   **External Wallet Security:** The security of the external wallets holding BTC, XRP, DOGE is paramount.
*   **AI Wallet:** The "AI-Powered Security Wallet" mentioned in the project description is an external component and not part of these smart contracts. These contracts provide the token and on-chain logic.
