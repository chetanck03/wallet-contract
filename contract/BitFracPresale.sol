// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts@4.9.3/access/Ownable.sol";
import "@openzeppelin/contracts@4.9.3/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts@4.9.3/token/ERC20/IERC20.sol";
import "./BitFracToken.sol";

// Interface for Chainlink AggregatorV3
interface AggregatorV3Interface {
    function decimals() external view returns (uint8);
    function description() external view returns (string memory);
    function version() external view returns (uint256);
    function getRoundData(uint80 _roundId) external view returns (
        uint80 roundId,
        int256 answer,
        uint256 startedAt,
        uint256 updatedAt,
        uint80 answeredInRound
    );
    function latestRoundData() external view returns (
        uint80 roundId,
        int256 answer,
        uint256 startedAt,
        uint256 updatedAt,
        uint80 answeredInRound
    );
}

/**
 * @title BitFrac Presale
 * @dev Manages the presale of BitFrac tokens with multi-currency support
 */
contract BitFracPresale is Ownable, ReentrancyGuard {
    // BitFrac token contract reference
    BitFracToken public bitfracToken;
    
    // Payment addresses for different cryptocurrencies
    struct CryptoPaymentAddress {
        string currency;     // Currency symbol (BTC, ETH, XRP, DOGE)
        string walletAddress;      // Wallet address for this currency
        bool active;         // If this currency is accepted
    }
    
    CryptoPaymentAddress[] public paymentAddresses;
    
    // Track investments for each investor
    struct Investment {
        string currency;         // Which currency was used (BTC, ETH, XRP, DOGE)
        string txHash;           // Transaction hash from the blockchain
        uint256 amount;          // Amount in the smallest denomination of that currency
        uint256 usdEquivalent;   // USD equivalent at time of investment
        uint256 tokenAmount;     // Tokens allocated (before bonus)
        uint256 bonusAmount;     // Bonus tokens
        uint8 round;             // Presale round
        uint256 timestamp;       // When the investment was recorded
        bool verified;           // Whether admin verified the transaction
    }
    
    // Investor address => all their investments
    mapping(address => Investment[]) public investments;
    
    // Price oracle: Uses Chainlink for supported currencies, fallback to manual for others.
    struct PriceData { // Kept for manual price entries
        string currency;     // Currency symbol
        uint256 price;       // USD price in cents (e.g. $45,000 = 4500000)
        uint256 updatedAt;   // Last update timestamp
    }
    
    mapping(string => PriceData) public manualPrices; // Renamed from 'prices'
    mapping(string => address) public priceFeeds; // Chainlink feed addresses
    
    // Events
    event InvestmentRegistered(
        address indexed investor, 
        string currency, 
        string txHash, 
        uint256 amount, 
        uint256 usdEquivalent // In USD Cents
    );
    
    event InvestmentVerified(
        address indexed investor, 
        uint256 investmentIndex, 
        uint256 tokenAmount, 
        uint256 bonusAmount
    );
    
    event PaymentAddressAdded(string currency, string walletAddress);
    event PaymentAddressUpdated(string currency, string walletAddress);
    event PriceUpdated(string currency, uint256 price);
    
    constructor(address _tokenAddress) Ownable() {
        bitfracToken = BitFracToken(_tokenAddress);
        
        // Initialize payment addresses
        paymentAddresses.push(CryptoPaymentAddress({
            currency: "BTC",
            walletAddress: "bc1q5j59e3dsggy9a5lemx202xzymlxzzn4dx6uqh2",
            active: true
        }));
        
        paymentAddresses.push(CryptoPaymentAddress({
            currency: "ETH",
            walletAddress: "0x5230785a457e673E290eDcEEc1Fc065115762A22",
            active: true
        }));
        
        paymentAddresses.push(CryptoPaymentAddress({
            currency: "XRP",
            walletAddress: "rTuKnJH5LyVCtvTUTjJ2DvTJcDP1KkmrM",
            active: true
        }));
        
        paymentAddresses.push(CryptoPaymentAddress({
            currency: "DOGE",
            walletAddress: "D67ZgbZYPeqyUCSHEKD9MwPMB6PB2MorLn",
            active: true
        }));
        
        // Initialize Chainlink Price Feed addresses (Sepolia Testnet)
        priceFeeds["BTC"] = 0x1b44F3514812d835EB1BDB0acB33d3fA3351Ee43; // BTC/USD Sepolia
        priceFeeds["ETH"] = 0x694AA1769357215DE4FAC081bf1f309aDC325306; // ETH/USD Sepolia
        priceFeeds["XRP"] = address(0); // No direct Sepolia feed, use manualPrices
        priceFeeds["DOGE"] = address(0); // No direct Sepolia feed, use manualPrices

        // Initialize manual prices (example values for XRP, DOGE or as fallback)
        manualPrices["XRP"] = PriceData({
            currency: "XRP",
            price: 50, // $0.50 (50 cents)
            updatedAt: block.timestamp
        });
        
        manualPrices["DOGE"] = PriceData({
            currency: "DOGE",
            price: 15, // $0.15 (15 cents)
            updatedAt: block.timestamp
        });
    }
    
    /**
     * @dev Get payment address for a given currency
     */
    function getPaymentAddress(string memory currency) public view returns (string memory) {
        for (uint i = 0; i < paymentAddresses.length; i++) {
            if (keccak256(bytes(paymentAddresses[i].currency)) == keccak256(bytes(currency)) && 
                paymentAddresses[i].active) {
                return paymentAddresses[i].walletAddress;
            }
        }
        revert("Currency not supported");
    }
    
    /**
     * @dev Update a payment address
     */
    function updatePaymentAddress(string memory currency, string memory newAddress, bool active) 
        external 
        onlyOwner 
    {
        bool found = false;
        
        for (uint i = 0; i < paymentAddresses.length; i++) {
            if (keccak256(bytes(paymentAddresses[i].currency)) == keccak256(bytes(currency))) {
                paymentAddresses[i].walletAddress = newAddress;
                paymentAddresses[i].active = active;
                found = true;
                emit PaymentAddressUpdated(currency, newAddress);
                break;
            }
        }
        
        if (!found) {
            paymentAddresses.push(CryptoPaymentAddress({
                currency: currency,
                walletAddress: newAddress,
                active: active
            }));
            emit PaymentAddressAdded(currency, newAddress);
        }
    }
    
    /**
     * @dev Update price for a currency
     */
    function updatePrice(string memory currency, uint256 priceInCents) external onlyOwner {
        manualPrices[currency] = PriceData({
            currency: currency,
            price: priceInCents,
            updatedAt: block.timestamp
        });
        emit PriceUpdated(currency, priceInCents); // Make sure PriceUpdated event is defined if kept
    }

    /**
     * @dev Owner can update Chainlink price feed address for a currency.
     */
    function updatePriceFeed(string memory currency, address feedAddress) external onlyOwner {
        priceFeeds[currency] = feedAddress;
        // event PriceFeedUpdated(string currency, address newFeedAddress); // Optional: emit event
    }

    /**
     * @dev Get the latest price of a currency in USD from Chainlink.
     * Returns price (with feed's decimals) and the number of decimals.
     */
    function getChainlinkPriceData(string memory currency) internal view returns (int256 price, uint8 feedDecimals) {
        address feedAddress = priceFeeds[currency];
        require(feedAddress != address(0), "Chainlink feed not available for this currency");
        
        AggregatorV3Interface priceFeedInstance = AggregatorV3Interface(feedAddress);
        (, int256 _price, , , ) = priceFeedInstance.latestRoundData();
        // require(block.timestamp - updatedAt <= 1 days, "Price data is too old"); // Optional: staleness check
        
        return (_price, priceFeedInstance.decimals());
    }
    
    /**
     * @dev Register an investment in a cryptocurrency
     * @notice This is called by investors to record their external blockchain transaction
     */
    function registerInvestment(
        string memory currency,
        string memory txHash,
        uint256 amount
    ) 
        external 
        nonReentrant 
    {
        // Check if currency is supported and active
        bool supported = false;
        for (uint i = 0; i < paymentAddresses.length; i++) {
            if (keccak256(bytes(paymentAddresses[i].currency)) == keccak256(bytes(currency)) && 
                paymentAddresses[i].active) {
                supported = true;
                break;
            }
        }
        require(supported, "Currency not supported or inactive");
        
        uint256 usdEquivalentInCents;

        if (priceFeeds[currency] != address(0)) { // Use Chainlink if feed is available
            (int256 chainlinkPrice, uint8 feedDecimals) = getChainlinkPriceData(currency);
            require(chainlinkPrice > 0, "Invalid price from Chainlink");

            uint8 paymentCurrencyDecimals;
            if (keccak256(bytes(currency)) == keccak256(bytes("BTC"))) {
                paymentCurrencyDecimals = 8; // BTC: 8 decimals (satoshi)
            } else if (keccak256(bytes(currency)) == keccak256(bytes("ETH"))) {
                paymentCurrencyDecimals = 18; // ETH: 18 decimals (wei)
            } else {
                revert("Payment currency decimals not defined for Chainlink path");
            }
            
            // Formula: (amount_smallest_unit / 10^paymentCurrencyDecimals) * (price_from_feed / 10^feedDecimals) * 100 (for cents)
            uint256 scaledAmount = amount * 100; // for cents conversion
            uint256 divisor = (10**paymentCurrencyDecimals) * (10**feedDecimals);
            require(divisor > 0, "Divisor cannot be zero");
            usdEquivalentInCents = (scaledAmount * uint256(chainlinkPrice)) / divisor;

        } else { // Fallback to manual price
            PriceData memory manualPriceData = manualPrices[currency];
            require(manualPriceData.price > 0, "Manual price data not available or zero");
            // require(block.timestamp - manualPriceData.updatedAt <= 1 days, "Manual price data too old"); // Optional

            // manualPriceData.price is already in cents.
            // `amount` is in smallest unit (e.g., satoshis, wei). Need to convert to whole units first.
            uint8 paymentCurrencyDecimals;
            if (keccak256(bytes(currency)) == keccak256(bytes("XRP"))) { // Example, XRP typically has 6 decimals
                paymentCurrencyDecimals = 6;
            } else if (keccak256(bytes(currency)) == keccak256(bytes("DOGE"))) { // Example, DOGE typically has 8
                paymentCurrencyDecimals = 8;
            } else {
                revert("Payment currency decimals not defined for manual path");
            }
            
            // usdEquivalentInCents = (amount * manualPriceData.price) / 10**paymentCurrencyDecimals;
            // Careful with order of operations to maintain precision and avoid overflow/underflow
            // (amount / 10**paymentCurrencyDecimals) * manualPriceData.price
            if (paymentCurrencyDecimals == 0) { // Should not happen for BTC, ETH, XRP, DOGE
                 usdEquivalentInCents = amount * manualPriceData.price;
            } else {
                 usdEquivalentInCents = (amount * manualPriceData.price) / (10**paymentCurrencyDecimals);
            }
        }
        
        require(usdEquivalentInCents > 0, "USD equivalent must be greater than zero");

        // Record the investment
        uint8 registrationRound = bitfracToken.currentRound();
        require(registrationRound > 0 && registrationRound <= bitfracToken.TOTAL_ROUNDS(), "Presale round is not active or invalid");
        
        // Check if the round is active by fetching its 'active' status
        // The getter for a struct mapping returns individual members, not the struct itself.
        // We need to destructure to get the 'active' field.
        (,,,,,,bool roundIsActive) = bitfracToken.rounds(registrationRound);
        require(roundIsActive, "Presale round is not active in token contract");

        investments[msg.sender].push(Investment({
            currency: currency,
            txHash: txHash,
            amount: amount, // Smallest unit of the currency
            usdEquivalent: usdEquivalentInCents, // USD Cents
            tokenAmount: 0, // Will be set when verified
            bonusAmount: 0, // Will be set when verified
            round: registrationRound, // Store round at time of registration
            timestamp: block.timestamp,
            verified: false
        }));
        
        emit InvestmentRegistered(
            msg.sender,
            currency,
            txHash,
            amount,
            usdEquivalentInCents
        );
    }
    
    /**
     * @dev Admin verifies the external transaction and allocates tokens
     */
    function verifyInvestment(address investor, uint256 investmentIndex) external onlyOwner {
        require(investmentIndex < investments[investor].length, "Investment index out of bounds");
        Investment storage investment = investments[investor][investmentIndex]; // This is a storage pointer
        
        require(!investment.verified, "Investment already verified");
        
        // Use the round stored at the time of investment registration
        uint8 investmentRoundId = investment.round;
        require(investmentRoundId > 0 && investmentRoundId <= bitfracToken.TOTAL_ROUNDS(), "Invalid round in investment record");
        
        // Get round data from token contract using the stored round ID
        (uint256 roundPrice, uint256 roundMaxTokens, uint256 roundSoldTokens, uint256 roundMinPurchase, uint256 roundMaxPurchase, uint256 roundBonusPercentage, bool roundIsActiveFromToken) = 
            bitfracToken.rounds(investmentRoundId);

        // It's important to decide if verification can proceed if the round *became* inactive after registration.
        // For now, we'll allow it, but we must ensure the price and bonus are from the time of registration.
        // We also check if the price is valid (greater than zero), which implies the round existed.
        require(roundPrice > 0, "Token price for the recorded round is zero, round might not have existed or data is invalid");
        
        // investment.usdEquivalent is in USD Cents.
        // roundPrice (from BitFracToken.sol) is also in USD Cents per BFC token.
        // BFC token has 18 decimals.
        require(roundPrice > 0, "Token price for the round cannot be zero");
        
        uint256 bfcTokensToMintBase = (investment.usdEquivalent * (10**bitfracToken.decimals())) / roundPrice;
        
        // Enforce min and max purchase limits (these limits are in BFC tokens, including decimals)
        require(bfcTokensToMintBase >= roundMinPurchase, "Investment below minimum purchase");
        if (bfcTokensToMintBase > roundMaxPurchase) {
            bfcTokensToMintBase = roundMaxPurchase;
        }
        
        // Bonus is calculated within BitFracToken.addPresaleInvestor.
        // We just need to store the base amount and bonus amount for our records here if needed.
        // The `addPresaleInvestor` function in `BitFracToken` will mint base + bonus.
        uint256 bonusCalculatedForRecord = bfcTokensToMintBase * roundBonusPercentage / 100;
        
        // Update investment record
        investment.tokenAmount = bfcTokensToMintBase; 
        investment.bonusAmount = bonusCalculatedForRecord; 
        investment.verified = true;
        
        // Allocate tokens via token contract. `addPresaleInvestor` handles bonus calculation and minting.
        // Use the investmentRoundId for allocating tokens.
        bitfracToken.addPresaleInvestor(investor, bfcTokensToMintBase, investmentRoundId);
        
        emit InvestmentVerified(investor, investmentIndex, bfcTokensToMintBase, bonusCalculatedForRecord);
    }
    
    /**
     * @dev Get number of investments for an address
     */
    function getInvestmentCount(address investor) external view returns (uint256) {
        return investments[investor].length;
    }
    
    /**
     * @dev Get investment details
     */
    function getInvestment(address investor, uint256 index) external view returns (
        string memory currency,
        string memory txHash,
        uint256 amount, // Smallest unit of currency paid
        uint256 usdEquivalent, // In USD Cents
        uint256 tokenAmount,   // BFC tokens (base amount, with decimals)
        uint256 bonusAmount,   // BFC bonus tokens (with decimals)
        uint8 round,
        uint256 timestamp,
        bool verified
    ) {
        require(index < investments[investor].length, "Investment index out of bounds");
        Investment storage inv = investments[investor][index];
        
        return (
            inv.currency,
            inv.txHash,
            inv.amount,
            inv.usdEquivalent,
            inv.tokenAmount,
            inv.bonusAmount,
            inv.round,
            inv.timestamp,
            inv.verified
        );
    }
    
    /**
     * @dev Get all supported payment methods
     */
    function getSupportedPaymentMethods() external view returns (string[] memory currencies, string[] memory addresses) {
        uint256 activeCount = 0;
        
        // Count active payment methods
        for (uint i = 0; i < paymentAddresses.length; i++) {
            if (paymentAddresses[i].active) {
                activeCount++;
            }
        }
        
        currencies = new string[](activeCount);
        addresses = new string[](activeCount);
        
        uint256 index = 0;
        for (uint i = 0; i < paymentAddresses.length; i++) {
            if (paymentAddresses[i].active) {
                currencies[index] = paymentAddresses[i].currency;
                addresses[index] = paymentAddresses[i].walletAddress;
                index++;
            }
        }
        
        return (currencies, addresses);
    }
} 