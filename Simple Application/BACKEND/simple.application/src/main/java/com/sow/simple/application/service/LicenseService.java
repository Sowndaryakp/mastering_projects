package com.sow.simple.application.service;

import com.sow.simple.application.dto.LicenseRequest;
import com.sow.simple.application.entity.License;
import com.sow.simple.application.entity.LicenseStatus;
import com.sow.simple.application.entity.User;
import com.sow.simple.application.exception.ResourceNotFoundException;
import com.sow.simple.application.repository.LicenseRepository;
import com.sow.simple.application.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class LicenseService {
    
    private final LicenseRepository licenseRepository;
    private final UserRepository userRepository;
    
    public License createLicense(LicenseRequest request) {
        if (licenseRepository.existsByLicenseKey(request.getLicenseKey())) {
            throw new RuntimeException("License key already exists");
        }
        
        License license = new License();
        license.setLicenseKey(request.getLicenseKey());
        license.setProductName(request.getProductName());
        license.setCustomerName(request.getCustomerName());
        license.setCustomerEmail(request.getCustomerEmail());
        license.setIssueDate(request.getIssueDate());
        license.setExpiryDate(request.getExpiryDate());
        license.setStatus(request.getStatus());
        license.setMaxUsers(request.getMaxUsers());
        license.setDescription(request.getDescription());
        
        // Set the current user as creator
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        User currentUser = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        license.setCreatedBy(currentUser);
        
        return licenseRepository.save(license);
    }
    
    public License getLicenseById(Long id) {
        return licenseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("License", "id", id));
    }
    
    public License getLicenseByKey(String licenseKey) {
        return licenseRepository.findByLicenseKey(licenseKey)
                .orElseThrow(() -> new ResourceNotFoundException("License", "licenseKey", licenseKey));
    }
    
    public List<License> getAllLicenses() {
        return licenseRepository.findAll();
    }
    
    public List<License> getLicensesByCustomer(String customerName) {
        List<License> licenses = licenseRepository.findByCustomerNameIgnoreCase(customerName);
        if (licenses.isEmpty()) {
            throw new ResourceNotFoundException("No licenses found for customer: " + customerName);
        }
        return licenses;
    }
    
    public List<License> getLicensesByProduct(String productName) {
        List<License> licenses = licenseRepository.findByProductNameIgnoreCase(productName);
        if (licenses.isEmpty()) {
            throw new ResourceNotFoundException("No licenses found for product: " + productName);
        }
        return licenses;
    }
    
    public List<License> getLicensesByStatus(LicenseStatus status) {
        return licenseRepository.findByStatus(status);
    }
    
    public List<License> getExpiredLicenses() {
        return licenseRepository.findExpiredLicenses(LocalDate.now());
    }
    
    public License updateLicense(Long id, LicenseRequest request) {
        License license = getLicenseById(id);
        
        license.setProductName(request.getProductName());
        license.setCustomerName(request.getCustomerName());
        license.setCustomerEmail(request.getCustomerEmail());
        license.setIssueDate(request.getIssueDate());
        license.setExpiryDate(request.getExpiryDate());
        license.setStatus(request.getStatus());
        license.setMaxUsers(request.getMaxUsers());
        license.setDescription(request.getDescription());
        
        return licenseRepository.save(license);
    }
    
    public void deleteLicense(Long id) {
        if (!licenseRepository.existsById(id)) {
            throw new ResourceNotFoundException("License", "id", id);
        }
        licenseRepository.deleteById(id);
    }
    
    public License updateLicenseStatus(Long id, LicenseStatus status) {
        License license = getLicenseById(id);
        license.setStatus(status);
        return licenseRepository.save(license);
    }
    
    public String generateLicenseKey() {
        return "LIC-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }
    
    public List<String> getAllCustomerNames() {
        return licenseRepository.findAllCustomerNames();
    }
    
    public List<String> getAllProductNames() {
        return licenseRepository.findAllProductNames();
    }
} 