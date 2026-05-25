package com.services.in.config;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.services.in.security.JwtAuthenticationFilter;
import com.services.in.security.LabourUserDetailsService;

/**
 * Spring Security configuration for the labour auth module.
 *
 * Public endpoints (no JWT required): POST /api/provider/auth/signup POST
 * /api/provider/auth/send-otp POST /api/provider/auth/verify-otp POST
 * /api/provider/auth/signin GET /api/provider/categories (needed before login
 * for skill selection) GET /h2-console/** (dev only)
 *
 * All other /api/provider/** endpoints require a valid JWT with role PROVIDER.
 */
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;
    private final LabourUserDetailsService userDetailsService;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthFilter,
            LabourUserDetailsService userDetailsService) {
        this.jwtAuthFilter = jwtAuthFilter;
        this.userDetailsService = userDetailsService;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // Stateless REST API — no CSRF needed
                .csrf(AbstractHttpConfigurer::disable)
                // CORS configured below
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                // Session management — stateless (JWT)
                .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                // Route-level authorization
                .authorizeHttpRequests(auth -> auth
                // ── Public auth endpoints ──────────────────────────
                .requestMatchers(HttpMethod.POST,
                        "/api/provider/auth/signup",
                        "/api/provider/auth/send-otp",
                        "/api/provider/auth/verify-otp",
                        "/api/provider/auth/select-skills",
                        "/api/provider/auth/signin",
                        "/api/provider/auth/check-mobile",
                        "/api/provider/auth/verify-mobile", // ← add this
                        "/api/provider/auth/reset-password",
                        "/api/owner/auth/signup",
                        "/api/owner/auth/verify-otp",
                        "/api/owner/auth/signin",
                        "/api/owner/auth/check-mobile",
                        "/api/owner/auth/reset-password"
                ).permitAll()
                .requestMatchers(HttpMethod.GET, "/api/owner/auth/profile").permitAll()
                .requestMatchers(HttpMethod.PUT, "/api/owner/auth/profile").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/owner/auth/notification-settings").permitAll()
                .requestMatchers(HttpMethod.PUT, "/api/owner/auth/notification-settings").permitAll()
                .requestMatchers("/api/owner/notifications/**").permitAll()
                // ── Service categories — needed during registration ─
                .requestMatchers(HttpMethod.GET, "/api/provider/categories").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/provider/public/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/provider/admin/**").permitAll()
                .requestMatchers("/api/bookings/**").permitAll()
                .requestMatchers("/api/payments/**").permitAll()
                .requestMatchers("/api/wallet/**").permitAll()
                .requestMatchers("/api/support/**").permitAll()
                // ── H2 console (dev only) ──────────────────────────
                .requestMatchers("/h2-console/**").permitAll()
                // ── Everything else requires authentication ─────────
                .anyRequest().authenticated()
                )
                // Allow H2 console frames in dev
                .headers(headers -> headers.frameOptions(fo -> fo.sameOrigin()))
                // Wire our JWT filter before Spring's username/password filter
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
                .authenticationProvider(authenticationProvider());

        return http.build();
    }

    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider(userDetailsService);
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config)
            throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(12);
    }

    /**
     * CORS — allows the React Native / Expo dev server and production origins.
     * Extend the allowed origins list as needed.
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOriginPatterns(List.of("*")); // restrict in production
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);
        try {
            CorsConfiguration.class
                    .getMethod("setAllowPrivateNetwork", Boolean.class)
                    .invoke(config, Boolean.TRUE);
        } catch (ReflectiveOperationException ignored) {
            // Older Spring versions do not support Chrome's private-network CORS flag.
        }

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
