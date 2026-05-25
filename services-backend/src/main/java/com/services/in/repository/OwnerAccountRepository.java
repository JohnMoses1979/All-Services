package com.services.in.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.services.in.entity.OwnerAccount;

@Repository
public interface OwnerAccountRepository extends JpaRepository<OwnerAccount, Long> {

    Optional<OwnerAccount> findByMobile(String mobile);

    boolean existsByMobile(String mobile);
}
