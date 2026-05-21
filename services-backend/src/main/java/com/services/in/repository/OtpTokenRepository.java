package com.services.in.repository;

import com.services.in.entity.OtpToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Repository
public interface OtpTokenRepository extends JpaRepository<OtpToken, Long> {

    /**
     * Find the latest unused, unexpired OTP for a given email and purpose.
     * Ordered by createdAt DESC so we always pick the most recent one.
     */
    @Query("SELECT o FROM OtpToken o " +
           "WHERE o.email = :email AND o.purpose = :purpose AND o.used = false " +
           "ORDER BY o.createdAt DESC LIMIT 1")
    Optional<OtpToken> findLatestValidOtp(
            @Param("email") String email,
            @Param("purpose") OtpToken.OtpPurpose purpose
    );

    /**
     * Invalidate all previous OTPs for the same email + purpose before issuing a new one.
     * This prevents replay attacks.
     */
    @Modifying
    @Transactional
    @Query("UPDATE OtpToken o SET o.used = true " +
           "WHERE o.email = :email AND o.purpose = :purpose AND o.used = false")
    void invalidatePreviousOtps(
            @Param("email") String email,
            @Param("purpose") OtpToken.OtpPurpose purpose
    );
}