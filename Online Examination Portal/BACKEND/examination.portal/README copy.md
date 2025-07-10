# Online Examination Portal Backend

## Overview
This is a backend system for an Online Examination Portal, built with Java, Spring Boot, Hibernate, PostgreSQL, and JWT-based authentication. It supports multiple user roles (Student, Class Teacher, HOD, Principal, Admin) and a hierarchical approval workflow for user registration.

## Tech Stack
- Java 17
- Spring Boot 3
- Spring Data JPA (Hibernate)
- Spring Security (JWT)
- PostgreSQL
- Lombok
- Maven

## Features
- **Role-based access:** Student, Class Teacher, HOD, Principal, Admin
- **Hierarchical registration approval:**
  - Student → Class Teacher → HOD → Principal → Admin
- **JWT Authentication & Authorization**
- **CRUD operations for students** (by all roles except students)
- **Secure password storage**
- **Audit fields** (createdAt, updatedAt)

## Registration & Approval Flow
- **Student** registers → **Class Teacher** approves
- **Class Teacher** registers → **HOD** approves
- **HOD** registers → **Principal** approves
- **Principal** registers → **Admin** approves
- **Admin** can be seeded directly
- Each registration is `PENDING` until approved by the next higher role

## Project Structure
- `entity/` - JPA entities and enums
- `repository/` - Spring Data JPA repositories
- `service/` - Business logic
- `controller/` - REST API endpoints
- `dto/` - Data Transfer Objects
- `security/` - JWT utilities

## Setup Instructions
1. **Clone the repository**
2. **Configure PostgreSQL**
   - Create a database named `online_exam_db`
   - Update `src/main/resources/application.properties` with your DB credentials
3. **Build the project**
   ```bash
   mvn clean install
   ```
4. **Run the application**
   ```bash
   mvn spring-boot:run
   ```
   The server will start on `http://localhost:8080`

## API Endpoints & Example Usage

### 1. Register a User
- **URL:** `POST http://localhost:8080/api/auth/register`
- **Request JSON:**
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "role": "STUDENT", // or CLASS_TEACHER, HOD, PRINCIPAL, ADMIN
    "classOrDepartment": "10A" // required for students/teachers
  }
  ```
- **Response JSON:**
  ```json
  {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "STUDENT",
    "approvalStatus": "PENDING",
    "classOrDepartment": "10A",
    "approverName": null
  }
  ```

### 2. Login
- **URL:** `POST http://localhost:8080/api/auth/login`
- **Request JSON:**
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- **Response JSON:**
  ```json
  {
    "token": "<JWT_TOKEN>",
    "userId": 1,
    "role": "STUDENT"
  }
  ```

### 3. Approve a User
- **URL:** `POST http://localhost:8080/api/users/approve/{userId}?approverId={approverId}`
- **Headers:** `Authorization: Bearer <JWT_TOKEN>` (of approver)
- **Response JSON:**
  ```json
  {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "STUDENT",
    "approvalStatus": "APPROVED",
    "classOrDepartment": "10A",
    "approverName": "Jane Smith"
  }
  ```

### 4. Get All Students
- **URL:** `GET http://localhost:8080/api/users/students`
- **Headers:** `Authorization: Bearer <JWT_TOKEN>` (not student)
- **Response JSON:**
  ```json
  [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "role": "STUDENT",
      "approvalStatus": "APPROVED",
      "classOrDepartment": "10A",
      "approverName": "Jane Smith"
    },
    // ... more students ...
  ]
  ```

### 5. Get Student by ID
- **URL:** `GET http://localhost:8080/api/users/students/{id}`
- **Headers:** `Authorization: Bearer <JWT_TOKEN>`
- **Response JSON:**
  ```json
  {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "STUDENT",
    "approvalStatus": "APPROVED",
    "classOrDepartment": "10A",
    "approverName": "Jane Smith"
  }
  ```

### 6. Update Student
- **URL:** `PUT http://localhost:8080/api/users/students/{id}`
- **Headers:** `Authorization: Bearer <JWT_TOKEN>`
- **Request JSON:**
  ```json
  {
    "name": "John Doe Updated",
    "email": "john.updated@example.com",
    "classOrDepartment": "10B"
  }
  ```
- **Response JSON:**
  ```json
  {
    "id": 1,
    "name": "John Doe Updated",
    "email": "john.updated@example.com",
    "role": "STUDENT",
    "approvalStatus": "APPROVED",
    "classOrDepartment": "10B",
    "approverName": "Jane Smith"
  }
  ```

### 7. Delete Student
- **URL:** `DELETE http://localhost:8080/api/users/students/{id}`
- **Headers:** `Authorization: Bearer <JWT_TOKEN>`
- **Response:** HTTP 204 No Content (if successful)

---

## Step-by-Step Usage Guide
1. **Register users for each role (Student, Class Teacher, HOD, Principal, Admin) using the registration endpoint.**
2. **Login as the next higher role to approve the registration.**
   - E.g., Class Teacher logs in to approve Student, HOD approves Class Teacher, etc.
