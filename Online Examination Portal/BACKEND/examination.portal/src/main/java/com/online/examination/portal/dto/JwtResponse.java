package com.online.examination.portal.dto;

import com.online.examination.portal.entity.Role;
import lombok.Data;

@Data
public class JwtResponse {
    private String token;
    private Long userId;
    private Role role;
    private String message;
} 