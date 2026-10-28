# OutBid API Documentation

This document provides details about the OutBid backend API, built with Java and Spring Boot.

## Purpose and Responsibilities

The backend API serves as the central hub for OutBid's operations. It handles all business logic, data management, and communication with the database. Its primary responsibilities include:

*   Managing user authentication and authorization.
*   Handling auction creation, bidding, and management.
*   Processing product listings and seller information.
*   Implementing moderation and verification workflows.
*   Providing AI-driven price estimations.
*   Interacting with the PostgreSQL database for data persistence.

## Technology Stack

*   **Language:** Java (version 17 or later recommended)
*   **Framework:** Spring Boot (version 3.x)
*   **Build Tool:** Maven
*   **Database:** PostgreSQL
*   **API Documentation:** OpenAPI (Swagger) is assumed to be integrated or can be added for interactive API documentation.
*   **Security:** Spring Security, JWT for authentication.

## Prerequisites

*   **Java Development Kit (JDK):** Version 17 or later.
*   **Maven:** Installed and configured.
*   **PostgreSQL:** Running instance accessible to the application.
*   **Docker:** Recommended for running PostgreSQL in a containerized environment.

## Project Structure (High-Level)

The backend is organized into several core packages:

*   **`com.outbid.api.controller`**: Contains REST controllers for handling incoming API requests.
*   **`com.outbid.api.service`**: Implements the business logic for various features.
*   **`com.outbid.api.repository`**: Handles data access operations using Spring Data JPA.
*   **`com.outbid.api.entity`**: Defines the domain models and database entities.
*   **`com.outbid.api.dto`**: Data Transfer Objects for request and response payloads.
*   **`com.outbid.api.config`**: Configuration classes for security, database, etc.
*   **`com.outbid.api.exception`**: Custom exception handling.

## Database Setup and Configuration

*   **Database:** PostgreSQL is the primary database. Ensure a PostgreSQL server is running and accessible.
*   **Configuration:** Database connection details (URL, username, password, driver class name) are configured in `src/main/resources/application.properties` or via environment variables in `.env`.
*   **Schema Management:** The application is expected to handle schema creation or migrations. This might be through Spring Data JPA's DDL generation (`spring.jpa.hibernate.ddl-auto`) or a dedicated migration tool like Flyway or Liquibase (if integrated).

## Environment Variables

Environment-specific configuration, including database credentials and JWT secrets, should be managed through environment variables. Refer to `.env.example` for a list of required variables.

**Example `.env.example` variables:**

```
SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/outbid
SPRING_DATASOURCE_USERNAME=outbid
SPRING_DATASOURCE_PASSWORD=your_password
JWT_SECRET=your_super_secret_key
```

**Note:** Never commit sensitive information to the repository. Use `.env` files for local development and appropriate secrets management for production.

## API Endpoints

Below is a summary of available API endpoints, grouped by domain. Authentication requirements are indicated where applicable.

### Authentication

*   `POST /api/auth/register`: Register a new user.
*   `POST /api/auth/login`: Authenticate a user and receive a JWT.

### Auctions

*   `POST /api/auctions`: Create a new auction (Requires Authentication).
*   `GET /api/auctions`: Get a list of all auctions.
*   `GET /api/auctions/{id}`: Get details of a specific auction.
*   `POST /api/auctions/{id}/bid`: Place a bid on an auction (Requires Authentication).

### Sellers

*   `POST /api/sellers/verify`: Request seller verification (Requires Authentication).

### Products

*   `POST /api/products`: Create a new product listing (Requires Authentication).
*   `GET /api/products`: Get a list of products.

*(This list is illustrative and should be expanded based on the actual implementation in the controllers.)*

## Security

*   **Authentication:** JWT is used for securing API endpoints. Tokens are expected in the `Authorization` header.
*   **Authorization:** Role-based access control is implemented using Spring Security.
*   **CORS:** Cross-Origin Resource Sharing is configured to allow requests from the frontend application's origin.

## Development Workflow

### Building the Project

Navigate to the `api` directory and use Maven to build the project:

```bash
mvn clean install
```

### Running the Application

*   **From IDE:** Run the `OutBidApplication` class (e.g., `com.outbid.api.OutBidApplication`).
*   **Using Maven:**
    ```bash
    mvn spring-boot:run
    ```

### Testing

Run the Maven test goal to execute unit and integration tests:

```bash
mvn test
```

## Additional Information

*   **License:** This project does not specify a license.
*   **Contribution:** Refer to the root `README.md` for general contribution guidelines.
