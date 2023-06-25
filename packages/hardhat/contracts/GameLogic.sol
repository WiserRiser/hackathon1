// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "./CommunityToken.sol";
import "./VoteToken.sol";
import "./PostToken.sol";
import "./polygon/lib/GenesisUtils.sol";
import "./polygon/interfaces/ICircuitValidator.sol";
import "./polygon/verifiers/ZKPVerifier.sol";

contract GameLogic is AccessControl, ZKPVerifier {
    uint64 public constant TRANSFER_REQUEST_ID = 1;

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
    event ReceivedInitialAirdrop(address user);
    event DefaultVoteWeightChanged(address user, uint8 defaultVoteWeight);
    event DonationDefaultSet(address user, bool donatesByDefaultNow);

    address public communityTokenAddress;
    address public postTokenAddress;
    address public voteTokenAddress;
    // upvote post address => (user address, count)
    mapping (uint => mapping (address => int8)) public upVoteMap;
    //mapping (address => uint256) public upVoteMap;
    // downvote post address => count
    mapping (uint => mapping (address => int8)) public downVoteMap;
    // user address => nft address
    mapping (address => address) public postAddress;
    mapping (address => User) public users;

    //For Polygon id
    mapping(uint256 => address) public idToAddress;
    mapping(address => uint256) public addressToId;

    constructor(address _CommunityToken, address _VoteToken, address _PostToken) {
        _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());
        communityTokenAddress = _CommunityToken;
        postTokenAddress = _PostToken;
        voteTokenAddress = _VoteToken;
    }

    modifier verificationRequired() {
        require(
            proofs[msg.sender][TRANSFER_REQUEST_ID] == true && hasVerifiedPersonhood(_msgSender()),
            "only identities who provided proof are allowed to take this action"
        );
        _;
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

    function verifyUserWorldcoinOrb(
        address user
    ) public {
        //requrire(tx comes from user)
        //require(Worldcoin claims personhood via orb)
        bool eligibleForTokens = !hasVerifiedPersonhood(user) && hasVerifiedAge(user);
        users[user].hasVerifiedOrb = true;
        emit VerificationCompletedOrb(user);
        if(eligibleForTokens) {
            airdropInitialTokens(user);
        }
    }
    //Could combine immediately preceding & following functions
    //if Worldcoin gives one verification function that returns an
    //indication of which verification method(s) the user has completed.
    function verifyUserWorldcoinPhone(
        address user
    ) public {
        //requrire(tx comes from user)
        //require(Worldcoin claims personhood via phone)
        bool eligibleForTokens = !hasVerifiedPersonhood(user) && hasVerifiedAge(user);
        users[user].hasVerifiedPhone = true;
        emit VerificationCompletedPhone(user);
        if(eligibleForTokens) {
            airdropInitialTokens(user);
        }
    }

    function verifyUserSismo(
        address user
    ) public {
        //requrire(tx comes from user)
        //require(Sismo claims personhood)
        bool eligibleForTokens = !hasVerifiedPersonhood(user) && hasVerifiedAge(user);
        users[user].hasVerifiedSismo = true;
        emit VerificationCompletedSismo(user);
        if(eligibleForTokens) {
            airdropInitialTokens(user);
        }
    }

    function hasVerifiedPersonhood(
        address user
    ) public view returns (bool) {
        User storage userStruct = users[user];
        return userStruct.hasVerifiedOrb || userStruct.hasVerifiedPhone || userStruct.hasVerifiedSismo;
    }

    function hasVerifiedAge(
        address user
    ) public view returns (bool) {
        User storage userStruct = users[user];
        return userStruct.hasVerifiedPolygon13 || userStruct.hasVerifiedPolygon18;
    }

    function airdropInitialTokens(
        address user
    ) private {
        VoteToken(voteTokenAddress).mint(user, 2000);
        emit ReceivedInitialAirdrop(user);
    }

    //Based on https://0xpolygonid.github.io/tutorials/verifier/on-chain-verification/overview/#user-demo-claim-the-airdrop
    function _beforePolygonProofSubmit(
        uint64, /* requestId */
        uint256[] memory inputs,
        ICircuitValidator validator
    ) internal view {
        // check that the challenge input of the proof is equal to the msg.sender
        address addr = GenesisUtils.int256ToAddress(
            inputs[validator.getChallengeInputIndex()]
        );
        require(
            _msgSender() == addr,
            "address in the proof is not a sender address"
        );
    }

    function _afterPolygonProofSubmit(
        uint64 requestId,
        uint256[] memory inputs,
        ICircuitValidator validator
    ) internal {
        require(
            requestId == TRANSFER_REQUEST_ID && addressToId[_msgSender()] == 0,
            "proof can not be submitted more than once"
        );

        uint256 id = inputs[validator.getChallengeInputIndex()];
        // execute the airdrop
        if (idToAddress[id] == address(0)) {
            addressToId[_msgSender()] = id;
            idToAddress[id] = _msgSender();
        }
    }

    function verifyUserPolygon(
        address user,
        uint8 minAge //should be 13 or 18
    ) public {
        //requrire(tx comes from user)


        //require(Polygon claims user has over minimum age)
        //TODO: Call Polygon ID on-chain verification for the specified minimum age.
        //Revert/don't reach the below code if that fails.
        bool eligibleForTokens = hasVerifiedPersonhood(user) && !hasVerifiedAge(user);
        if(minAge >= 18) {
            users[user].hasVerifiedPolygon18 = true;
            emit VerificationCompletedPolygon18(user);
        } else if (minAge >= 13) {
            users[user].hasVerifiedPolygon13 = true;
            emit VerificationCompletedPolygon13(user);
        }
        if(eligibleForTokens) {
            airdropInitialTokens(user);
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
