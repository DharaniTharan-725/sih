import { ethers } from "hardhat";

async function main() {
  console.log("Deploying ProductRegistry...");
  
  const ProductRegistry = await ethers.getContractFactory("ProductRegistry");
  const productRegistry = await ProductRegistry.deploy();
  
  await productRegistry.waitForDeployment();
  
  console.log("ProductRegistry deployed to:", await productRegistry.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});