3. **Once approved, users can log in and access their allowed endpoints.**
4. **Use the JWT token from login in the `Authorization` header for all protected endpoints.**
5. **CRUD operations for students are available to all roles except students.**

## Error Handling
- If a user tries to log in before approval, they will receive an error (e.g., `User not approved`).
- If a student tries to access restricted endpoints, they will receive a `403 Forbidden` error.
- All errors are returned as JSON with a message field.

## Tips
- Use tools like Postman or curl to test the API endpoints.
- Always include the JWT token in the `Authorization` header for protected endpoints.
- The approval chain must be followed for registration to be successful.
- You can seed the first admin user directly in the database if needed.

---

**For any questions or contributions, please open an issue or pull request.** 

---

A 401 Unauthorized error on the **register** endpoint (`/api/auth/register`) means that Spring Security is requiring authentication for this endpoint, but registration should be public (no JWT required).

This is a common Spring Security misconfiguration.  
**By default, all endpoints are secured unless you explicitly permit them.**

---

## How to Fix

You need to update your Spring Security configuration to allow unauthenticated access to `/api/auth/register` and `/api/auth/login`.

### Example Security Configuration

If you don’t already have a security config, create one like this:

```java
package com.online.examination.portal.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/register", "/api/auth/login").permitAll()
                .anyRequest().authenticated()
            );
        // Add JWT filter here if you have one
        return http.build();
    }
}
```

- This allows anyone to access `/api/auth/register` and `/api/auth/login`.
- All other endpoints require authentication.

---

## Next Steps

1. **Check if you have a `SecurityConfig` or similar class.**
2. **If not, create one as above.**
3. **If you have one, make sure it includes:**
   ```java
   .requestMatchers("/api/auth/register", "/api/auth/login").permitAll()
   ```
4. **Restart your application.**
5. **Try registering again.**

---

Would you like me to create or update your security configuration for you? 

## API Testing Guide (URLs, JSON, and Responses)

### 1. Register a User
- **URL:** `POST http://localhost:8080/api/auth/register`
- **Request JSON:**
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "role": "STUDENT",
    "classOrDepartment": "10A"
  }
  ```
- **Response JSON:**
  ```json
  {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "STUDENT",
    "approvalStatus": "PENDING",
    "classOrDepartment": "10A",
    "approverName": null,
    "message": "Registration successful. Awaiting approval by class teacher."
  }
  ```

### 2. Login
- **URL:** `POST http://localhost:8080/api/auth/login`
- **Request JSON:**
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- **Response JSON (if approved):**
  ```json
  {
    "token": "<JWT_TOKEN>",
    "userId": 1,
    "role": "STUDENT"
  }
  ```
- **Response JSON (if not approved):**
  ```json
  {
    "token": null,
    "userId": null,
    "role": null
  }
  ```

### 3. Approve a User
- **URL:** `POST http://localhost:8080/api/users/approve/{userId}?approverId={approverId}`
- **Headers:** `Authorization: Bearer <JWT_TOKEN>` (of approver)
- **Response JSON:**
  ```json
  {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "STUDENT",
    "approvalStatus": "APPROVED",
    "classOrDepartment": "10A",
    "approverName": "Jane Smith",
    "message": "User approved successfully"
  }
  ```

### 4. Get All Students
- **URL:** `GET http://localhost:8080/api/users/students`
- **Headers:** `Authorization: Bearer <JWT_TOKEN>`
- **Response JSON:**
  ```json
  [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "role": "STUDENT",
      "approvalStatus": "APPROVED",
      "classOrDepartment": "10A",
      "approverName": "Jane Smith",
      "message": null
    }
  ]
  ```

### 5. Get Student by ID
- **URL:** `GET http://localhost:8080/api/users/students/{id}`
- **Headers:** `Authorization: Bearer <JWT_TOKEN>`
- **Response JSON:**
  ```json
  {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "STUDENT",
    "approvalStatus": "APPROVED",
    "classOrDepartment": "10A",
    "approverName": "Jane Smith",
    "message": null
  }
  ```

### 6. Update Student
- **URL:** `PUT http://localhost:8080/api/users/students/{id}`
- **Headers:** `Authorization: Bearer <JWT_TOKEN>`
- **Request JSON:**
  ```json
  {
    "name": "John Doe Updated",
    "email": "john.updated@example.com",
    "classOrDepartment": "10B"
  }
  ```
- **Response JSON:**
  ```json
  {
    "id": 1,
    "name": "John Doe Updated",
    "email": "john.updated@example.com",
    "role": "STUDENT",
    "approvalStatus": "APPROVED",
    "classOrDepartment": "10B",
    "approverName": "Jane Smith",
    "message": "Student updated successfully"
  }
  ```

### 7. Delete Student
- **URL:** `DELETE http://localhost:8080/api/users/students/{id}`
- **Headers:** `Authorization: Bearer <JWT_TOKEN>`
- **Response:** HTTP 204 No Content (if successful)

---

**Copy and paste these examples into Postman to test your API.**

For any errors, the response will include a `message` field with details. 