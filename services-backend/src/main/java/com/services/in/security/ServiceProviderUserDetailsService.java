package com.services.in.security;

import com.services.in.entity.ServiceProvider;
import com.services.in.repository.ServiceProviderRepository;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Loads a ServiceProvider by email for Spring Security.
 * The email is used as the JWT subject so we look up by email here.
 */
@Service
public class ServiceProviderUserDetailsService implements UserDetailsService {

    private final ServiceProviderRepository serviceProviderRepository;

    public ServiceProviderUserDetailsService(ServiceProviderRepository serviceProviderRepository) {
        this.serviceProviderRepository = serviceProviderRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        ServiceProvider serviceProvider = serviceProviderRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException(
                "Provider not found with email: " + email));

        return new User(
                serviceProvider.getEmail(),
                serviceProvider.getPassword(),
                List.of(new SimpleGrantedAuthority("ROLE_" + serviceProvider.getRole().name()))
        );
    }
}
