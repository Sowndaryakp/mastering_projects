# Online Examination Portal Backend

## Overview
This is a robust backend system for an Online Examination Portal, built with Java, Spring Boot, Hibernate, PostgreSQL, and JWT-based authentication. It supports a multi-role approval workflow and secure, role-based access to student data. The project is structured for real-world, production use and is suitable for both learning and deployment.

---

## Tech Stack
- Java 17
- Spring Boot 3
- Spring Data JPA (Hibernate)
- Spring Security (JWT)
- PostgreSQL
- Lombok
- Maven

---

## Features
- **Role-based access:** Student, Class Teacher, HOD, Principal, Admin
- **Hierarchical registration approval:**
  - Student → Class Teacher → HOD → Principal → Admin
- **JWT Authentication & Authorization**
- **CRUD operations for students** (by all roles except students)
- **PATCH support for partial student updates**
- **Secure password storage**
- **Audit fields** (createdAt, updatedAt)
- **Clear JSON responses and error messages**

---

## Architecture & Project Structure
- `entity/` - JPA entities and enums (User, Role, ApprovalStatus)
- `repository/` - Spring Data JPA repositories
- `service/` - Business logic (UserServiceImpl)
- `controller/` - REST API endpoints (AuthController, UserController)
- `dto/` - Data Transfer Objects (RegisterRequest, LoginRequest, UserResponse, etc.)
- `security/` - JWT utilities, filter, and security config

---

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

---

## Registration & Approval Flow
- **Student** registers → **Class Teacher** approves
- **Class Teacher** registers → **HOD** approves
- **HOD** registers → **Principal** approves
- **Principal** registers → **Admin** approves
- **Admin** can be seeded directly and is auto-approved
- Each registration is `PENDING` until approved by the next higher role

---

## Authentication & Authorization
- On login, users receive a JWT token
- All endpoints (except register/login) require JWT in the `Authorization: Bearer <token>` header
- Only approved users can log in
- Role-based access enforced in controllers/services

---

## API Endpoints & Example Usage

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

### 6. Update Student (Full Update)
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

### 7. Partial Update Student (PATCH)
- **URL:** `PATCH http://localhost:8080/api/users/students/{id}`
- **Headers:** `Authorization: Bearer <JWT_TOKEN>`
- **Request JSON:** (any subset of fields)
  ```json
  {
    "name": "Patched Name"
  }
  ```
- **Response JSON:**
  ```json
  {
    "id": 1,
    "name": "Patched Name",
    "email": "john.updated@example.com",
    "role": "STUDENT",
    "approvalStatus": "APPROVED",
    "classOrDepartment": "10B",
    "approverName": "Jane Smith",
    "message": "Student patched (test only)"
  }
  ```

### 8. Delete Student
- **URL:** `DELETE http://localhost:8080/api/users/students/{id}`
- **Headers:** `Authorization: Bearer <JWT_TOKEN>`
- **Response:** HTTP 204 No Content (if successful)

---

## Error Handling & Troubleshooting
- **401 Unauthorized:**
  - Missing or invalid JWT token
  - User not approved or not found
- **403 Forbidden:**
  - JWT token does not have the required role
  - Approver is not a valid role for approval
- **404 Not Found:**
  - User or student not found
- **Other errors:**
  - All errors return a JSON with a `message` or `error` field

### **Debugging Tips**
- Always use the JWT token from `/api/auth/login` for the correct user/role
- Use [jwt.io](https://jwt.io/) to decode and inspect your JWT
- Check the approval status and role of users in the database
- Use Postman or curl for testing all endpoints
- If you get a 403, check your JWT and user role

---

## Real-World Usage & Customization
- You can extend this project to add exam management, results, notifications, etc.
- Add more fields to users/entities as needed
- Integrate with frontend or mobile apps using the documented API
- Add Swagger/OpenAPI for interactive API docs
- Use environment variables for secrets in production

---

**For any questions or contributions, please open an issue or pull request.** 