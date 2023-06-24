// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "./VoteToken.sol";
import "./PostToken.sol";

contract GameLogic is AccessControl {
    address public postTokenAddress;
    address public voteTokenAddress;
    // upvote post address => (user address, count)
    mapping (address => mapping (address => uint256)) public upVoteMap;
    //mapping (address => uint256) public upVoteMap;
    // downvote post address => count
    mapping (address => mapping (address => uint256)) public downVoteMap;
    // user address => nft address
    mapping (address => address) public postAddress;

    constructor(address _VoteToken, address _PostToken) {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        postTokenAddress = _PostToken;
        voteTokenAddress = _VoteToken;
    }

    function createPost(string memory uri) public {
        // TODO capture nft address here
        //postAddress[msg.sender] = 
        PostToken.safeMint(address(this), uri);
    }

    function vote(address _postAddress, int8 votes) public {
        uint256 currentUpVoteCount = upVoteMap[_postAddress][msg.sender];
        uint256 currentDownVoteCount = downVoteMap[_postAddress][msg.sender];

        if (votes < 0) {
            downVoteMap[_postAddress][msg.sender] = currentDownVoteCount + uint256(-votes);
        } else if (votes > 0) {
            upVoteMap[_postAddress][msg.sender] = currentUpVoteCount + uint256(votes);
        }
        VoteToken(voteTokenAddress).transfer(msg.sender, 1);
    }
}
