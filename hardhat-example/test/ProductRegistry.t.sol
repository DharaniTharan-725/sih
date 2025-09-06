// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "forge-std/Test.sol";
import "../contracts/ProductRegistry.sol";

contract ProductRegistryTest is Test {
    ProductRegistry public productRegistry;
    address public farmer = address(0x123);
    address public user = address(0x456);

    function setUp() public {
        productRegistry = new ProductRegistry();
    }

    function testRegisterProduct() public {
        vm.prank(farmer);
        productRegistry.registerProduct(
            "Organic Apples",
            "Fruits",
            "2024-01-15",
            "08:00",
            "California Farm",
            "Premium",
            1000,
            "Fresh organic apples"
        );

        (uint256 id, string memory name, , , , , , uint256 price, , address productFarmer) = productRegistry.products(0);
        assertEq(id, 0);
        assertEq(name, "Organic Apples");
        assertEq(price, 1000);
        assertEq(productFarmer, farmer);
    }

    function testGetProduct() public {
        vm.prank(farmer);
        productRegistry.registerProduct(
            "Organic Apples",
            "Fruits",
            "2024-01-15",
            "08:00",
            "California Farm",
            "Premium",
            1000,
            "Fresh organic apples"
        );

        ProductRegistry.Product memory product = productRegistry.getProduct(0);
        assertEq(product.name, "Organic Apples");
        assertEq(product.farmer, farmer);
    }
}