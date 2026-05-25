package com.services.in.repository;

 
import com.services.in.entity.WalletTransaction;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface WalletTransactionRepository extends JpaRepository<WalletTransaction, Long> {
    List<WalletTransaction> findByMobileNumberOrderByCreatedAtDesc(String mobileNumber);
}