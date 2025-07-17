package com.online.examination.portal.service.impl;

import com.online.examination.portal.service.UserService;
import com.online.examination.portal.dto.*;
import com.online.examination.portal.entity.*;
import com.online.examination.portal.repository.UserRepository;
import com.online.examination.portal.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserServiceImpl implements UserService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private JwtUtil jwtUtil;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Override
    public UserResponse register(RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            UserResponse resp = new UserResponse();
            resp.setMessage("Email already registered");
            return resp;
        }
        com.online.examination.portal.entity.User user = com.online.examination.portal.entity.User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole())
                .approvalStatus(ApprovalStatus.PENDING)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .classOrDepartment(request.getClassOrDepartment())
                .build();
        String approverRole = null;
        switch (request.getRole()) {
            case STUDENT: approverRole = "CLASS_TEACHER"; break;
            case CLASS_TEACHER: approverRole = "HOD"; break;
            case HOD: approverRole = "PRINCIPAL"; break;
            case PRINCIPAL: approverRole = "ADMIN"; break;
            case ADMIN: approverRole = null; break;
        }
        if (approverRole != null) {
            user.setApprovalStatus(ApprovalStatus.PENDING);
        } else {
            user.setApprovalStatus(ApprovalStatus.APPROVED);
        }
        userRepository.save(user);
        UserResponse resp = toUserResponse(user, null);
        if (user.getApprovalStatus() == ApprovalStatus.PENDING) {
            resp.setMessage("Registration successful. Awaiting approval by " + approverRole.replace("_", " ").toLowerCase() + ".");
        } else {
            resp.setMessage("Registration successful and auto-approved as ADMIN.");
        }
        return resp;
    }

    @Override
    public JwtResponse login(LoginRequest request) {
        Optional<com.online.examination.portal.entity.User> userOpt = userRepository.findByEmail(request.getEmail());
        JwtResponse resp = new JwtResponse();
        if (userOpt.isEmpty()) {
            resp.setToken(null);
            resp.setRole(null);
            resp.setUserId(null);
            resp.setMessage("User not found. Please check your email.");
            return resp;
        }
        com.online.examination.portal.entity.User user = userOpt.get();
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            resp.setToken(null);
            resp.setRole(null);
            resp.setUserId(null);
            resp.setMessage("Incorrect password. Please try again.");
            return resp;
        }
        if (user.getApprovalStatus() != ApprovalStatus.APPROVED) {
            resp.setToken(null);
            resp.setRole(null);
            resp.setUserId(null);
            resp.setMessage("User not approved yet. Please wait for approval.");
            return resp;
        }
        UserDetails userDetails = org.springframework.security.core.userdetails.User
                .withUsername(user.getEmail())
                .password(user.getPassword())
                .roles(user.getRole().name())
                .build();
        String token = jwtUtil.generateToken(userDetails);
        resp.setToken(token);
        resp.setRole(user.getRole());
        resp.setUserId(user.getId());
        resp.setMessage("Login successful.");
        return resp;
    }

    @Override
    public UserResponse approveUser(Long userId, Long approverId) {
        Optional<com.online.examination.portal.entity.User> userOpt = userRepository.findById(userId);
        Optional<com.online.examination.portal.entity.User> approverOpt = userRepository.findById(approverId);
        if (userOpt.isEmpty() || approverOpt.isEmpty()) {
            UserResponse resp = new UserResponse();
            resp.setMessage("User or approver not found");
            return resp;
        }
        com.online.examination.portal.entity.User user = userOpt.get();
        com.online.examination.portal.entity.User approver = approverOpt.get();
        // Approval logic for STUDENT, CLASS_TEACHER, HOD, PRINCIPAL
        boolean canApprove = false;
        if (approver.getRole() == Role.ADMIN) {
            canApprove = true;
        } else {
            switch (user.getRole()) {
                case STUDENT:
                    canApprove = approver.getRole() == Role.CLASS_TEACHER;
                    break;
                case CLASS_TEACHER:
                    canApprove = approver.getRole() == Role.HOD;
                    break;
                case HOD:
                    canApprove = approver.getRole() == Role.PRINCIPAL;
                    break;
                case PRINCIPAL:
                    canApprove = approver.getRole() == Role.ADMIN;
                    break;
                default:
                    canApprove = false;
            }
        }
        if (!canApprove) {
            UserResponse resp = toUserResponse(user, approver.getName());
            resp.setMessage("Approver does not have permission to approve this user");
            return resp;
        }
        if (user.getApprovalStatus() != ApprovalStatus.PENDING) {
            UserResponse resp = toUserResponse(user, approver.getName());
            resp.setMessage("User is not pending approval");
            return resp;
        }
        user.setApprovalStatus(ApprovalStatus.APPROVED);
        user.setApprover(approver);
        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);
        UserResponse resp = toUserResponse(user, approver.getName());
        resp.setMessage("User approved successfully");
        return resp;
    }

    @Override
    public List<UserResponse> getAllStudents() {
        List<com.online.examination.portal.entity.User> students = userRepository.findAll().stream()
                .filter(u -> u.getRole() == Role.STUDENT)
                .collect(Collectors.toList());
        return students.stream().map(u -> toUserResponse(u, u.getApprover() != null ? u.getApprover().getName() : null)).collect(Collectors.toList());
    }

    @Override
    public UserResponse getStudentById(Long id) {
        Optional<com.online.examination.portal.entity.User> userOpt = userRepository.findById(id);
        if (userOpt.isEmpty() || userOpt.get().getRole() != Role.STUDENT) {
            UserResponse resp = new UserResponse();
            resp.setMessage("Student not found");
            return resp;
        }
        com.online.examination.portal.entity.User user = userOpt.get();
        return toUserResponse(user, user.getApprover() != null ? user.getApprover().getName() : null);
    }

    @Override
    public UserResponse updateStudent(Long id, UpdateStudentRequest request) {
        Optional<com.online.examination.portal.entity.User> userOpt = userRepository.findById(id);
        if (userOpt.isEmpty() || userOpt.get().getRole() != Role.STUDENT) {
            UserResponse resp = new UserResponse();
            resp.setMessage("Student not found");
            return resp;
        }
        com.online.examination.portal.entity.User user = userOpt.get();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setClassOrDepartment(request.getClassOrDepartment());
        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);
        UserResponse resp = toUserResponse(user, user.getApprover() != null ? user.getApprover().getName() : null);
        resp.setMessage("Student updated successfully");
        return resp;
    }

    @Override
    public void deleteStudent(Long id) {
        Optional<com.online.examination.portal.entity.User> userOpt = userRepository.findById(id);
        if (userOpt.isPresent() && userOpt.get().getRole() == Role.STUDENT) {
            userRepository.deleteById(id);
        }
    }

    @Override
    public List<UserResponse> getAllByRole(String role) {
        Role roleEnum = Role.valueOf(role);
        List<com.online.examination.portal.entity.User> users = userRepository.findAll().stream()
                .filter(u -> u.getRole() == roleEnum)
                .collect(java.util.stream.Collectors.toList());
        return users.stream().map(u -> toUserResponse(u, u.getApprover() != null ? u.getApprover().getName() : null)).collect(java.util.stream.Collectors.toList());
    }

    @Override
    public UserResponse getByRoleAndId(String role, Long id) {
        Role roleEnum = Role.valueOf(role);
        java.util.Optional<com.online.examination.portal.entity.User> userOpt = userRepository.findById(id);
        if (userOpt.isEmpty() || userOpt.get().getRole() != roleEnum) {
            UserResponse resp = new UserResponse();
            resp.setMessage(role.replace("_", " ").toLowerCase() + " not found");
            return resp;
        }
        com.online.examination.portal.entity.User user = userOpt.get();
        return toUserResponse(user, user.getApprover() != null ? user.getApprover().getName() : null);
    }

    @Override
    public UserResponse updateByRole(Long id, UpdateStudentRequest request, String role) {
        Role roleEnum = Role.valueOf(role);
        java.util.Optional<com.online.examination.portal.entity.User> userOpt = userRepository.findById(id);
        if (userOpt.isEmpty() || userOpt.get().getRole() != roleEnum) {
            UserResponse resp = new UserResponse();
            resp.setMessage(role.replace("_", " ").toLowerCase() + " not found");
            return resp;
        }
        com.online.examination.portal.entity.User user = userOpt.get();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setClassOrDepartment(request.getClassOrDepartment());
        user.setUpdatedAt(java.time.LocalDateTime.now());
        userRepository.save(user);
        UserResponse resp = toUserResponse(user, user.getApprover() != null ? user.getApprover().getName() : null);
        resp.setMessage(role.replace("_", " ").toLowerCase() + " updated successfully");
        return resp;
    }

    @Override
    public UserResponse patchByRole(Long id, java.util.Map<String, Object> updates, String role) {
        Role roleEnum = Role.valueOf(role);
        UserResponse resp = new UserResponse();
        com.online.examination.portal.entity.User user = userRepository.findById(id).orElse(null);
        if (user == null || user.getRole() != roleEnum) {
            resp.setMessage(role.replace("_", " ").toLowerCase() + " not found");
            return resp;
        }
        if (updates.containsKey("name")) {
            user.setName((String) updates.get("name"));
        }
        if (updates.containsKey("email")) {
            user.setEmail((String) updates.get("email"));
        }
        if (updates.containsKey("classOrDepartment")) {
            user.setClassOrDepartment((String) updates.get("classOrDepartment"));
        }
        userRepository.save(user);
        resp.setId(user.getId());
        resp.setName(user.getName());
        resp.setEmail(user.getEmail());
        resp.setRole(user.getRole());
        resp.setApprovalStatus(user.getApprovalStatus());
        resp.setClassOrDepartment(user.getClassOrDepartment());
        resp.setApproverName(user.getApprover() != null ? user.getApprover().getName() : null);
        resp.setMessage(role.replace("_", " ").toLowerCase() + " patched (test only)");
        return resp;
    }

    @Override
    public void deleteByRole(Long id, String role) {
        Role roleEnum = Role.valueOf(role);
        java.util.Optional<com.online.examination.portal.entity.User> userOpt = userRepository.findById(id);
        if (userOpt.isPresent() && userOpt.get().getRole() == roleEnum) {
            userRepository.deleteById(id);
        }
    }

    private UserResponse toUserResponse(com.online.examination.portal.entity.User user, String approverName) {
        UserResponse resp = new UserResponse();
        resp.setId(user.getId());
        resp.setName(user.getName());
        resp.setEmail(user.getEmail());
        resp.setRole(user.getRole());
        resp.setApprovalStatus(user.getApprovalStatus());
        resp.setClassOrDepartment(user.getClassOrDepartment());
        resp.setApproverName(approverName);
        return resp;
    }
} 