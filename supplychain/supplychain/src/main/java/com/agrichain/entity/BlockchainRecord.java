package com.agrichain.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "blockchain_records")
public class BlockchainRecord {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "product_id", unique = true, nullable = false)
    private String productId;
    
    @Column(name = "transaction_hash", nullable = false)
    private String transactionHash;
    
    @Column(name = "encrypted_code", columnDefinition = "TEXT", nullable = false)
    private String encryptedCode;
    
    @Column(name = "timestamp")
    private LocalDateTime timestamp;
    
    // Remove the relationship mapping for now to simplify
    // @OneToOne
    // @JoinColumn(name = "product_id", referencedColumnName = "productId", insertable = false, updatable = false)
    // private Product product;
    
    // Default constructor
    public BlockchainRecord() {}
    
    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getProductId() { return productId; }
    public void setProductId(String productId) { this.productId = productId; }
    public String getTransactionHash() { return transactionHash; }
    public void setTransactionHash(String transactionHash) { this.transactionHash = transactionHash; }
    public String getEncryptedCode() { return encryptedCode; }
    public void setEncryptedCode(String encryptedCode) { this.encryptedCode = encryptedCode; }
    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
    // public Product getProduct() { return product; }
    // public void setProduct(Product product) { this.product = product; }
}