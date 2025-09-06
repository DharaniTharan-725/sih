// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract ProductRegistry {
    struct Product {
        uint256 id;
        string name;
        string category;
        string dateOfHarvest;
        string timeOfHarvest;
        string farmLocation;
        string qualityRating;
        uint256 pricePerUnit;
        string description;
        address farmer;
        bool isAvailable;
        uint256 createdAt;
        uint256 updatedAt;
    }

    struct Farmer {
        address farmerAddress;
        string name;
        string contactInfo;
        uint256 totalProducts;
        bool isRegistered;
    }

    mapping(uint256 => Product) public products;
    mapping(address => Farmer) public farmers;
    mapping(address => uint256[]) public farmerProducts;
    mapping(string => uint256[]) public categoryProducts;
    
    uint256 public nextProductId;
    address public owner;

    event ProductRegistered(
        uint256 id,
        string name,
        string category,
        string dateOfHarvest,
        string timeOfHarvest,
        string farmLocation,
        string qualityRating,
        uint256 pricePerUnit,
        string description,
        address farmer
    );

    event ProductUpdated(
        uint256 id,
        uint256 pricePerUnit,
        string qualityRating,
        bool isAvailable,
        uint256 updatedAt
    );

    event FarmerRegistered(
        address farmerAddress,
        string name,
        string contactInfo
    );

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    modifier onlyFarmer() {
        require(farmers[msg.sender].isRegistered, "Only registered farmers can call this function");
        _;
    }

    modifier productExists(uint256 _id) {
        require(_id < nextProductId, "Product does not exist");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function registerFarmer(
        string memory _name,
        string memory _contactInfo
    ) public {
        require(!farmers[msg.sender].isRegistered, "Farmer already registered");
        
        farmers[msg.sender] = Farmer({
            farmerAddress: msg.sender,
            name: _name,
            contactInfo: _contactInfo,
            totalProducts: 0,
            isRegistered: true
        });

        emit FarmerRegistered(msg.sender, _name, _contactInfo);
    }

    function registerProduct(
        string memory _name,
        string memory _category,
        string memory _dateOfHarvest,
        string memory _timeOfHarvest,
        string memory _farmLocation,
        string memory _qualityRating,
        uint256 _pricePerUnit,
        string memory _description
    ) public onlyFarmer {
        require(bytes(_name).length > 0, "Product name is required");
        require(bytes(_category).length > 0, "Category is required");
        require(_pricePerUnit > 0, "Price must be greater than 0");

        products[nextProductId] = Product({
            id: nextProductId,
            name: _name,
            category: _category,
            dateOfHarvest: _dateOfHarvest,
            timeOfHarvest: _timeOfHarvest,
            farmLocation: _farmLocation,
            qualityRating: _qualityRating,
            pricePerUnit: _pricePerUnit,
            description: _description,
            farmer: msg.sender,
            isAvailable: true,
            createdAt: block.timestamp,
            updatedAt: block.timestamp
        });

        farmerProducts[msg.sender].push(nextProductId);
        categoryProducts[_category].push(nextProductId);
        farmers[msg.sender].totalProducts++;

        emit ProductRegistered(
            nextProductId,
            _name,
            _category,
            _dateOfHarvest,
            _timeOfHarvest,
            _farmLocation,
            _qualityRating,
            _pricePerUnit,
            _description,
            msg.sender
        );

        nextProductId++;
    }

    function updateProduct(
        uint256 _id,
        uint256 _pricePerUnit,
        string memory _qualityRating,
        bool _isAvailable
    ) public productExists(_id) {
        Product storage product = products[_id];
        require(product.farmer == msg.sender, "Only product owner can update");
        require(_pricePerUnit > 0, "Price must be greater than 0");

        product.pricePerUnit = _pricePerUnit;
        product.qualityRating = _qualityRating;
        product.isAvailable = _isAvailable;
        product.updatedAt = block.timestamp;

        emit ProductUpdated(_id, _pricePerUnit, _qualityRating, _isAvailable, block.timestamp);
    }

    function getProduct(uint256 _id) public view productExists(_id) returns (Product memory) {
        return products[_id];
    }

    function getAllProducts() public view returns (Product[] memory) {
        Product[] memory allProducts = new Product[](nextProductId);
        for (uint256 i = 0; i < nextProductId; i++) {
            allProducts[i] = products[i];
        }
        return allProducts;
    }

    function getProductsByFarmer(address _farmer) public view returns (Product[] memory) {
        uint256[] storage productIds = farmerProducts[_farmer];
        Product[] memory farmerProductsList = new Product[](productIds.length);
        
        for (uint256 i = 0; i < productIds.length; i++) {
            farmerProductsList[i] = products[productIds[i]];
        }
        
        return farmerProductsList;
    }

    function getProductsByCategory(string memory _category) public view returns (Product[] memory) {
        uint256[] storage productIds = categoryProducts[_category];
        Product[] memory categoryProductsList = new Product[](productIds.length);
        
        for (uint256 i = 0; i < productIds.length; i++) {
            categoryProductsList[i] = products[productIds[i]];
        }
        
        return categoryProductsList;
    }

    function getAvailableProducts() public view returns (Product[] memory) {
        uint256 availableCount = 0;
        
        // First, count available products
        for (uint256 i = 0; i < nextProductId; i++) {
            if (products[i].isAvailable) {
                availableCount++;
            }
        }
        
        // Then, create and populate the array
        Product[] memory availableProducts = new Product[](availableCount);
        uint256 currentIndex = 0;
        
        for (uint256 i = 0; i < nextProductId; i++) {
            if (products[i].isAvailable) {
                availableProducts[currentIndex] = products[i];
                currentIndex++;
            }
        }
        
        return availableProducts;
    }

    function getTotalProducts() public view returns (uint256) {
        return nextProductId;
    }

    function getFarmerInfo(address _farmer) public view returns (Farmer memory) {
        return farmers[_farmer];
    }

    function isProductAvailable(uint256 _id) public view productExists(_id) returns (bool) {
        return products[_id].isAvailable;
    }

    function getProductsCountByFarmer(address _farmer) public view returns (uint256) {
        return farmerProducts[_farmer].length;
    }

    function getProductsCountByCategory(string memory _category) public view returns (uint256) {
        return categoryProducts[_category].length;
    }

    // Owner functions for management
    function updateProductAvailability(uint256 _id, bool _isAvailable) public onlyOwner productExists(_id) {
        products[_id].isAvailable = _isAvailable;
        products[_id].updatedAt = block.timestamp;
        
        emit ProductUpdated(_id, products[_id].pricePerUnit, products[_id].qualityRating, _isAvailable, block.timestamp);
    }

    function getContractStats() public view returns (
        uint256 totalProducts,
        uint256 totalFarmers,
        uint256 availableProducts
    ) {
        totalProducts = nextProductId;
        availableProducts = 0;
        
        for (uint256 i = 0; i < nextProductId; i++) {
            if (products[i].isAvailable) {
                availableProducts++;
            }
        }
        
        // Count registered farmers
        totalFarmers = 0;
        // This would require iterating through all possible addresses, which isn't practical
        // In a real scenario, you might maintain a separate array of farmer addresses
    }
}