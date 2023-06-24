// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/AccessControl.sol";

contract GameLogic is AccessControl {
    address public PostToken;
    address public VoteToken;
    // upvote post address => count
    mapping (address => uint256) public upVoteMap;
    // downvote post address => count
    mapping (address => uint256) public downVoteMap;
    // user address => nft address
    mapping (address => address) public postAddress;

    constructor(address _VoteToken, address _PostToken) {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        PostToken = _PostToken;
        VoteToken = _VoteToken;
    }

    function createPost(string memory uri) public {
        // TODO capture nft address here
        //postAddress[msg.sender] = 
        PostToken.safeMint(address(this), uri);
    }

    function vote(address _postAddress, int8 votes) public {
        uint256 currentUpVoteCount = upVoteMap[_postAddress];
        uint256 currentDownVoteCount = downVoteMap[_postAddress];
        if (votes < 0) {
            downVoteMap[_postAddress] = currentDownVoteCount + (uint256(-votes));
        } else if (votes > 0) {
            upVoteMap[_postAddress] = currentUpVoteCount + uint256(votes);
        }

        VoteToken(VoteToken).transfer(msg.sender, 1);
    }
}
