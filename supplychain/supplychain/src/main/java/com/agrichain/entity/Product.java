package com.agrichain.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "products")
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "product_id", unique = true, nullable = false)
    private String productId;
    
    @Column(name = "name", nullable = false)
    private String name;
    
    @Column(name = "category")
    private String category;
    
    @Column(name = "harvest_date")
    private String harvestDate;
    
    @Column(name = "harvest_time")
    private String harvestTime;
    
    @Column(name = "farm_location", columnDefinition = "TEXT")
    private String farmLocation;
    
    @Column(name = "quality_rating")
    private String qualityRating;
    
    @Column(name = "price_per_unit")
    private Double pricePerUnit;
    
    @Column(name = "description", columnDefinition = "TEXT")
    private String description;
    
    @Column(name = "farmer_address")
    private String farmerAddress;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    // Default constructor
    public Product() {}
    
    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getProductId() { return productId; }
    public void setProductId(String productId) { this.productId = productId; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public String getHarvestDate() { return harvestDate; }
    public void setHarvestDate(String harvestDate) { this.harvestDate = harvestDate; }
    public String getHarvestTime() { return harvestTime; }
    public void setHarvestTime(String harvestTime) { this.harvestTime = harvestTime; }
    public String getFarmLocation() { return farmLocation; }
    public void setFarmLocation(String farmLocation) { this.farmLocation = farmLocation; }
    public String getQualityRating() { return qualityRating; }
    public void setQualityRating(String qualityRating) { this.qualityRating = qualityRating; }
    public Double getPricePerUnit() { return pricePerUnit; }
    public void setPricePerUnit(Double pricePerUnit) { this.pricePerUnit = pricePerUnit; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getFarmerAddress() { return farmerAddress; }
    public void setFarmerAddress(String farmerAddress) { this.farmerAddress = farmerAddress; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}