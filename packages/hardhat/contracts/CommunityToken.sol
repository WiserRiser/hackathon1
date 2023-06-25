// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract CommunityToken is ERC721, ERC721Burnable, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;

    struct Community {
        uint site;
        string name;
        string rules; //IPFS hash
        bool restrictPosting;
        bool restrictVoting;
        bool sponsorPosts;
        address gateAddress;
    }

    // The internal ID tracker
    uint256 private _currentMaxId;
    mapping(uint => uint) balance; //community id => wei

    mapping(uint256 => Community) public details;

    constructor() ERC721("CommunityToken", "YUNE") {
        //msg.sender;
    }

    function makeNew(
        address modMultiSig,
        uint site,
        string calldata name,
        string calldata rules, //IPFS hash
        bool restrictPosting,
        bool restrictVoting,
        bool sponsorPosts,
        address gateAddress
    ) public onlyOwner returns (uint) {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        details[tokenId] = Community(
            site,
            name,
            rules, //IPFS hash
            restrictPosting,
            restrictVoting,
            sponsorPosts,
            gateAddress
        );
        _safeMint(modMultiSig, tokenId);
        //_setTokenURI(tokenId, uri);
        return tokenId;
    }

    function topUpBalance(uint256 tokenId) public payable {
        balance[tokenId] += msg.value;
    }

    // The following function is an override required by Solidity for ERC721URIStorage.

    function _burn(uint256 tokenId) internal override(ERC721) {
        super._burn(tokenId);
    }
}
