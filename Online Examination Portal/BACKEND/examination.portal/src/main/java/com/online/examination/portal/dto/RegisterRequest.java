package com.online.examination.portal.dto;

import com.online.examination.portal.entity.Role;
import lombok.Data;

@Data
public class RegisterRequest {
    private String name;
    private String email;
    private String password;
    private Role role;
    private String classOrDepartment;
} 