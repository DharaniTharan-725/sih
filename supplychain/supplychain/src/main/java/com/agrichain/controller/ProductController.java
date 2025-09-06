package com.agrichain.controller;

import com.agrichain.entity.Product;
import com.agrichain.entity.BlockchainRecord;
import com.agrichain.service.BlockchainService;
import com.agrichain.service.QRCodeService;
import com.agrichain.repository.ProductRepository;
import com.agrichain.repository.BlockchainRecordRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "*")
public class ProductController {
    
    @Autowired
    private ProductRepository productRepository;
    
    @Autowired
    private BlockchainRecordRepository blockchainRecordRepository;
    
    @Autowired
    private BlockchainService blockchainService;
    
    @Autowired
    private QRCodeService qrCodeService;
    
    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> registerProduct(@RequestBody Product product) {
        try {
            System.out.println("Received product registration request: " + product.getProductName());
            
            // Generate unique product ID if not provided
            if (product.getProductId() == null || product.getProductId().isEmpty()) {
                String generatedId = "AGR-" + UUID.randomUUID().toString().substring(0, 8);
                product.setProductId(generatedId);
                System.out.println("Generated product ID: " + generatedId);
            }

            product.setCreatedAt(LocalDateTime.now());
            Product savedProduct = productRepository.save(product);
            System.out.println("Product saved to database with ID: " + savedProduct.getId());

            // Register on blockchain and save BlockchainRecord
            BlockchainRecord record = blockchainService.registerProductOnBlockchain(savedProduct);
            System.out.println("Blockchain record created for product: " + savedProduct.getProductId());
            
            try {
                BlockchainRecord savedRecord = blockchainRecordRepository.save(record);
                System.out.println("Blockchain record saved to database with ID: " + savedRecord.getId());
            } catch (Exception ex) {
                System.err.println("Error saving BlockchainRecord: " + ex.getMessage());
                ex.printStackTrace();
                throw new RuntimeException("Failed to save blockchain record: " + ex.getMessage());
            }

            // Generate QR code using the encrypted code
            String qrCodeText = record.getEncryptedCode();
            System.out.println("Generating QR code for encrypted code: " + qrCodeText);
            String qrCodeImage = "data:image/png;base64," + qrCodeService.generateQRCodeImage(qrCodeText, 300, 300);
            System.out.println("QR code generated successfully");

            Map<String, Object> response = new HashMap<>();
            response.put("product", savedProduct);
            response.put("qrCode", qrCodeImage);
            response.put("encryptedCode", qrCodeText);
            response.put("message", "Product registered successfully");

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            System.err.println("Error in registerProduct: " + e.getMessage());
            e.printStackTrace();
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to register product: " + e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
    
    @GetMapping("/verify/{encryptedCode}")
    public ResponseEntity<Map<String, Object>> verifyProduct(@PathVariable String encryptedCode) {
        try {
            System.out.println("Verification request for encrypted code: " + encryptedCode);
            
            // First try to find the product using the encrypted code
            Optional<BlockchainRecord> recordOpt = blockchainRecordRepository.findByEncryptedCode(encryptedCode);
            
            if (!recordOpt.isPresent()) {
                System.out.println("No blockchain record found for encrypted code: " + encryptedCode);
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("error", "Product not found for this encrypted code");
                errorResponse.put("success", false);
                errorResponse.put("verified", false);
                return ResponseEntity.status(404).body(errorResponse);
            }
            
            BlockchainRecord record = recordOpt.get();
            System.out.println("Found blockchain record for product ID: " + record.getProductId());
            
            // Now find the actual product
            Optional<Product> productOpt = productRepository.findByProductId(record.getProductId());
            
            if (!productOpt.isPresent()) {
                System.out.println("No product found for ID: " + record.getProductId());
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("error", "Product details not found");
                errorResponse.put("success", false);
                errorResponse.put("verified", false);
                return ResponseEntity.status(404).body(errorResponse);
            }
            
            Product product = productOpt.get();
            System.out.println("Product verification successful for: " + product.getProductId());
            
            Map<String, Object> response = new HashMap<>();
            response.put("product", product);
            response.put("success", true);
            response.put("verified", true);
            response.put("message", "Product verified successfully");
            response.put("transactionHash", record.getTransactionHash());
            response.put("blockchainTimestamp", record.getTimestamp());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.err.println("Error in verifyProduct: " + e.getMessage());
            e.printStackTrace();
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to verify product: " + e.getMessage());
            errorResponse.put("success", false);
            errorResponse.put("verified", false);
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
    
    @GetMapping("/{productId}")
    public ResponseEntity<Product> getProduct(@PathVariable String productId) {
        Optional<Product> product = productRepository.findByProductId(productId);
        return product.map(ResponseEntity::ok)
                     .orElse(ResponseEntity.notFound().build());
    }
    
    // Debug endpoint to check all blockchain records
    @GetMapping("/debug/records")
    public ResponseEntity<Iterable<BlockchainRecord>> getAllBlockchainRecords() {
        return ResponseEntity.ok(blockchainRecordRepository.findAll());
    }
    
    // Debug endpoint to check all products
    @GetMapping("/debug/products")
    public ResponseEntity<Iterable<Product>> getAllProducts() {
        return ResponseEntity.ok(productRepository.findAll());
    }
}