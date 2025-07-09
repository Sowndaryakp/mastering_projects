# License Management System

A comprehensive Spring Boot application with authentication, authorization, and CRUD operations for license management.

## Tech Stack

- **Java 21**
- **Spring Boot 3.5.3**
- **Spring Security** with JWT
- **Spring Data JPA** with Hibernate
- **PostgreSQL** (Production) / H2 (Development)
- **Lombok**
- **Maven**

## Features

### Authentication & Authorization
- JWT-based authentication
- Role-based access control (ADMIN, MANAGER, USER)
- User registration and login
- Password encryption with BCrypt

### License Management
- Create, Read, Update, Delete (CRUD) operations
- License key generation
- Status management (ACTIVE, EXPIRED, SUSPENDED, REVOKED)
- Search by customer, product, status
- Expiry date tracking

### Security Features
- CORS configuration
- Input validation
- Global exception handling
- Secure password storage

## Prerequisites

1. **Java 21** installed
2. **PostgreSQL** database (optional - H2 is used by default)
3. **Maven** installed

## Setup Instructions

### 1. Database Setup (Optional)

If using PostgreSQL, create a database:
```sql
CREATE DATABASE license_management;
```

Update `application.properties` with your PostgreSQL credentials:
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/license_management
spring.datasource.username=your_username
spring.datasource.password=your_password
```

### 2. Build and Run

```bash
# Navigate to project directory
cd simple.application

# Build the project
mvn clean install

# Run the application
mvn spring-boot:run
```

The application will start on `http://localhost:8080`

### 3. Default Users

The application creates default users on startup:

| Username | Password | Role |
|----------|----------|------|
| admin | admin123 | ADMIN |
| manager | manager123 | MANAGER |
| user | user123 | USER |

## API Documentation

### Base URL
```
http://localhost:8080/api/v1
```

> **Note:** All endpoints are prefixed with `/api/v1` because `server.servlet.context-path=/api/v1` is set in `application.properties`.

## JWT Authentication Details

This application uses **JWT (JSON Web Token)** for stateless authentication. All protected endpoints require a valid JWT in the `Authorization` header.

### JWT Configuration

Set these properties in `src/main/resources/application.properties`:
```properties
jwt.secret=sowndaryaSecretKeyForJWTTokenGeneration2024
jwt.expiration=86400000 # Token validity in milliseconds (24 hours)
```
- **jwt.secret**: Secret key for signing JWTs. Change this in production!
- **jwt.expiration**: Token validity duration in milliseconds.

### How JWT Works in This Application
- On successful registration or login, the server returns a JWT in the response body.
- The client must include this token in the `Authorization` header as `Bearer <token>` for all protected endpoints.
- The token contains the username as the subject and is signed using HS256.
- The server validates the token on each request using the secret key and checks for expiration.

### Authentication Endpoints

#### Register User
`POST /api/v1/auth/register`
- Returns: `{ "token": "<jwt>", "username": "...", "role": "...", "message": "User registered successfully" }`

#### Login
`POST /api/v1/auth/login`
- Returns: `{ "token": "<jwt>", "username": "...", "role": "...", "message": "Authentication successful" }`

