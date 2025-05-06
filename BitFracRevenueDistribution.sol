// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "./BitFracToken.sol";

/**
 * @title BitFrac Revenue Distribution
 * @dev Manages revenue distribution from mining operations to token holders
 */
contract BitFracRevenueDistribution is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;
    
    // BitFrac token contract reference
    BitFracToken public bitfracToken;
    
    // Stablecoin reference - used for payouts
    IERC20 public stablecoin;
    
    // Revenue distribution period
    uint256 public constant DISTRIBUTION_PERIOD = 30 days;
    
    // Minimum tokens required to receive revenue
    uint256 public minimumTokensForRevenue;
    
    // Revenue pool data
    struct RevenuePool {
        uint256 id;
        uint256 totalAmount;         // Total revenue in this pool in stablecoin
        uint256 totalEligibleTokens; // Total eligible tokens at snapshot time
        uint256 startTime;           // When pool was created
        uint256 endTime;             // Deadline to claim from this pool
        bool finalized;              // Whether the pool has been finalized for distribution
        mapping(address => bool) claimed; // Track who has claimed
    }
    
    // Array of all revenue pools
    uint256 public currentPoolId;
    mapping(uint256 => RevenuePool) public revenuePools;
    
    // Mining facility data
    struct MiningFacility {
        string name;
        string location;
        uint256 hashRate;  // In terahashes per second (TH/s)
        bool active;
    }
    
    MiningFacility[] public miningFacilities;
    
    // Events
    event RevenuePoolCreated(uint256 indexed poolId, uint256 amount, uint256 startTime, uint256 endTime);
    event RevenuePoolFinalized(uint256 indexed poolId, uint256 totalEligibleTokens);
    event RevenueClaimed(address indexed user, uint256 indexed poolId, uint256 amount);
    event MiningFacilityAdded(string name, string location, uint256 hashRate);
    event MiningFacilityUpdated(uint256 indexed facilityId, uint256 hashRate, bool active);
    
    constructor(address _tokenAddress, address _stablecoinAddress) Ownable(msg.sender) {
        bitfracToken = BitFracToken(_tokenAddress);
        stablecoin = IERC20(_stablecoinAddress);
        minimumTokensForRevenue = 1000 * 10**18; // 1,000 tokens
        currentPoolId = 0;
    }
    
    /**
     * @dev Create a new revenue pool
     * @param amount The amount of stablecoin to distribute
     */
    function createRevenuePool(uint256 amount) external onlyOwner {
        require(amount > 0, "Amount must be greater than 0");
        
        // Transfer stablecoins from caller to this contract
        stablecoin.safeTransferFrom(msg.sender, address(this), amount);
        
        // Create new pool
        currentPoolId++;
        RevenuePool storage pool = revenuePools[currentPoolId];
        pool.id = currentPoolId;
        pool.totalAmount = amount;
        pool.startTime = block.timestamp;
        pool.endTime = block.timestamp + DISTRIBUTION_PERIOD;
        pool.finalized = false;
        
        emit RevenuePoolCreated(currentPoolId, amount, pool.startTime, pool.endTime);
    }
    
    /**
     * @dev Finalize a revenue pool and take snapshot of eligible token holders
     */
    function finalizeRevenuePool(uint256 poolId) external onlyOwner {
        RevenuePool storage pool = revenuePools[poolId];
        
        require(pool.id == poolId, "Pool does not exist");
        require(!pool.finalized, "Pool already finalized");
        
        // Calculate total eligible tokens
        // In a real implementation, you would use a snapshot mechanism
        // For simplicity, we're using current total supply minus staked tokens
        uint256 totalSupply = bitfracToken.totalSupply();
        uint256 stakedTokens = bitfracToken.totalStaked();
        
        pool.totalEligibleTokens = totalSupply - stakedTokens;
        pool.finalized = true;
        
        emit RevenuePoolFinalized(poolId, pool.totalEligibleTokens);
    }
    
    /**
     * @dev User claims their share of a revenue pool
     */
    function claimRevenue(uint256 poolId) external nonReentrant {
        RevenuePool storage pool = revenuePools[poolId];
        
        require(pool.id == poolId, "Pool does not exist");
        require(pool.finalized, "Pool not finalized yet");
        require(!pool.claimed[msg.sender], "Already claimed from this pool");
        require(block.timestamp <= pool.endTime, "Claim period has ended");
        
        uint256 userBalance = bitfracToken.balanceOf(msg.sender);
        require(userBalance >= minimumTokensForRevenue, "Insufficient token balance");
        
        // Calculate user's share
        uint256 userShare = pool.totalAmount * userBalance / pool.totalEligibleTokens;
        
        // Mark as claimed
        pool.claimed[msg.sender] = true;
        
        // Transfer stablecoins to user
        stablecoin.safeTransfer(msg.sender, userShare);
        
        emit RevenueClaimed(msg.sender, poolId, userShare);
    }
    
    /**
     * @dev Add a new mining facility
     */
    function addMiningFacility(string memory name, string memory location, uint256 hashRate) external onlyOwner {
        miningFacilities.push(MiningFacility({
            name: name,
            location: location,
            hashRate: hashRate,
            active: true
        }));
        
        emit MiningFacilityAdded(name, location, hashRate);
    }
    
    /**
     * @dev Update mining facility status
     */
    function updateMiningFacility(uint256 facilityId, uint256 hashRate, bool active) external onlyOwner {
        require(facilityId < miningFacilities.length, "Facility does not exist");
        
        miningFacilities[facilityId].hashRate = hashRate;
        miningFacilities[facilityId].active = active;
        
        emit MiningFacilityUpdated(facilityId, hashRate, active);
    }
    
    /**
     * @dev Get total active hash rate
     */
    function getTotalHashRate() public view returns (uint256) {
        uint256 totalHashRate = 0;
        
        for (uint i = 0; i < miningFacilities.length; i++) {
            if (miningFacilities[i].active) {
                totalHashRate += miningFacilities[i].hashRate;
            }
        }
        
        return totalHashRate;
    }
    
    /**
     * @dev Check if an address has claimed from a specific pool
     */
    function hasClaimed(address user, uint256 poolId) public view returns (bool) {
        return revenuePools[poolId].claimed[user];
    }
    
    /**
     * @dev Get number of mining facilities
     */
    function getMiningFacilityCount() external view returns (uint256) {
        return miningFacilities.length;
    }
    
    /**
     * @dev Set minimum tokens required for revenue
     */
    function setMinimumTokensForRevenue(uint256 newMinimum) external onlyOwner {
        minimumTokensForRevenue = newMinimum;
    }
    
    /**
     * @dev Allow owner to withdraw any unclaimed funds after claim period ends
     */
    function withdrawUnclaimedFunds(uint256 poolId) external onlyOwner {
        RevenuePool storage pool = revenuePools[poolId];
        
        require(pool.id == poolId, "Pool does not exist");
        require(pool.finalized, "Pool not finalized");
        require(block.timestamp > pool.endTime, "Claim period not ended");
        
        // Get remaining stablecoin balance
        uint256 remainingBalance = stablecoin.balanceOf(address(this));
        
        // Transfer to owner
        if (remainingBalance > 0) {
            stablecoin.safeTransfer(owner(), remainingBalance);
        }
    }
    
    /**
     * @dev Allow owner to withdraw any other ERC20 tokens accidentally sent to this contract
     */
    function recoverERC20(address tokenAddress, uint256 amount) external onlyOwner {
        require(tokenAddress != address(stablecoin), "Cannot withdraw distribution token");
        
        IERC20(tokenAddress).safeTransfer(owner(), amount);
    }
} 