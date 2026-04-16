# Admin Backend - Spring Boot

## Requirements
- Java 17+
- Maven 3.6+ (or use IDE with Maven support)

## Running the Application

### Option 1: Using Maven
```bash
mvn spring-boot:run
```

### Option 2: Using IDE
Open the project in IntelliJ IDEA or VS Code with Java extension, then run `AdminApplication.java`.

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/info` - Get current user info

### Users
- `GET /api/user/list` - Get user list (pagination)
- `GET /api/user/:id` - Get user by ID
- `POST /api/user` - Create user
- `PUT /api/user/:id` - Update user
- `DELETE /api/user/:id` - Delete user

## Default Users
| Username | Password | Role |
|----------|----------|------|
| admin | admin123 | admin |
| user | user123 | user |
| test | test123 | user |

## Configuration

### Using H2 Database (Default)
The application uses H2 in-memory database by default.
- H2 Console: http://localhost:3000/h2-console
- JDBC URL: `jdbc:h2:mem:admin`
- Username: `sa`
- Password: (empty)

### Switching to MySQL
1. Create MySQL database:
   ```sql
   CREATE DATABASE admin CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```

2. Activate MySQL profile:
   ```bash
   mvn spring-boot:run -Dspring-boot.run.profiles=mysql
   ```

3. Edit `application-mysql.yml` with your database credentials.

## JWT Configuration
Edit `application.yml` to change JWT settings:
- `jwt.secret` - Secret key (at least 256 bits for HS256)
- `jwt.expiration` - Token expiration time in milliseconds