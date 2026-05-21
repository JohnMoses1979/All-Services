package com.services.in.repository;

import com.services.in.entity.ServiceBooking;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ServiceBookingRepository extends JpaRepository<ServiceBooking, Long> {
    List<ServiceBooking> findByProviderIdOrderByCreatedAtDesc(Long providerId);
}
