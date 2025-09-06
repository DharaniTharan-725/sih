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
            // Generate unique product ID if not provided
            if (product.getProductId() == null || product.getProductId().isEmpty()) {
                product.setProductId("AGR-" + UUID.randomUUID().toString().substring(0, 8));
            }

            product.setCreatedAt(LocalDateTime.now());
            Product savedProduct = productRepository.save(product);

            // Register on blockchain and save BlockchainRecord
            BlockchainRecord record = blockchainService.registerProductOnBlockchain(savedProduct);
            blockchainRecordRepository.save(record);

            // Generate QR code using the encrypted code
            String qrCodeText = record.getEncryptedCode();
            String qrCodeImage = qrCodeService.generateQRCodeImage(qrCodeText, 300, 300);

            Map<String, Object> response = new HashMap<>();
            response.put("product", savedProduct);
            response.put("qrCode", qrCodeImage);
            response.put("encryptedCode", qrCodeText);
            response.put("message", "Product registered successfully");

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to register product: " + e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
    
    @GetMapping("/verify/{encryptedCode}")
    public ResponseEntity<Map<String, Object>> verifyProduct(@PathVariable String encryptedCode) {
        try {
            Product product = blockchainService.verifyProduct(encryptedCode);
            
            Map<String, Object> response = new HashMap<>();
            response.put("product", product);
            response.put("verified", true);
            response.put("message", "Product verified successfully");
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Failed to verify product: " + e.getMessage());
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
}