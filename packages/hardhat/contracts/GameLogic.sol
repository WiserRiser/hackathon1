// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.9;

import "./Users.sol";
import "./CommunityToken.sol";
import "./VoteToken.sol";
import "./PostToken.sol";

contract GameLogic is Ownable {
    address public communityTokenAddress;
    address public postTokenAddress;
    address public voteTokenAddress;
    address public usersAddress;
    // upvote post address => (user address, count)
    mapping (uint => mapping (address => int8)) public upVoteMap;
    //mapping (address => uint256) public upVoteMap;
    // downvote post address => count
    mapping (uint => mapping (address => int8)) public downVoteMap;
    // user address => nft address
    mapping (address => address) public postAddress;

    //For Polygon id
    mapping(uint256 => address) public idToAddress;
    mapping(address => uint256) public addressToId;

    constructor(address _CommunityToken, address _VoteToken, address _PostToken, address _Users) {
        communityTokenAddress = _CommunityToken;
        postTokenAddress = _PostToken;
        voteTokenAddress = _VoteToken;
        usersAddress = _Users;
    }

    modifier verificationRequired() {
        require(Users(usersAddress).verificationRequired(_msgSender()));
        _;
    }

    function verifyUserWorldcoinOrb(
        address user
    ) public {
        Users(usersAddress).verifyUserWorldcoinOrb(user);
    }

    function verifyUserWorldcoinPhone(
        address user
    ) public {
        Users(usersAddress).verifyUserWorldcoinPhone(user);
    }

    function verifyUserSismo(
        address user
    ) public {
        Users(usersAddress).verifyUserSismo(user);
    }

    function verifyUserPolygon(
        address user,
        uint8 minAge //should be 13 or 18
    ) public {
        Users(usersAddress).verifyUserPolygon(user, minAge);
    }

    function setUserDefaultVoteWeight(
        address user,
        uint8 defaultVoteWeight
    ) public {
        Users(usersAddress).setUserDefaultVoteWeight(
            user,
            defaultVoteWeight
        );
    }

    function setUserDefaultDonate(
        address user,
        bool donateWinningsByDefault
    ) public {
        Users(usersAddress).setUserDefaultDonate(
            user,
            donateWinningsByDefault
        );
    }

    function createCommunity(
        uint site,
        string calldata name,
        string calldata rules, //IPFS hash
        bool restrictPosting,
        bool restrictVoting,
        bool sponsorPosts,
        address gateAddress,
        address[] calldata mods
    ) public verificationRequired payable {
        require(mods.length >= 5, 'Not enough mods!');
        for(uint i = 0; i < mods.length-1; i++) {
            for(uint j = i+1; j < mods.length; j++) {
                require(mods[i] != mods[j], 'You have double-listed a mod!');
            }
        }
        //TODO: Create the multisig shared among the mods.
        address multiSig = mods[0]; //TODO: don't use this, use the multisig address
        uint tokenId = CommunityToken(communityTokenAddress).makeNew(
            multiSig,
            site,
            name,
            rules, //IPFS hash
            restrictPosting,
            restrictVoting,
            sponsorPosts,
            gateAddress
        );
        CommunityToken(communityTokenAddress).topUpBalance{value: msg.value}(tokenId);
    }

    function createPost(
        bool isTopLevel,
        uint parentId,
        string calldata title,
        string calldata contentURI
    ) public payable {
        // TODO capture nft address here
        //postAddress[msg.sender] =
        //PostToken.safeMint(address(this), uri);
        PostToken(postTokenAddress).makeNew(
            isTopLevel,
            parentId,
            title,
            contentURI,
            msg.sender
        );
        uint communityId = isTopLevel ? parentId : PostToken(postTokenAddress).getCommunityIdForPost(parentId);
        CommunityToken(communityTokenAddress).topUpBalance{value: msg.value}(communityId);
    }

    function vote(uint postId, int8 votes) public verificationRequired {
        int8 currentUpVoteCount = upVoteMap[postId][msg.sender];
        int8 currentDownVoteCount = downVoteMap[postId][msg.sender];
        int8 netCurrentVotes = currentUpVoteCount - currentDownVoteCount;
        int8 amountCurrentTxAdds = votes - netCurrentVotes;
        //TODO: Adjust balances per amountCurrentTxAdds.
        if (votes < 0) {
            downVoteMap[postId][msg.sender] = -votes;
        } else if (votes > 0) {
            upVoteMap[postId][msg.sender] = votes;
        }
        VoteToken(voteTokenAddress).transfer(msg.sender, 1);
    }

    function moderate() public {
       //
    }
}
