import { ethers } from "hardhat";

async function main() {
    const myNftFactory = await ethers.getContractFactory("MyNFT");
    const myNftContract = await myNftFactory.deploy();

    // Wait for the transaction to be mined and confirmed
    await myNftContract.waitForDeployment();

    // Get the contract address
    const contractAddress = await myNftContract.getAddress();
    
    console.log(`MyNFT deployed to: ${contractAddress}`);

    return contractAddress;
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
    
