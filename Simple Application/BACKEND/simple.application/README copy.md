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

### Authentication Endpoints

#### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "username": "newuser",
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "role": "USER"
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}
```

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

#### Get License by ID
```http
GET /licenses/{id}
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

#### Delete License (ADMIN only)
```http
DELETE /licenses/{id}
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

#### Update License Status (ADMIN/MANAGER only)
```http
PATCH /licenses/{id}/status?status=EXPIRED
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
```bash
curl -X GET http://localhost:8080/api/v1/licenses \
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

## Production Deployment

1. Update database configuration for production
2. Set secure JWT secret
3. Configure CORS for your domain
4. Set up proper logging
5. Use HTTPS in production
6. Consider using environment variables for sensitive data

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is for educational purposes. 