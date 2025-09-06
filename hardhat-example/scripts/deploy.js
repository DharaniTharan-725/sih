const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("Deploying ProductRegistry...");
  
  const ProductRegistry = await ethers.getContractFactory("ProductRegistry");
  const productRegistry = await ProductRegistry.deploy();
  
  // Wait for deployment to complete
  await productRegistry.waitForDeployment();
  
  const contractAddress = await productRegistry.getAddress();
  console.log("ProductRegistry deployed to:", contractAddress);
  
  // Save contract address and ABI for frontend
  const contractsDir = path.join(__dirname, "..", "frontend", "src", "contracts");
  
  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir, { recursive: true });
  }
  
  // Save contract address
  fs.writeFileSync(
    path.join(contractsDir, "contract-address.json"),
    JSON.stringify({ ProductRegistry: contractAddress }, undefined, 2)
  );
  
  // Save contract ABI
  const ProductRegistryArtifact = await artifacts.readArtifact("ProductRegistry");
  
  fs.writeFileSync(
    path.join(contractsDir, "ProductRegistry.json"),
    JSON.stringify(ProductRegistryArtifact, null, 2)
  );
  
  console.log("Contract artifacts saved to frontend directory");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });