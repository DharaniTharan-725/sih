package com.agrichain.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "products")
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Product ID (optional)
    @Column(name = "product_id", unique = true)
    private String productId;

    // Product Name
    @Column(name = "product_name", nullable = false)
    private String productName;

    // Category
    @Column(name = "category")
    private String category;

    // Date of Manufacture
    @Column(name = "date_of_manufacture")
    private String dateOfManufacture;

    // Time
    @Column(name = "manufacture_time")
    private String time;

    // Place
    @Column(name = "place", columnDefinition = "TEXT")
    private String place;

    // Quality Rating
    @Column(name = "quality_rating")
    private String qualityRating;

    // Price for Farmer
    @Column(name = "price_for_farmer")
    private Double priceForFarmer;

    // Description
    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    // Created At
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    // Default constructor
    public Product() {}

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getProductId() { return productId; }
    public void setProductId(String productId) { this.productId = productId; }

    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getDateOfManufacture() { return dateOfManufacture; }
    public void setDateOfManufacture(String dateOfManufacture) { this.dateOfManufacture = dateOfManufacture; }

    public String getTime() { return time; }
    public void setTime(String time) { this.time = time; }

    public String getPlace() { return place; }
    public void setPlace(String place) { this.place = place; }

    // Add this method to fix the getFarmLocation() error
    public String getFarmLocation() {
        return this.place;
    }

    public String getQualityRating() { return qualityRating; }
    public void setQualityRating(String qualityRating) { this.qualityRating = qualityRating; }

    public Double getPriceForFarmer() { return priceForFarmer; }
    public void setPriceForFarmer(Double priceForFarmer) { this.priceForFarmer = priceForFarmer; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}