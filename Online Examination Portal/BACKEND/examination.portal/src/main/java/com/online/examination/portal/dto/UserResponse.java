package com.online.examination.portal.dto;

import com.online.examination.portal.entity.Role;
import com.online.examination.portal.entity.ApprovalStatus;
import lombok.Data;

@Data
public class UserResponse {
    private Long id;
    private String name;
    private String email;
    private Role role;
    private ApprovalStatus approvalStatus;
    private String classOrDepartment;
    private String approverName;
    private String message;
} 