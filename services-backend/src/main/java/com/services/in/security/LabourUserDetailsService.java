package com.services.in.security;

import com.services.in.entity.*;
import com.services.in.repository.ServiceProviderRepository;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Loads a Labour by email for Spring Security.
 * The email is used as the JWT subject so we look up by email here.
 */
@Service
public class LabourUserDetailsService implements UserDetailsService {

    private final ServiceProviderRepository labourRepository;

    public LabourUserDetailsService(ServiceProviderRepository labourRepository) {
        this.labourRepository = labourRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        ServiceProvider labour = labourRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException(
                        "Provider not found with email: " + email));

        return new User(
                labour.getEmail(),
                labour.getPassword(),
                List.of(new SimpleGrantedAuthority("ROLE_" + labour.getRole().name()))
        );
    }
}