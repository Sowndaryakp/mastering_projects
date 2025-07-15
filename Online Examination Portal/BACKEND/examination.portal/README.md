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

## Troubleshooting: CORS and CSRF with Spring Security

If you encounter issues such as requests being blocked (especially PUT, PATCH, DELETE) or CORS errors in the browser, check the following:

### CORS (Cross-Origin Resource Sharing)
- CORS is configured in `SecurityConfig.java`.
- By default, the backend allows requests from `http://172.18.7.86:5174` (see `setAllowedOrigins`).
- If your frontend runs on a different domain/port, update the allowed origins in `SecurityConfig.java`:
  ```java
  configuration.setAllowedOrigins(Arrays.asList("http://your-frontend-domain:port"));
  ```
- For development/testing, you can allow all origins (not recommended for production):
  ```java
  configuration.setAllowedOrigins(Collections.singletonList("*"));
  ```

### CSRF (Cross-Site Request Forgery)
- CSRF protection is **disabled** in this project for API endpoints (see `.csrf().disable()` in `SecurityConfig.java`).
- This allows PUT, PATCH, DELETE, and POST requests from the frontend without CSRF tokens.
- If you enable CSRF in the future, you must handle CSRF tokens in your frontend requests.

### Spring Security Method/URL Security
- If you add method-level security (e.g., `@PreAuthorize`) or restrict URLs in `SecurityConfig.java`, ensure your user/role has access.
- 403 Forbidden errors may be caused by security rules, not just CORS/CSRF.

### Example Error Messages
- **CORS error:**
  > Access to fetch at 'http://localhost:8080/api/users/approve/11?approverId=1' from origin 'http://localhost:3000' has been blocked by CORS policy
- **CSRF error:**
  > 403 Forbidden, Invalid CSRF Token

---

## Real-World Usage & Customization
- You can extend this project to add exam management, results, notifications, etc.
- Add more fields to users/entities as needed
- Integrate with frontend or mobile apps using the documented API
- Add Swagger/OpenAPI for interactive API docs
- Use environment variables for secrets in production

---

**For any questions or contributions, please open an issue or pull request.** 

---

## CRUD Endpoints for Students, Class Teachers, HODs, Principals (All Public)

All endpoints under `/api/users/**` are public. No authentication or JWT token is required.

### Students
- **Get all students:**
  - `GET /api/users/students`
  - **Response:**
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
- **Get student by ID:**
  - `GET /api/users/students/{id}`
  - **Response:**
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
- **Update student:**
  - `PUT /api/users/students/{id}`
  - **Request:**
    ```json
    {
      "name": "John Doe Updated",
      "email": "john.updated@example.com",
      "classOrDepartment": "10B"
    }
    ```
  - **Response:**
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
- **Patch student:**
  - `PATCH /api/users/students/{id}`
  - **Request:**
    ```json
    {
      "name": "Patched Name"
    }
    ```
  - **Response:**
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
- **Delete student:**
  - `DELETE /api/users/students/{id}`
  - **Response:** HTTP 204 No Content (if successful)

### Class Teachers
- **Get all class teachers:**
  - `GET /api/users/class-teachers`
  - **Response:**
    ```json
    [
      {
        "id": 2,
        "name": "Jane Smith",
        "email": "jane@class.com",
        "role": "CLASS_TEACHER",
        "approvalStatus": "APPROVED",
        "classOrDepartment": "10A",
        "approverName": "HOD Name",
        "message": null
      }
    ]
    ```
- **Get class teacher by ID:**
  - `GET /api/users/class-teachers/{id}`
  - **Response:**
    ```json
    {
      "id": 2,
      "name": "Jane Smith",
      "email": "jane@class.com",
      "role": "CLASS_TEACHER",
      "approvalStatus": "APPROVED",
      "classOrDepartment": "10A",
      "approverName": "HOD Name",
      "message": null
    }
    ```
- **Update class teacher:**
  - `PUT /api/users/class-teachers/{id}`
  - **Request:**
    ```json
    {
      "name": "Jane Smith Updated",
      "email": "jane.updated@class.com",
      "classOrDepartment": "10B"
    }
    ```
  - **Response:**
    ```json
    {
      "id": 2,
      "name": "Jane Smith Updated",
      "email": "jane.updated@class.com",
      "role": "CLASS_TEACHER",
      "approvalStatus": "APPROVED",
      "classOrDepartment": "10B",
      "approverName": "HOD Name",
      "message": "class teacher updated successfully"
    }
    ```
- **Patch class teacher:**
  - `PATCH /api/users/class-teachers/{id}`
  - **Request:**
    ```json
    {
      "name": "Patched Class Teacher"
    }
    ```
  - **Response:**
    ```json
    {
      "id": 2,
      "name": "Patched Class Teacher",
      "email": "jane.updated@class.com",
      "role": "CLASS_TEACHER",
      "approvalStatus": "APPROVED",
      "classOrDepartment": "10B",
      "approverName": "HOD Name",
      "message": "class teacher patched (test only)"
    }
    ```
