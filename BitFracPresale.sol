// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./BitFracToken.sol";

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
        string address;      // Wallet address for this currency
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
    
    // Price oracle (simplified, in production use Chainlink or similar)
    struct PriceData {
        string currency;     // Currency symbol
        uint256 price;       // USD price in cents (e.g. $45,000 = 4500000)
        uint256 updatedAt;   // Last update timestamp
    }
    
    mapping(string => PriceData) public prices;
    
    // Events
    event InvestmentRegistered(
        address indexed investor, 
        string currency, 
        string txHash, 
        uint256 amount, 
        uint256 usdEquivalent
    );
    
    event InvestmentVerified(
        address indexed investor, 
        uint256 investmentIndex, 
        uint256 tokenAmount, 
        uint256 bonusAmount
    );
    
    event PaymentAddressAdded(string currency, string address);
    event PaymentAddressUpdated(string currency, string address);
    event PriceUpdated(string currency, uint256 price);
    
    constructor(address _tokenAddress) Ownable(msg.sender) {
        bitfracToken = BitFracToken(_tokenAddress);
        
        // Initialize payment addresses
        paymentAddresses.push(CryptoPaymentAddress({
            currency: "BTC",
            address: "bc1q5j59e3dsggy9a5lemx202xzymlxzzn4dx6uqh2",
            active: true
        }));
        
        paymentAddresses.push(CryptoPaymentAddress({
            currency: "ETH",
            address: "0x5230785a457e673E290eDcEEc1Fc065115762A22",
            active: true
        }));
        
        paymentAddresses.push(CryptoPaymentAddress({
            currency: "XRP",
            address: "rTuKnJH5LyVCtvTUTjJ2DvTJcDP1KkmrM",
            active: true
        }));
        
        paymentAddresses.push(CryptoPaymentAddress({
            currency: "DOGE",
            address: "D67ZgbZYPeqyUCSHEKD9MwPMB6PB2MorLn",
            active: true
        }));
        
        // Initialize prices (example values)
        prices["BTC"] = PriceData({
            currency: "BTC",
            price: 4500000, // $45,000.00
            updatedAt: block.timestamp
        });
        
        prices["ETH"] = PriceData({
            currency: "ETH",
            price: 300000, // $3,000.00
            updatedAt: block.timestamp
        });
        
        prices["XRP"] = PriceData({
            currency: "XRP",
            price: 50, // $0.50
            updatedAt: block.timestamp
        });
        
        prices["DOGE"] = PriceData({
            currency: "DOGE",
            price: 15, // $0.15
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
                return paymentAddresses[i].address;
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
                paymentAddresses[i].address = newAddress;
                paymentAddresses[i].active = active;
                found = true;
                emit PaymentAddressUpdated(currency, newAddress);
                break;
            }
        }
        
        if (!found) {
            paymentAddresses.push(CryptoPaymentAddress({
                currency: currency,
                address: newAddress,
                active: active
            }));
            emit PaymentAddressAdded(currency, newAddress);
        }
    }
    
    /**
     * @dev Update price for a currency
     */
    function updatePrice(string memory currency, uint256 price) external onlyOwner {
        prices[currency] = PriceData({
            currency: currency,
            price: price,
            updatedAt: block.timestamp
        });
        
        emit PriceUpdated(currency, price);
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
        
        // Get current price data
        PriceData memory priceData = prices[currency];
        require(priceData.price > 0, "Price data not available");
        require(block.timestamp - priceData.updatedAt <= 1 days, "Price data too old");
        
        // Calculate USD equivalent (simplified)
        uint256 usdEquivalent = amount * priceData.price / 1e8; // Assumes 8 decimal places
        
        // Record the investment
        investments[msg.sender].push(Investment({
            currency: currency,
            txHash: txHash,
            amount: amount,
            usdEquivalent: usdEquivalent,
            tokenAmount: 0, // Will be set when verified
            bonusAmount: 0, // Will be set when verified
            round: uint8(bitfracToken.currentRound()),
            timestamp: block.timestamp,
            verified: false
        }));
        
        emit InvestmentRegistered(
            msg.sender,
            currency,
            txHash,
            amount,
            usdEquivalent
        );
    }
    
    /**
     * @dev Admin verifies the external transaction and allocates tokens
     */
    function verifyInvestment(address investor, uint256 investmentIndex) external onlyOwner {
        require(investmentIndex < investments[investor].length, "Investment index out of bounds");
        Investment storage investment = investments[investor][investmentIndex];
        
        require(!investment.verified, "Investment already verified");
        
        uint8 currentRound = bitfracToken.currentRound();
        require(currentRound > 0, "No active presale round");
        
        // Get round data from token contract
        (uint256 price, , , uint256 minPurchase, uint256 maxPurchase, uint256 bonusPercentage, bool active) = 
            bitfracToken.rounds(currentRound);
        
        require(active, "Round not active");
        
        // Calculate token amount based on USD equivalent and token price
        // Token price is in cents, so we multiply by 100 to get to dollars
        uint256 tokenAmount = investment.usdEquivalent * 100 / price;
        
        // Enforce min and max purchase limits
        require(tokenAmount >= minPurchase, "Investment below minimum purchase");
        if (tokenAmount > maxPurchase) {
            tokenAmount = maxPurchase;
        }
        
        // Calculate bonus
        uint256 bonusAmount = tokenAmount * bonusPercentage / 100;
        
        // Update investment record
        investment.tokenAmount = tokenAmount;
        investment.bonusAmount = bonusAmount;
        investment.verified = true;
        
        // Allocate tokens via token contract
        bitfracToken.addPresaleInvestor(investor, tokenAmount, currentRound);
        
        emit InvestmentVerified(investor, investmentIndex, tokenAmount, bonusAmount);
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
        uint256 amount,
        uint256 usdEquivalent,
        uint256 tokenAmount,
        uint256 bonusAmount,
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
                addresses[index] = paymentAddresses[i].address;
                index++;
            }
        }
        
        return (currencies, addresses);
    }
} 