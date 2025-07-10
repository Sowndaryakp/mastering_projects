package com.sow.simple.application.repository;

import com.sow.simple.application.entity.License;
import com.sow.simple.application.entity.LicenseStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface LicenseRepository extends JpaRepository<License, Long> {
    
    Optional<License> findByLicenseKey(String licenseKey);
    
    List<License> findByCustomerName(String customerName);
    
    // Case-insensitive search for customer name
    List<License> findByCustomerNameIgnoreCase(String customerName);
    
    List<License> findByProductName(String productName);
    
    // Case-insensitive search for product name
    List<License> findByProductNameIgnoreCase(String productName);
    
    List<License> findByStatus(LicenseStatus status);
    
    @Query("SELECT l FROM License l WHERE l.expiryDate <= :date")
    List<License> findExpiredLicenses(@Param("date") LocalDate date);
    
    @Query("SELECT l FROM License l WHERE l.expiryDate BETWEEN :startDate AND :endDate")
    List<License> findLicensesExpiringBetween(@Param("startDate") LocalDate startDate, 
                                            @Param("endDate") LocalDate endDate);
    
    boolean existsByLicenseKey(String licenseKey);
    
    // Get all unique customer names
    @Query("SELECT DISTINCT l.customerName FROM License l ORDER BY l.customerName")
    List<String> findAllCustomerNames();
    
    // Get all unique product names
    @Query("SELECT DISTINCT l.productName FROM License l ORDER BY l.productName")
    List<String> findAllProductNames();
} 