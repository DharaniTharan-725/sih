package com.agrichain.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.web3j.protocol.Web3j;
import org.web3j.protocol.http.HttpService;
import org.web3j.crypto.Credentials;
import org.web3j.tx.RawTransactionManager;
import org.web3j.tx.TransactionManager;
import org.web3j.tx.gas.DefaultGasProvider;

import com.agrichain.entity.BlockchainRecord;
import com.agrichain.entity.Product;

import java.math.BigInteger;

@Service
public class BlockchainService {
    @org.springframework.beans.factory.annotation.Autowired
    private com.agrichain.repository.BlockchainRecordRepository blockchainRecordRepository;
    
    @org.springframework.beans.factory.annotation.Autowired
    private com.agrichain.repository.ProductRepository productRepository;
    
    @Value("${blockchain.node.url:http://localhost:8545}")
    private String blockchainNodeUrl;
    
    @Value("${blockchain.contract.address:0x0000000000000000000000000000000000000000}")
    private String contractAddress;
    
    @Value("${blockchain.private.key:default_private_key}")
    private String privateKey;
    
    public BlockchainRecord registerProductOnBlockchain(Product product) {
        try {
            System.out.println("Starting blockchain registration for product: " + product.getProductId());
            
            // Initialize Web3j with the node URL
            Web3j web3j = Web3j.build(new HttpService(blockchainNodeUrl));
            System.out.println("Web3j initialized with node: " + blockchainNodeUrl);
            
            // Create credentials from private key
            Credentials credentials = Credentials.create(privateKey);
            System.out.println("Credentials created successfully");
            
            // Create transaction manager
            TransactionManager transactionManager = new RawTransactionManager(web3j, credentials, 1337);
            System.out.println("Transaction manager created");
            
            // For now, we'll simulate the blockchain interaction
            // In a real implementation, you would use the actual contract ABI
            
            String simulatedTxHash = "0x" + java.util.UUID.randomUUID().toString().replace("-", "");
            System.out.println("Generated transaction hash: " + simulatedTxHash);
            
            BlockchainRecord record = new BlockchainRecord();
            record.setProductId(product.getProductId());
            record.setTransactionHash(simulatedTxHash);
            record.setEncryptedCode(generateEncryptedCode(product));
            record.setTimestamp(java.time.LocalDateTime.now());
            
            System.out.println("Blockchain record created successfully for product: " + product.getProductId());
            return record;
            
        } catch (Exception e) {
            System.err.println("Error in registerProductOnBlockchain: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to register product on blockchain: " + e.getMessage(), e);
        }
    }
    
    private String generateEncryptedCode(Product product) {
        String data = product.getProductId() + "|" + product.getProductName() + "|" + 
                     product.getPlace() + "|" + System.currentTimeMillis();
        String encryptedCode = java.util.Base64.getEncoder().encodeToString(data.getBytes());
        System.out.println("Generated encrypted code: " + encryptedCode);
        return encryptedCode;
    }
    
    public Product verifyProduct(String encryptedCode) {
        try {
            System.out.println("Verifying product with encrypted code: " + encryptedCode);
            java.util.List<com.agrichain.entity.BlockchainRecord> allRecords = blockchainRecordRepository.findAll();
            System.out.println("All encrypted codes in DB:");
            for (com.agrichain.entity.BlockchainRecord rec : allRecords) {
                System.out.println(rec.getEncryptedCode());
            }
            java.util.Optional<com.agrichain.entity.BlockchainRecord> recordOpt = blockchainRecordRepository.findByEncryptedCode(encryptedCode);
            if (recordOpt.isPresent()) {
                String productId = recordOpt.get().getProductId();
                System.out.println("Found blockchain record for product ID: " + productId);
                java.util.Optional<Product> productOpt = productRepository.findByProductId(productId);
                if (productOpt.isPresent()) {
                    System.out.println("Product verification successful for: " + productId);
                    return productOpt.get();
                } else {
                    throw new RuntimeException("Product not found for this encrypted code");
                }
            } else {
                throw new RuntimeException("Encrypted code not found in blockchain/database");
            }
        } catch (Exception e) {
            System.err.println("Error in verifyProduct: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to verify product: " + e.getMessage(), e);
        }
    }
}