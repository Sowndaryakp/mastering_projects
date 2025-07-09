package com.sow.simple.application.service;

import com.sow.simple.application.dto.AuthRequest;
import com.sow.simple.application.dto.AuthResponse;
import com.sow.simple.application.dto.UserRegistrationRequest;
import com.sow.simple.application.entity.Role;
import com.sow.simple.application.entity.User;
import com.sow.simple.application.repository.UserRepository;
import com.sow.simple.application.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;
    
    public AuthResponse register(UserRegistrationRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already exists");
        }
        
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }
        
        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setRole(request.getRole());
        user.setIsActive(true);
        
        userRepository.save(user);
        
        UserDetails userDetails = user;
        String token = jwtUtil.generateToken(userDetails);
        
        return new AuthResponse(token, user.getUsername(), user.getRole().name(), "User registered successfully");
    }
    
    public AuthResponse authenticate(AuthRequest request) {
        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );
        
        UserDetails userDetails = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        String token = jwtUtil.generateToken(userDetails);
        User user = (User) userDetails;
        
        return new AuthResponse(token, user.getUsername(), user.getRole().name(), "Authentication successful");
    }
} 