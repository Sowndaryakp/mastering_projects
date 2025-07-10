package com.online.examination.portal.service;

import com.online.examination.portal.dto.*;
import java.util.List;

public interface UserService {
    UserResponse register(RegisterRequest request);
    UserResponse approveUser(Long userId, Long approverId);
    JwtResponse login(LoginRequest request);
    List<UserResponse> getAllStudents();
    UserResponse getStudentById(Long id);
    UserResponse updateStudent(Long id, UpdateStudentRequest request);
    void deleteStudent(Long id);
} 