package com.sow.simple.application.config;

import com.sow.simple.application.entity.Role;
import com.sow.simple.application.entity.User;
import com.sow.simple.application.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    
    @Override
    public void run(String... args) throws Exception {
        // Create default admin user if no users exist
        if (userRepository.count() == 0) {
            User adminUser = new User();
            adminUser.setUsername("admin");
            adminUser.setEmail("admin@sowndarya.com");
            adminUser.setPassword(passwordEncoder.encode("admin123"));
            adminUser.setFirstName("Admin");
            adminUser.setLastName("User");
            adminUser.setRole(Role.ADMIN);
            adminUser.setIsActive(true);
            
            userRepository.save(adminUser);
            
            // Create manager user
            User managerUser = new User();
            managerUser.setUsername("manager");
            managerUser.setEmail("manager@sowndarya.com");
            managerUser.setPassword(passwordEncoder.encode("manager123"));
            managerUser.setFirstName("Manager");
            managerUser.setLastName("User");
            managerUser.setRole(Role.MANAGER);
            managerUser.setIsActive(true);
            
            userRepository.save(managerUser);
            
            // Create regular user
            User regularUser = new User();
            regularUser.setUsername("user");
            regularUser.setEmail("user@sowndarya.com");
            regularUser.setPassword(passwordEncoder.encode("user123"));
            regularUser.setFirstName("Regular");
            regularUser.setLastName("User");
            regularUser.setRole(Role.USER);
            regularUser.setIsActive(true);
            
            userRepository.save(regularUser);
            
            System.out.println("Default users created:");
            System.out.println("Admin - username: admin, password: admin123");
            System.out.println("Manager - username: manager, password: manager123");
            System.out.println("User - username: user, password: user123");
        }
    }
} 