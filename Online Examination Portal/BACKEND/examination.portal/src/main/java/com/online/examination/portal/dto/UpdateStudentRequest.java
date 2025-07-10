package com.online.examination.portal.dto;

import lombok.Data;

@Data
public class UpdateStudentRequest {
    private String name;
    private String email;
    private String classOrDepartment;
} 