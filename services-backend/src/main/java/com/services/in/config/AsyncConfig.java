package com.services.in.config;

import org.springframework.context.annotation.Configuration;

import org.springframework.scheduling.annotation.EnableAsync;

/**
 * Enables Spring's @Async support so EmailService.sendOtpEmail and
 * sendWelcomeEmail run on a separate thread pool and don't block the HTTP response.
 */
@Configuration
@EnableAsync
public class AsyncConfig {
    // Spring Boot auto-configures a SimpleAsyncTaskExecutor by default.
    // For production, configure a ThreadPoolTaskExecutor bean here.
}
