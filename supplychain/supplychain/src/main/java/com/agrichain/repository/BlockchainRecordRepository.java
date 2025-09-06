package com.agrichain.repository;

import com.agrichain.entity.BlockchainRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
@Repository 
public interface BlockchainRecordRepository extends JpaRepository<BlockchainRecord, Long> {
    Optional<BlockchainRecord> findByProductId(String productId);
    Optional<BlockchainRecord> findByEncryptedCode(String encryptedCode);
} 
