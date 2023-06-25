// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.9;

import "./CommunityToken.sol";
import "./VoteToken.sol";
import "./PostToken.sol";
import "./polygon/lib/GenesisUtils.sol";
import "./polygon/interfaces/ICircuitValidator.sol";
import "./polygon/verifiers/ZKPVerifier.sol";

contract Users is ZKPVerifier {
    uint64 public constant TRANSFER_REQUEST_ID = 1;
    address public voteTokenAddress;

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

    mapping (address => User) public users;

    //For Polygon id
    mapping(uint256 => address) public idToAddress;
    mapping(address => uint256) public addressToId;

    constructor(address _VoteToken) {
        voteTokenAddress = _VoteToken;
    }

    function verificationRequired(address userAddr) public view returns (bool) {
        require(
            proofs[msg.sender][TRANSFER_REQUEST_ID] == true && hasVerifiedPersonhood(userAddr),
            "only identities who provided proof are allowed to take this action"
        );
        return true;
    }

    function verifyUserWorldcoinOrb(
        address user
    ) public onlyOwner {
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
    ) public onlyOwner {
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

}
