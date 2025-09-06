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
    
    @Value("${blockchain.node.url}")
    private String blockchainNodeUrl;
    
    @Value("${blockchain.contract.address}")
    private String contractAddress;
    
    @Value("${blockchain.private.key}")
    private String privateKey;
    
    public BlockchainRecord registerProductOnBlockchain(Product product) {
        try {
            Web3j web3j = Web3j.build(new HttpService(blockchainNodeUrl));
            Credentials credentials = Credentials.create(privateKey);
            TransactionManager transactionManager = new RawTransactionManager(web3j, credentials, 1337);
            
            // For now, we'll simulate the blockchain interaction
            // In a real implementation, you would use the actual contract ABI
            
            String simulatedTxHash = "0x" + java.util.UUID.randomUUID().toString().replace("-", "");
            
            BlockchainRecord record = new BlockchainRecord();
            record.setProductId(product.getProductId());
            record.setTransactionHash(simulatedTxHash);
            record.setEncryptedCode(generateEncryptedCode(product));
            record.setTimestamp(java.time.LocalDateTime.now());
            
            return record;
            
        } catch (Exception e) {
            throw new RuntimeException("Failed to register product on blockchain", e);
        }
    }
    
    private String generateEncryptedCode(Product product) {
        String data = product.getProductId() + "|" + product.getName() + "|" + 
                     product.getFarmLocation() + "|" + System.currentTimeMillis();
        return java.util.Base64.getEncoder().encodeToString(data.getBytes());
    }
    
    public Product verifyProduct(String encryptedCode) {
        try {
            java.util.Optional<com.agrichain.entity.BlockchainRecord> recordOpt = blockchainRecordRepository.findByEncryptedCode(encryptedCode);
            if (recordOpt.isPresent()) {
                String productId = recordOpt.get().getProductId();
                java.util.Optional<Product> productOpt = productRepository.findByProductId(productId);
                if (productOpt.isPresent()) {
                    return productOpt.get();
                } else {
                    throw new RuntimeException("Product not found for this encrypted code");
                }
            } else {
                throw new RuntimeException("Encrypted code not found in blockchain/database");
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to verify product: " + e.getMessage());
        }
    }
}