#### Example Auth Response
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6...",
  "username": "admin",
  "role": "ADMIN",
  "message": "Authentication successful"
}
```

### Using the JWT Token
Include the token in the `Authorization` header for all protected endpoints:
```http
Authorization: Bearer <jwt_token>
```

### Token Validation
- The server checks the token signature and expiration for every request.
- If the token is invalid or expired, a `401 Unauthorized` response is returned.

## CRUD Operations Overview

### License CRUD Operations
- **Create**: `POST /licenses` (ADMIN, MANAGER)
- **Read**: 
  - `GET /licenses` (All authenticated users)
  - `GET /licenses/{id}` (All authenticated users)
  - `GET /licenses/key/{licenseKey}` (All authenticated users)
  - `GET /licenses/customer/{customerName}` (ADMIN, MANAGER)
  - `GET /licenses/product/{productName}` (ADMIN, MANAGER)
  - `GET /licenses/status/{status}` (ADMIN, MANAGER)
  - `GET /licenses/expired` (ADMIN, MANAGER)
- **Update**: 
  - `PUT /licenses/{id}` (ADMIN, MANAGER)
  - `PATCH /licenses/{id}/status` (ADMIN, MANAGER)
- **Delete**: `DELETE /licenses/{id}` (ADMIN only)

### User CRUD Operations
- **Read**:
  - `GET /users/profile` (All authenticated users)
  - `GET /users` (ADMIN only)
  - `GET /users/{id}` (ADMIN only)
- **Delete**: `DELETE /users/{id}` (ADMIN only)

> **Note:** User creation is handled via `/auth/register` and user updates are not exposed via API for security reasons.

### License Management Endpoints

#### Create License (ADMIN/MANAGER only)
```http
POST /licenses
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "licenseKey": "LIC-ABC12345",
  "productName": "Software Pro",
  "customerName": "Acme Corp",
  "customerEmail": "contact@acme.com",
  "issueDate": "2024-01-01",
  "expiryDate": "2025-01-01",
  "status": "ACTIVE",
  "maxUsers": 10,
  "description": "Enterprise license"
}
```

#### Get All Licenses (All authenticated users)
```http
GET /licenses
Authorization: Bearer <jwt_token>
```

#### Get License by ID (All authenticated users)
```http
GET /licenses/{id}
Authorization: Bearer <jwt_token>
```

#### Get License by Key (All authenticated users)
```http
GET /licenses/key/{licenseKey}
Authorization: Bearer <jwt_token>
```

#### Get Licenses by Customer (ADMIN/MANAGER only)
```http
GET /licenses/customer/{customerName}
Authorization: Bearer <jwt_token>
```

#### Get Licenses by Product (ADMIN/MANAGER only)
```http
GET /licenses/product/{productName}
Authorization: Bearer <jwt_token>
```

#### Get Licenses by Status (ADMIN/MANAGER only)
```http
GET /licenses/status/{status}
Authorization: Bearer <jwt_token>
```

#### Get Expired Licenses (ADMIN/MANAGER only)
```http
GET /licenses/expired
Authorization: Bearer <jwt_token>
```

#### Update License (ADMIN/MANAGER only)
```http
PUT /licenses/{id}
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "licenseKey": "LIC-ABC12345",
  "productName": "Software Pro Updated",
  "customerName": "Acme Corp",
  "customerEmail": "contact@acme.com",
  "issueDate": "2024-01-01",
  "expiryDate": "2025-01-01",
  "status": "ACTIVE",
  "maxUsers": 15,
  "description": "Updated enterprise license"
}
```

#### Update License Status (ADMIN/MANAGER only)
```http
PATCH /licenses/{id}/status?status=EXPIRED
Authorization: Bearer <jwt_token>
```

#### Delete License (ADMIN only)
```http
DELETE /licenses/{id}
Authorization: Bearer <jwt_token>
```

#### Generate License Key (ADMIN/MANAGER only)
```http
GET /licenses/generate-key
Authorization: Bearer <jwt_token>
```

### User Management Endpoints

#### Get Current User Profile
```http
GET /users/profile
Authorization: Bearer <jwt_token>
```

#### Get All Users (ADMIN only)
```http
GET /users
Authorization: Bearer <jwt_token>
```

#### Get User by ID (ADMIN only)
```http
GET /users/{id}
Authorization: Bearer <jwt_token>
```

#### Delete User (ADMIN only)
```http
DELETE /users/{id}
Authorization: Bearer <jwt_token>
```

## Quick Start: Login & Register URLs

Use these endpoints to obtain a JWT token before accessing protected CRUD operations:

- **Register:**
  - URL: `http://localhost:8080/api/v1/auth/register`
  - Method: `POST`
- **Login:**
  - URL: `http://localhost:8080/api/v1/auth/login`
  - Method: `POST`

> After registering or logging in, use the returned `token` as a Bearer token in the `Authorization` header for all subsequent CRUD requests.

## Role-Based Access Control

### ADMIN Role
- Full access to all endpoints
- Can manage users
- Can delete licenses
- Can perform all CRUD operations

### MANAGER Role
- Can create, read, update licenses
- Can view all license data
- Cannot delete licenses or manage users

### USER Role
- Can view licenses
- Can access their own profile
- Limited read-only access

## Development Tools

### H2 Console
Access H2 database console at: `http://localhost:8080/h2-console`
- JDBC URL: `jdbc:h2:mem:testdb`
- Username: `sa`
- Password: (leave empty)

### Health Check
```http
GET /auth/health
```

## Error Handling

The application includes comprehensive error handling:

- **400 Bad Request**: Invalid input data
- **401 Unauthorized**: Invalid credentials
- **403 Forbidden**: Insufficient permissions
- **404 Not Found**: Resource not found
- **500 Internal Server Error**: Unexpected errors

## Testing the Application

### 1. Register a new user
```bash
curl -X POST http://localhost:8080/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123",
    "firstName": "Test",
    "lastName": "User",
    "role": "USER"
  }'
```

### 2. Login to get JWT token
```bash
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin123"
  }'
```

### 3. Use the JWT token for authenticated requests

#### Create License
```bash
curl -X POST http://localhost:8080/api/v1/licenses \
  -H "Authorization: Bearer <your_jwt_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "licenseKey": "LIC-ABC12345",
    "productName": "Software Pro",
    "customerName": "Acme Corp",
    "customerEmail": "contact@acme.com",
    "issueDate": "2024-01-01",
    "expiryDate": "2025-01-01",
    "status": "ACTIVE",
    "maxUsers": 10,
    "description": "Enterprise license"
  }'
```

