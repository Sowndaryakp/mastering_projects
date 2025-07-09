package com.sow.simple.application.controller;

import com.sow.simple.application.dto.LicenseRequest;
import com.sow.simple.application.entity.License;
import com.sow.simple.application.entity.LicenseStatus;
import com.sow.simple.application.service.LicenseService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/licenses")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class LicenseController {
    
    private final LicenseService licenseService;
    
    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<License> createLicense(@Valid @RequestBody LicenseRequest request) {
        License license = licenseService.createLicense(request);
        return ResponseEntity.ok(license);
    }
    
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'USER')")
    public ResponseEntity<List<License>> getAllLicenses() {
        List<License> licenses = licenseService.getAllLicenses();
        return ResponseEntity.ok(licenses);
    }
    
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'USER')")
    public ResponseEntity<License> getLicenseById(@PathVariable Long id) {
        License license = licenseService.getLicenseById(id);
        return ResponseEntity.ok(license);
    }
    
    @GetMapping("/key/{licenseKey}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'USER')")
    public ResponseEntity<License> getLicenseByKey(@PathVariable String licenseKey) {
        License license = licenseService.getLicenseByKey(licenseKey);
        return ResponseEntity.ok(license);
    }
    
    @GetMapping("/customer/{customerName}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<List<License>> getLicensesByCustomer(@PathVariable String customerName) {
        List<License> licenses = licenseService.getLicensesByCustomer(customerName);
        return ResponseEntity.ok(licenses);
    }
    
    @GetMapping("/product/{productName}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<List<License>> getLicensesByProduct(@PathVariable String productName) {
        List<License> licenses = licenseService.getLicensesByProduct(productName);
        return ResponseEntity.ok(licenses);
    }
    
    @GetMapping("/status/{status}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<List<License>> getLicensesByStatus(@PathVariable LicenseStatus status) {
        List<License> licenses = licenseService.getLicensesByStatus(status);
        return ResponseEntity.ok(licenses);
    }
    
    @GetMapping("/expired")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<List<License>> getExpiredLicenses() {
        List<License> licenses = licenseService.getExpiredLicenses();
        return ResponseEntity.ok(licenses);
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<License> updateLicense(@PathVariable Long id, @Valid @RequestBody LicenseRequest request) {
        License license = licenseService.updateLicense(id, request);
        return ResponseEntity.ok(license);
    }
    
    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<License> updateLicenseStatus(@PathVariable Long id, @RequestParam LicenseStatus status) {
        License license = licenseService.updateLicenseStatus(id, status);
        return ResponseEntity.ok(license);
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteLicense(@PathVariable Long id) {
        licenseService.deleteLicense(id);
        return ResponseEntity.noContent().build();
    }
    
    @GetMapping("/generate-key")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<String> generateLicenseKey() {
        String licenseKey = licenseService.generateLicenseKey();
        return ResponseEntity.ok(licenseKey);
    }
} 