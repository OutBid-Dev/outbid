# OutBid

OutBid is a modern online auction platform designed to provide a seamless and efficient experience for both buyers and sellers. It addresses the need for a trustworthy and feature-rich environment for online auctions, catering to a diverse user base looking to buy or sell items through a transparent and engaging auction process.

OutBid aims to offer a centralized platform that combines robust auction management tools with intelligent features. The platform is built with the modern web user in mind, prioritizing usability, security, and performance.

## Features

OutBid offers a comprehensive set of features for managing auctions, products, users, and more. The following features are implemented:

### Buyers and Bidding
*   **Real-time Bidding:** Users can place bids in real-time on active auctions.
*   **Auction Discovery:** Browse and search for auctions based on various criteria.
*   **Watchlist:** Save auctions to a personal watchlist for easy tracking.

### Sellers and Product Listings
*   **Create Auctions:** Sellers can easily create new auction listings with detailed descriptions and images.
*   **Product Management:** Manage active and past listings.
*   **Seller Verification:** A verification process to ensure seller authenticity.

### Moderation and Verification
*   **Content Moderation:** Tools for moderating auction content and user activity.
*   **User Verification:** Processes to verify the identity of buyers and sellers.

### AI-Assisted Functionality
*   **Price Estimation:** AI-powered estimation of item prices to guide sellers and buyers.

## Technology Stack

OutBid is built using a modern technology stack:

*   **Frontend:** React, Vite, TypeScript, Tailwind CSS, Zustand, TanStack Query, Lucide React
*   **Backend:** Java, Spring Boot
*   **Database:** PostgreSQL
*   **Build Tools:** Maven (for backend), pnpm (for frontend monorepo)
*   **Development Tools:** Git, GitHub, Docker

## Architecture

The OutBid project follows a monorepo structure, with distinct directories for the backend (`api/`) and frontend (`web/`).

*   **Backend:** A Spring Boot application handling business logic, API endpoints, and database interactions.
*   **Frontend:** A React application responsible for the user interface and client-side interactions, communicating with the backend via APIs.
*   **Database:** PostgreSQL serves as the primary data store.

## Repository Structure

```
outbid/
├── api/             # Spring Boot backend application
├── docs/            # Project documentation
├── web/             # React frontend application
├── .gitignore       # Git ignore file
├── LICENSE          # Project license file
├── package.json     # Root package.json for monorepo management
├── pnpm-lock.yaml   # Lock file for pnpm dependencies
└── README.md        # Root README file (this document)
```

## Getting Started

Follow these steps to set up the development environment and run OutBid:

### Prerequisites

*   Node.js and pnpm: Ensure you have Node.js installed, and then install pnpm globally:
    ```bash
    npm install -g pnpm
    ```
*   Java Development Kit (JDK): Version 17 or later is recommended for the backend.
*   Maven: Ensure Maven is installed for backend builds.
*   Docker: Recommended for running PostgreSQL.

### Cloning the Repository

```bash
git clone https://github.com/your-username/outbid.git
cd outbid
```

### Installing Dependencies

Install frontend and backend dependencies using pnpm:

```bash
pnpm install
```

### Configuring Environment Variables

Copy the example environment files and fill in your configuration:

*   Backend: `api/.env.example` to `api/.env`
*   Frontend: `web/.env.example` to `web/.env`

Refer to the `api/.env.example` and `web/.env` files for required variables. **Never commit real secrets or credentials.**

### Preparing PostgreSQL

1.  **Start PostgreSQL:** If using Docker, start a PostgreSQL container. Ensure the container is configured with the database name, user, and password that match your `.env` file.
    ```bash
    # Example using Docker (adjust as needed based on your .env)
    docker run --name outbid-db -e POSTGRES_DB=outbid -e POSTGRES_USER=outbid -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres
    ```
2.  **Database Schema:** The backend application is expected to manage database schema creation or migrations. Ensure your PostgreSQL instance is running and accessible.

### Starting the Backend

Navigate to the `api` directory and start the Spring Boot application:

```bash
cd api
mvn spring-boot:run
```

### Starting the Frontend

Navigate to the `web` directory and start the React development server:

```bash
cd ../web
pnpm dev
```

### Verifying the Application

Once both the backend and frontend are running, access the application in your browser, typically at `http://localhost:5173` (or the port specified in your `web/.env` file). Ensure all features function as expected.

## Configuration

*   **Backend Configuration:** Managed via `api/.env` and Spring Boot's default configuration mechanisms.
*   **Frontend Configuration:** Managed via `web/.env`.

Refer to `api/.env.example` and `web/.env.example` for specific variables.

## Development Workflow

*   **Branching:** Follow standard Git branching conventions (e.g., feature branches).
*   **Commits:** Conventional Commits are recommended for commit messages.
*   **Linting & Formatting:** ESLint and Prettier are configured for the frontend, and Checkstyle for the backend. Run linters and formatters before committing at the root.
    *   Frontend: `pnpm lint:web`, `pnpm format:web`
    *   Backend: `pnpm lint:api`, `pnpm format:api`.

## Additional Information

*   [Frontend Documentation](web/README.md)
*   [Backend Documentation](api/README.md)
*   [License](/LICENSE)
