import { expect } from "chai";
import { ethers } from "hardhat";

describe("ProductRegistry", function () {
  it("Should register a product", async function () {
    const ProductRegistry = await ethers.getContractFactory("ProductRegistry");
    const productRegistry = await ProductRegistry.deploy();
    
    const [owner, farmer] = await ethers.getSigners();
    
    await productRegistry.connect(farmer).registerProduct(
      "Organic Apples",
      "Fruits",
      "2024-01-15",
      "08:00",
      "California Farm",
      "Premium",
      ethers.parseEther("0.001"),
      "Fresh organic apples"
    );
    
    const product = await productRegistry.products(0);
    expect(product.name).to.equal("Organic Apples");
    expect(product.farmer).to.equal(farmer.address);
  });
});