#### Get All Licenses
```bash
curl -X GET http://localhost:8080/api/v1/licenses \
  -H "Authorization: Bearer <your_jwt_token>"
```

#### Get License by ID
```bash
curl -X GET http://localhost:8080/api/v1/licenses/1 \
  -H "Authorization: Bearer <your_jwt_token>"
```

#### Get License by Key
```bash
curl -X GET http://localhost:8080/api/v1/licenses/key/LIC-ABC12345 \
  -H "Authorization: Bearer <your_jwt_token>"
```

#### Get Licenses by Customer
```bash
curl -X GET http://localhost:8080/api/v1/licenses/customer/Acme%20Corp \
  -H "Authorization: Bearer <your_jwt_token>"
```

#### Get Licenses by Product
```bash
curl -X GET http://localhost:8080/api/v1/licenses/product/Software%20Pro \
  -H "Authorization: Bearer <your_jwt_token>"
```

#### Get Licenses by Status
```bash
curl -X GET http://localhost:8080/api/v1/licenses/status/ACTIVE \
  -H "Authorization: Bearer <your_jwt_token>"
```

#### Get Expired Licenses
```bash
curl -X GET http://localhost:8080/api/v1/licenses/expired \
  -H "Authorization: Bearer <your_jwt_token>"
```

#### Update License
```bash
curl -X PUT http://localhost:8080/api/v1/licenses/1 \
  -H "Authorization: Bearer <your_jwt_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "licenseKey": "LIC-ABC12345",
    "productName": "Software Pro Updated",
    "customerName": "Acme Corp",
    "customerEmail": "contact@acme.com",
    "issueDate": "2024-01-01",
    "expiryDate": "2025-01-01",
    "status": "ACTIVE",
    "maxUsers": 15,
    "description": "Updated enterprise license"
  }'
```

#### Update License Status
```bash
curl -X PATCH "http://localhost:8080/api/v1/licenses/1/status?status=EXPIRED" \
  -H "Authorization: Bearer <your_jwt_token>"
```

#### Delete License
```bash
curl -X DELETE http://localhost:8080/api/v1/licenses/1 \
  -H "Authorization: Bearer <your_jwt_token>"
```

#### Generate License Key
```bash
curl -X GET http://localhost:8080/api/v1/licenses/generate-key \
  -H "Authorization: Bearer <your_jwt_token>"
```

## Project Structure

```
src/main/java/com/sow/simple/application/
├── config/
│   └── DataInitializer.java
├── controller/
│   ├── AuthController.java
│   ├── LicenseController.java
│   └── UserController.java
├── dto/
│   ├── AuthRequest.java
│   ├── AuthResponse.java
│   ├── LicenseRequest.java
│   └── UserRegistrationRequest.java
├── entity/
│   ├── License.java
│   ├── LicenseStatus.java
│   ├── Role.java
│   └── User.java
├── exception/
│   └── GlobalExceptionHandler.java
├── repository/
│   ├── LicenseRepository.java
│   └── UserRepository.java
├── security/
│   ├── JwtAuthenticationFilter.java
│   ├── JwtUtil.java
│   └── SecurityConfig.java
├── service/
│   ├── AuthService.java
│   ├── CustomUserDetailsService.java
│   └── LicenseService.java
└── Application.java
```

## Full Example URLs for License Management Endpoints

Use these full URLs when making requests (replace `{id}`, `{licenseKey}`, etc. as needed):

- **Create License:**  
  `POST http://localhost:8080/api/v1/licenses`
- **Get All Licenses:**  
  `GET http://localhost:8080/api/v1/licenses`
- **Get License by ID:**  
  `GET http://localhost:8080/api/v1/licenses/{id}`
- **Get License by Key:**  
  `GET http://localhost:8080/api/v1/licenses/key/{licenseKey}`
- **Get Licenses by Customer:**  
  `GET http://localhost:8080/api/v1/licenses/customer/{customerName}`
- **Get Licenses by Product:**  
  `GET http://localhost:8080/api/v1/licenses/product/{productName}`
- **Get Licenses by Status:**  
  `GET http://localhost:8080/api/v1/licenses/status/{status}`
- **Get Expired Licenses:**  
  `GET http://localhost:8080/api/v1/licenses/expired`
- **Update License:**  
  `PUT http://localhost:8080/api/v1/licenses/{id}`
- **Update License Status:**  
  `PATCH http://localhost:8080/api/v1/licenses/{id}/status?status=EXPIRED`
- **Delete License:**  
  `DELETE http://localhost:8080/api/v1/licenses/{id}`
- **Generate License Key:**  
  `GET http://localhost:8080/api/v1/licenses/generate-key`

> Always use the full URL (including `http://localhost:8080/api/v1`) when making requests from Postman, curl, or your frontend app.