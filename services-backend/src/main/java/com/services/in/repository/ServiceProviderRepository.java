package com.services.in.repository;

import com.services.in.entity.ServiceProvider;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ServiceProviderRepository extends JpaRepository<ServiceProvider, Long> {

    Optional<ServiceProvider> findByEmail(String email);

    Optional<ServiceProvider> findByMobile(String mobile);

    boolean existsByEmail(String email);

    boolean existsByMobile(String mobile);

    /** Find all active, online providers that offer a given skill (case-insensitive) */
    @Query("SELECT l FROM ServiceProvider l JOIN l.skills s " +
           "WHERE l.status = 'ACTIVE' AND l.available = true " +
           "AND LOWER(s) LIKE LOWER(CONCAT('%', :skill, '%'))")
    List<ServiceProvider> findOnlineActiveBySkill(@Param("skill") String skill);

    /** Find all active providers in a given area */
    List<ServiceProvider> findByStatusAndAreaContainingIgnoreCase(ServiceProvider.AccountStatus status, String area);
}
