import { ethers } from "hardhat";
import { MyNFT } from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
import { expect } from "chai";

describe("MyNFT", () => {
    let myNFT: MyNFT;
    let owner: SignerWithAddress;
    let addr1: SignerWithAddress;

    beforeEach(async () => {
        [owner, addr1] = await ethers.getSigners();

        const myNftFactory = await ethers.getContractFactory("MyNFT");
        myNFT = await myNftFactory.deploy() as MyNFT;

        await myNFT.waitForDeployment();
    })

    describe("Deployment", () => {
        it("Should set the right owner", async () => {
            expect(await myNFT.owner()).to.equal(owner.address);
        });

        it("should deploy and set tokenCounter to 0", async () => {
            expect(await myNFT.tokenCounter()).to.equal(0);
        })
    })

    describe("Minting", () => {
        it("should mint a new token and increment counter", async () => {
            const tokenId = await myNFT.mintNFT(addr1.address, "https://example.com/nft/1");
            await tokenId.wait();
            expect(await myNFT.tokenCounter()).to.equal(1);
            expect(await myNFT.ownerOf(0)).to.equal(addr1.address);
            expect(await myNFT.tokenURI(0)).to.equal("https://example.com/nft/1");
        })

        it("should only allow owner to mint", async () => {
            const myNFTFromAddr1 = myNFT.connect(addr1);
            await expect(
              myNFTFromAddr1.mintNFT(addr1.address, "ipfs://fake-uri")
            ).to.be.reverted;
        });
    })

    describe("Burning", () => {
        it("should burn a token", async () => {
            const tokenId = await myNFT.mintNFT(addr1.address, "https://example.com/nft/1");
            await tokenId.wait();
            
            // Connect as addr1 (the token owner) to burn the token
            const myNFTFromAddr1 = myNFT.connect(addr1);
            await myNFTFromAddr1.burnToken(0);
            
            // Check that the token no longer exists
            await expect(myNFT.ownerOf(0)).to.be.reverted;
        })
    })
})