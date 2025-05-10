// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts@4.9.3/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts@4.9.3/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts@4.9.3/access/Ownable.sol";
import "@openzeppelin/contracts@4.9.3/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts@4.9.3/token/ERC20/extensions/ERC20Snapshot.sol";

/**
 * @title BitFrac Token
 * @dev ERC20 token for BitFrac project with presale and staking functionality
 */
contract BitFracToken is ERC20, ERC20Burnable, Ownable, ReentrancyGuard, ERC20Snapshot {
    // Total token supply (1 million tokens)
    uint256 public constant MAX_SUPPLY = 1_000_000 * 10**18;
    
    // Token distribution
    uint256 public constant PRESALE_ALLOCATION = 550_000 * 10**18; // 55% for presale
    uint256 public constant TEAM_ALLOCATION = 100_000 * 10**18;     // 10% for team
    uint256 public constant MINING_REWARDS = 250_000 * 10**18;     // 25% for mining rewards
    uint256 public constant MARKETING_ALLOCATION = 100_000 * 10**18;// 10% for marketing
    
    // Presale rounds configuration
    uint8 public currentRound = 0;
    uint8 public constant TOTAL_ROUNDS = 7;
    
    struct Round {
        uint256 price;           // Price in USD cents (e.g. 5.5 cents = 550)
        uint256 maxTokens;       // Maximum tokens available in this round
        uint256 soldTokens;      // Tokens sold in this round
        uint256 minPurchase;     // Minimum purchase amount in tokens
        uint256 maxPurchase;     // Maximum purchase amount in tokens
        uint256 bonusPercentage; // Bonus percentage for early investors
        bool active;             // Is the round active?
    }
    
    mapping(uint8 => Round) public rounds;
    
    // Staking configuration
    struct Stake {
        uint256 amount;
        uint256 startTime;
        uint256 endTime;
        bool active;
    }
    
    mapping(address => Stake[]) public stakes;
    uint256 public stakingRewardRate = 10; // 10% APY
    uint256 public minStakingPeriod = 30 days;
    uint256 public totalStaked = 0;
    
    // Events
    event TokensPurchased(address indexed buyer, uint8 round, uint256 amount, uint256 bonus);
    event RoundStarted(uint8 round, uint256 price);
    event RoundEnded(uint8 round, uint256 tokensSold);
    event Staked(address indexed staker, uint256 amount, uint256 duration);
    event Unstaked(address indexed staker, uint256 amount, uint256 reward);
    // Revenue related events are handled by BitFracRevenueDistribution contract
    
    constructor() ERC20("BitFrac", "BFC") Ownable() {
        // Initialize presale rounds
        rounds[1] = Round({
            price: 400,           // 4 cents
            maxTokens: 78_571 * 10**18,
            soldTokens: 0,
            minPurchase: 1000 * 10**18,  // 1,000 tokens
            maxPurchase: 100_000 * 10**18, // 100,000 tokens
            bonusPercentage: 20,  // 20% bonus
            active: false
        });
        
        rounds[2] = Round({
            price: 450,           // 4.5 cents
            maxTokens: 78_571 * 10**18,
            soldTokens: 0,
            minPurchase: 1000 * 10**18,
            maxPurchase: 100_000 * 10**18,
            bonusPercentage: 15,  // 15% bonus
            active: false
        });
        
        rounds[3] = Round({
            price: 500,           // 5 cents
            maxTokens: 78_571 * 10**18,
            soldTokens: 0,
            minPurchase: 1000 * 10**18,
            maxPurchase: 100_000 * 10**18,
            bonusPercentage: 10,  // 10% bonus
            active: false
        });
        
        rounds[4] = Round({
            price: 550,           // 5.5 cents
            maxTokens: 78_571 * 10**18,
            soldTokens: 0,
            minPurchase: 1000 * 10**18,
            maxPurchase: 100_000 * 10**18,
            bonusPercentage: 7,   // 7% bonus
            active: false
        });
        
        rounds[5] = Round({
            price: 600,           // 6 cents
            maxTokens: 78_571 * 10**18,
            soldTokens: 0,
            minPurchase: 1000 * 10**18,
            maxPurchase: 100_000 * 10**18,
            bonusPercentage: 5,   // 5% bonus
            active: false
        });
        
        rounds[6] = Round({
            price: 650,           // 6.5 cents
            maxTokens: 78_571 * 10**18,
            soldTokens: 0,
            minPurchase: 1000 * 10**18,
            maxPurchase: 100_000 * 10**18,
            bonusPercentage: 3,   // 3% bonus
            active: false
        });
        
        rounds[7] = Round({
            price: 700,           // 7 cents
            maxTokens: 78_574 * 10**18,
            soldTokens: 0,
            minPurchase: 1000 * 10**18,
            maxPurchase: 100_000 * 10**18,
            bonusPercentage: 0,   // 0% bonus
            active: false
        });
        
        // Mint tokens for team and marketing
        _mint(msg.sender, TEAM_ALLOCATION + MARKETING_ALLOCATION);
    }
    
    /**
     * @dev Start the next presale round
     */
    function startNextRound() external onlyOwner {
        require(currentRound < TOTAL_ROUNDS, "All rounds completed");
        
        // End current round if active
        if (currentRound > 0 && rounds[currentRound].active) {
            rounds[currentRound].active = false;
            emit RoundEnded(currentRound, rounds[currentRound].soldTokens);
        }
        
        // Start next round
        currentRound++;
        rounds[currentRound].active = true;
        
        emit RoundStarted(currentRound, rounds[currentRound].price);
    }
    
    /**
     * @dev End the current presale round
     */
    function endCurrentRound() external onlyOwner {
        require(currentRound > 0 && currentRound <= TOTAL_ROUNDS, "No active round");
        require(rounds[currentRound].active, "Round not active");
        
        rounds[currentRound].active = false;
        emit RoundEnded(currentRound, rounds[currentRound].soldTokens);
    }
    
    /**
     * @dev Owner can manually add tokens from presale to investors
     */
    function addPresaleInvestor(address investor, uint256 tokenAmount, uint8 round) external onlyOwner {
        require(round > 0 && round <= TOTAL_ROUNDS, "Invalid round");
        require(rounds[round].soldTokens + tokenAmount <= rounds[round].maxTokens, "Exceeds round allocation");
        
        uint256 bonusAmount = tokenAmount * rounds[round].bonusPercentage / 100;
        uint256 totalAmount = tokenAmount + bonusAmount;
        
        rounds[round].soldTokens += tokenAmount;
        
        _mint(investor, totalAmount);
        
        emit TokensPurchased(investor, round, tokenAmount, bonusAmount);
    }
    
    /**
     * @dev Stake tokens for rewards
     */
    function stake(uint256 amount, uint256 duration) external nonReentrant {
        require(amount > 0, "Cannot stake 0 tokens");
        require(duration >= minStakingPeriod, "Staking period too short");
        require(balanceOf(msg.sender) >= amount, "Insufficient balance");
        
        // Transfer tokens to contract
        _transfer(msg.sender, address(this), amount);
        
        // Record stake
        stakes[msg.sender].push(Stake({
            amount: amount,
            startTime: block.timestamp,
            endTime: block.timestamp + duration,
            active: true
        }));
        
        totalStaked += amount;
        
        emit Staked(msg.sender, amount, duration);
    }
    
    /**
     * @dev Unstake tokens and claim rewards
     */
    function unstake(uint256 stakeIndex) external nonReentrant {
        require(stakeIndex < stakes[msg.sender].length, "Invalid stake index");
        
        Stake storage userStake = stakes[msg.sender][stakeIndex];
        require(userStake.active, "Stake already withdrawn");
        require(block.timestamp >= userStake.endTime, "Staking period not completed");
        
        uint256 amount = userStake.amount;
        uint256 stakingDuration = userStake.endTime - userStake.startTime;
        
        // Calculate reward based on staking duration and APY
        uint256 reward = amount * stakingRewardRate * stakingDuration / (365 days * 100);
        
        // Update stake status
        userStake.active = false;
        totalStaked -= amount;
        
        // Transfer principal and rewards
        _transfer(address(this), msg.sender, amount);
        
        // Mint rewards from mining allocation
        if (reward > 0 && MINING_REWARDS > 0) {
            uint256 actualReward = (reward <= MINING_REWARDS) ? reward : MINING_REWARDS;
            _mint(msg.sender, actualReward);
        }
        
        emit Unstaked(msg.sender, amount, reward);
    }
    
    // Functions distributeRevenue and claimRevenue are removed as this is handled by BitFracRevenueDistribution.sol
    
    /**
     * @dev Set staking reward rate
     */
    function setStakingRewardRate(uint256 newRate) external onlyOwner {
        require(newRate <= 100, "Rate too high");
        stakingRewardRate = newRate;
    }
    
    /**
     * @dev Set minimum staking period
     */
    function setMinStakingPeriod(uint256 newPeriod) external onlyOwner {
        minStakingPeriod = newPeriod;
    }
    
    /**
     * @dev Check if total supply exceeds max supply before minting
     */
    function _mint(address account, uint256 amount) internal override(ERC20) {
        require(totalSupply() + amount <= MAX_SUPPLY, "Exceeds max supply");
        super._mint(account, amount);
    }

    /**
     * @dev Creates a new snapshot and returns its ID.
     * This function can be called by the owner (e.g., BitFracRevenueDistribution contract owner)
     * to capture the token balances at a specific point in time for revenue distribution.
     */
    function triggerSnapshot() external onlyOwner returns (uint256) {
        return _snapshot();
    }

    // Override _burn to comply with ERC20Snapshot if needed, though ERC20Burnable handles it.
    // If direct calls to _burn are made and need snapshot interaction beyond what ERC20Snapshot's _update provides.
    // function _burn(address account, uint256 amount) internal virtual override(ERC20, ERC20Snapshot) {
    //     super._burn(account, amount);
    // }

    // Override _transfer to comply with ERC20Snapshot, though it's typically handled by _update.
    // function _transfer(
    //     address from,
    //     address to,
    //     uint256 amount
    // ) internal virtual override(ERC20, ERC20Snapshot) {
    //     super._transfer(from, to, amount);
    // }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal virtual override(ERC20, ERC20Snapshot) {
        super._beforeTokenTransfer(from, to, amount);
    }
}