// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MyNFT is ERC721URIStorage, Ownable {

    uint public tokenCounter;

    constructor() ERC721("MyFirstNFT", "MFN") Ownable(msg.sender) {
        tokenCounter = 0;
    }

    function mintNFT(address to, string memory uri) public onlyOwner returns (uint256) {
        uint newTokenId = tokenCounter;
        _safeMint(to, newTokenId);
        _setTokenURI(newTokenId, uri);
        // Transfer event is automatically emitted by _safeMint
        tokenCounter++;
        return newTokenId;
    }

    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        return super.tokenURI(tokenId);
    }

    // Custom burn function for token owners
    function burnToken(uint256 tokenId) public {
        if (msg.sender != ownerOf(tokenId)) {
            revert("You are not the owner");
        }
        _burn(tokenId);
    }
}