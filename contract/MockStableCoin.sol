// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v4.9.3/contracts/token/ERC20/ERC20.sol";

contract MockStablecoin is ERC20 {
    constructor(string memory name, string memory symbol, uint256 initialSupply) ERC20(name, symbol) {
        _mint(msg.sender, initialSupply * (10**decimals()));
    }
}

// name: Test Stablecoin (or any name)
// symbol: TST (or any symbol)
// initialSupply: 1000000 (this will mint 1 million TST to your address)