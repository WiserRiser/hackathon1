pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract PostToken is ERC721, ERC721URIStorage, ERC721Burnable, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;

    struct Post {
        bool isTopLevel;
        uint parentId;
        string title;
        string contentURI;
        address author;
        bool isDeleted;
        bool isModerated;
        bool isModeratedUp;
    }

    mapping(uint256 => Post) public details;

    constructor() ERC721("PostToken", "POST") {
        //msg.sender;
    }

    function makeNew(
        bool isTopLevel,
        uint parentId,
        string calldata title,
        string calldata contentURI,
        address author
    ) public returns (uint256) {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        details[tokenId] = Post(
            isTopLevel,
            parentId,
            title,
            contentURI,
            author,
            false,
            false,
            false
        );
        //TODO: Get address of parent and have it owned by the parent!
        _safeMint(author, tokenId);
        return tokenId;
    }

    function getCommunityIdForPost(uint postId) public view returns (uint) {
        PostToken.Post memory post = details[postId];
        return (post.isTopLevel) ? post.parentId : getCommunityIdForPost(post.parentId);
    }

    function getAuthorForPost(uint postId) public view returns (address) {
        return details[postId].author;
    }

    function safeMint(address to, string memory uri) public onlyOwner {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
    }

    // The following function is an override required by Solidity for ERC721URIStorage.

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }
}
