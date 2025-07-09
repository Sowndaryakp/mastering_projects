package com.sow.simple.application.dto;

import com.sow.simple.application.entity.LicenseStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LicenseRequest {
    
    @NotBlank(message = "License key is required")
    private String licenseKey;
    
    @NotBlank(message = "Product name is required")
    private String productName;
    
    @NotBlank(message = "Customer name is required")
    private String customerName;
    
    private String customerEmail;
    
    @NotNull(message = "Issue date is required")
    private LocalDate issueDate;
    
    @NotNull(message = "Expiry date is required")
    private LocalDate expiryDate;
    
    private LicenseStatus status = LicenseStatus.ACTIVE;
    
    private Integer maxUsers;
    
    private String description;
} 