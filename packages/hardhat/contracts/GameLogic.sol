// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "./CommunityToken.sol";
import "./VoteToken.sol";
import "./PostToken.sol";

contract GameLogic is AccessControl {
    struct User {
        uint8 defaultVoteWeight;
        bool donateWinningsByDefault;
        bool hasVerifiedOrb;
        bool hasVerifiedPhone;
        bool hasVerifiedSismo;
        bool hasVerifiedPolygon13;
        bool hasVerifiedPolygon18;
    }

    event VerificationCompletedOrb(address user);
    event VerificationCompletedPhone(address user);
    event VerificationCompletedSismo(address user);
    event VerificationCompletedPolygon13(address user);
    event VerificationCompletedPolygon18(address user);
    event DefaultVoteWeightChanged(address user, uint8 defaultVoteWeight);
    event DonationDefaultSet(address user, bool donatesByDefaultNow);

    address public communityTokenAddress;
    address public postTokenAddress;
    address public voteTokenAddress;
    // upvote post address => (user address, count)
    mapping (address => mapping (address => int8)) public upVoteMap;
    //mapping (address => uint256) public upVoteMap;
    // downvote post address => count
    mapping (address => mapping (address => int8)) public downVoteMap;
    // user address => nft address
    mapping (address => address) public postAddress;
    mapping (address => User) public users;

    constructor(address _CommunityToken, address _VoteToken, address _PostToken) {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        communityTokenAddress = _CommunityToken;
        postTokenAddress = _PostToken;
        voteTokenAddress = _VoteToken;
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
    ) public payable {
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

    function verifyUserWorldcoinOrb(
        address user
    ) public {
        //requrire(tx comes from user)
        //require(Worldcoin claims personhood via orb)
        users[user].hasVerifiedOrb = true;
        emit VerificationCompletedOrb(user);
    }
    //Could combine immediately preceding & following functions
    //if Worldcoin gives one verification function that returns an
    //indication of which verification method(s) the user has completed.
    function verifyUserWorldcoinPhone(
        address user
    ) public {
        //requrire(tx comes from user)
        //require(Worldcoin claims personhood via phone)
        users[user].hasVerifiedPhone = true;
        emit VerificationCompletedPhone(user);
    }

    function verifyUserSismo(
        address user
    ) public {
        //requrire(tx comes from user)
        //require(Sismo claims personhood)
        users[user].hasVerifiedSismo = true;
        emit VerificationCompletedSismo(user);
    }

    function verifyUserPolygon(
        address user,
        uint8 minAge //should be 13 or 18
    ) public {
        //requrire(tx comes from user)
        //require(Polygon claims user has over minimum age)
        //TODO: Call Polygon ID on-chain verification for the specified minimum age.
        //Revert/don't reach the below code if that fails.
        if(minAge >= 18) {
            users[user].hasVerifiedPolygon18 = true;
            emit VerificationCompletedPolygon18(user);
        } else if (minAge >= 13) {
            users[user].hasVerifiedPolygon13 = true;
            emit VerificationCompletedPolygon13(user);
        }
    }

    function setUserDefaultVoteWeight(
        address user,
        uint8 defaultVoteWeight
    ) public {
        //requrire(tx comes from user)
        emit DefaultVoteWeightChanged(user, defaultVoteWeight);
        users[user].defaultVoteWeight = defaultVoteWeight;
    }

    function setUserDefaultDonate(
        address user,
        bool donateWinningsByDefault
    ) public {
        //requrire(tx comes from user)
        emit DonationDefaultSet(user, donateWinningsByDefault);
        users[user].donateWinningsByDefault = donateWinningsByDefault;
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

    function vote(address _postAddress, int8 votes) public {
        int8 currentUpVoteCount = upVoteMap[_postAddress][msg.sender];
        int8 currentDownVoteCount = downVoteMap[_postAddress][msg.sender];
        int8 netCurrentVotes = currentUpVoteCount - currentDownVoteCount;
        int8 amountCurrentTxAdds = votes - netCurrentVotes;
        //TODO: Adjust balances per amountCurrentTxAdds.
        if (votes < 0) {
            downVoteMap[_postAddress][msg.sender] = -votes;
        } else if (votes > 0) {
            upVoteMap[_postAddress][msg.sender] = votes;
        }
        VoteToken(voteTokenAddress).transfer(msg.sender, 1);
    }

    function moderate() public {
       //     
    }
}