- **Delete class teacher:**
  - `DELETE /api/users/class-teachers/{id}`
  - **Response:** HTTP 204 No Content (if successful)

### HODs
- **Get all HODs:**
  - `GET /api/users/hods`
  - **Response:**
    ```json
    [
      {
        "id": 3,
        "name": "HOD Name",
        "email": "hod@school.com",
        "role": "HOD",
        "approvalStatus": "APPROVED",
        "classOrDepartment": "Science",
        "approverName": "Principal Name",
        "message": null
      }
    ]
    ```
- **Get HOD by ID:**
  - `GET /api/users/hods/{id}`
  - **Response:**
    ```json
    {
      "id": 3,
      "name": "HOD Name",
      "email": "hod@school.com",
      "role": "HOD",
      "approvalStatus": "APPROVED",
      "classOrDepartment": "Science",
      "approverName": "Principal Name",
      "message": null
    }
    ```
- **Update HOD:**
  - `PUT /api/users/hods/{id}`
  - **Request:**
    ```json
    {
      "name": "HOD Name Updated",
      "email": "hod.updated@school.com",
      "classOrDepartment": "Maths"
    }
    ```
  - **Response:**
    ```json
    {
      "id": 3,
      "name": "HOD Name Updated",
      "email": "hod.updated@school.com",
      "role": "HOD",
      "approvalStatus": "APPROVED",
      "classOrDepartment": "Maths",
      "approverName": "Principal Name",
      "message": "hod updated successfully"
    }
    ```
- **Patch HOD:**
  - `PATCH /api/users/hods/{id}`
  - **Request:**
    ```json
    {
      "name": "Patched HOD"
    }
    ```
  - **Response:**
    ```json
    {
      "id": 3,
      "name": "Patched HOD",
      "email": "hod.updated@school.com",
      "role": "HOD",
      "approvalStatus": "APPROVED",
      "classOrDepartment": "Maths",
      "approverName": "Principal Name",
      "message": "hod patched (test only)"
    }
    ```
- **Delete HOD:**
  - `DELETE /api/users/hods/{id}`
  - **Response:** HTTP 204 No Content (if successful)

### Principals
- **Get all principals:**
  - `GET /api/users/principals`
  - **Response:**
    ```json
    [
      {
        "id": 4,
        "name": "Principal Name",
        "email": "principal@school.com",
        "role": "PRINCIPAL",
        "approvalStatus": "APPROVED",
        "classOrDepartment": "Administration",
        "approverName": "Admin Name",
        "message": null
      }
    ]
    ```
- **Get principal by ID:**
  - `GET /api/users/principals/{id}`
  - **Response:**
    ```json
    {
      "id": 4,
      "name": "Principal Name",
      "email": "principal@school.com",
      "role": "PRINCIPAL",
      "approvalStatus": "APPROVED",
      "classOrDepartment": "Administration",
      "approverName": "Admin Name",
      "message": null
    }
    ```
- **Update principal:**
  - `PUT /api/users/principals/{id}`
  - **Request:**
    ```json
    {
      "name": "Principal Name Updated",
      "email": "principal.updated@school.com",
      "classOrDepartment": "Admin"
    }
    ```
  - **Response:**
    ```json
    {
      "id": 4,
      "name": "Principal Name Updated",
      "email": "principal.updated@school.com",
      "role": "PRINCIPAL",
      "approvalStatus": "APPROVED",
      "classOrDepartment": "Admin",
      "approverName": "Admin Name",
      "message": "principal updated successfully"
    }
    ```
- **Patch principal:**
  - `PATCH /api/users/principals/{id}`
  - **Request:**
    ```json
    {
      "name": "Patched Principal"
    }
    ```
  - **Response:**
    ```json
    {
      "id": 4,
      "name": "Patched Principal",
      "email": "principal.updated@school.com",
      "role": "PRINCIPAL",
      "approvalStatus": "APPROVED",
      "classOrDepartment": "Admin",
      "approverName": "Admin Name",
      "message": "principal patched (test only)"
    }
    ```
- **Delete principal:**
  - `DELETE /api/users/principals/{id}`
  - **Response:** HTTP 204 No Content (if successful)

---

## Example Postman Usage

- **Get All Students:**
  - Method: GET
  - URL: `http://localhost:8080/api/users/students`
  - No headers required

- **Get All Class Teachers:**
  - Method: GET
  - URL: `http://localhost:8080/api/users/class-teachers`
  - No headers required

- **Get All HODs:**
  - Method: GET
  - URL: `http://localhost:8080/api/users/hods`
  - No headers required

- **Get All Principals:**
  - Method: GET
  - URL: `http://localhost:8080/api/users/principals`
  - No headers required

- **Get by ID, Update, Patch, Delete:**
  - Replace `/students/`, `/class-teachers/`, `/hods/`, `/principals/` and `{id}` as needed.
  - Use the appropriate HTTP method (GET, PUT, PATCH, DELETE).
  - For PUT/PATCH, send a JSON body (e.g. `{ "name": "New Name", ... }`).
  - No headers required. 