package com.services.in.repository;

 
import com.services.in.entity.Wallet;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface WalletRepository extends JpaRepository<Wallet, Long> {
    Optional<Wallet> findByMobileNumber(String mobileNumber);
}
