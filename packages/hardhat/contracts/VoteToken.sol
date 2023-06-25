// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract VoteToken is ERC20, Ownable {

    // uint256 public totalSupply;
    mapping(address => uint256) public balances;
    
    constructor(uint256 _totalSupply) ERC20("VoteToken", "VOTE") {
        balances[msg.sender] = _totalSupply;
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
}
