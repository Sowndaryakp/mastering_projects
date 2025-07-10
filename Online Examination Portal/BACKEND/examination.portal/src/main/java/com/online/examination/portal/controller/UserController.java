package com.online.examination.portal.controller;

import com.online.examination.portal.dto.*;
import com.online.examination.portal.service.UserService;
import com.online.examination.portal.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {
    @Autowired
    private UserService userService;
    @Autowired
    private UserRepository userRepository;

    @PostMapping("/approve/{userId}")
    public UserResponse approveUser(@PathVariable Long userId, @RequestParam Long approverId) {
        return userService.approveUser(userId, approverId);
    }

    @GetMapping("/students")
    public List<UserResponse> getAllStudents() {
        return userService.getAllStudents();
    }

    @GetMapping("/students/{id}")
    public UserResponse getStudentById(@PathVariable Long id) {
        return userService.getStudentById(id);
    }

    @PutMapping("/students/{id}")
    public UserResponse updateStudent(@PathVariable Long id, @RequestBody UpdateStudentRequest request) {
        return userService.updateStudent(id, request);
    }

    @DeleteMapping("/students/{id}")
    public void deleteStudent(@PathVariable Long id) {
        userService.deleteStudent(id);
    }

    @PatchMapping("/students/{id}")
    public UserResponse patchStudent(@PathVariable Long id, @RequestBody Map<String, Object> updates) {
        UserResponse resp = new UserResponse();
        // Find the user entity
        com.online.examination.portal.entity.User user = userRepository.findById(id).orElse(null);
        if (user == null || user.getRole() != com.online.examination.portal.entity.Role.STUDENT) {
            resp.setMessage("Student not found");
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
        resp.setMessage("Student patched (test only)");
        return resp;
    }
} 