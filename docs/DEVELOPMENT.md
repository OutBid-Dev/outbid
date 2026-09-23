# Outbid Development Guide

This document contains the development conventions, project structure, commands, tooling, and workflow used by the Outbid project.
It is intended for anyone joining the project and contributing code.

## 1. Project Overview

Outbid is a full-stack online auction platform for buying, selling, and bidding on college projects.

The repository is organized as a monorepo:

```text
outbid/
├── api/       # Spring Boot backend
├── web/       # React frontend
├── docs/      # Project documentation
└── ...
````

### Tech Stack

#### Frontend
- React
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui
- pnpm

#### Backend
- Java 21
- Spring Boot
- Maven
- Spring WebMVC
- Spring Data JPA
- PostgreSQL
- Flyway
- JWT
- Lombok

## 2. Prerequisites

Install the following before starting development:
- Git
- Node.js
- pnpm
- Java 21
- PostgreSQL

Verify installations:

```bash
git --version
node --version
pnpm --version
java --version
```

## 3. Getting Started

Clone the repository:

```bash
git clone <repository-url>
cd outbid
```

Install frontend dependencies:

```bash
pnpm install
```

The backend uses the Maven Wrapper, so Maven does not need to be installed globally.

## 4. Environment Variables

### Backend

The API uses environment variables for configuration.

Copy:

```text
api/.env.example
```

to:

```text
api/.env
```

or configure the required environment variables through your development environment.

Never commit `.env`.

Important variables include:

```env
DB_URL=
DB_USERNAME=
DB_PASSWORD=

JWT_SECRET=

ACCESS_TOKEN_EXPIRATION=
REFRESH_TOKEN_EXPIRATION=

COOKIE_SECURE=
```

Never commit real credentials, passwords, tokens, or secrets.

## 5. Backend Commands

The root project provides shortcuts for common API operations.

### Format Java

```bash
pnpm format:api
```

Uses Spotless + Google Java Format.

### Check Java formatting

```bash
api\mvnw.cmd -f api\pom.xml spotless:check
```

### Run Checkstyle

```bash
pnpm lint:api
```

### Run tests

```bash
pnpm test:api
```

### Run the complete API verification

```bash
pnpm check:api
```

`check:api` runs the Maven verification lifecycle and should be used before opening a PR.

## 6. Code Quality

Outbid uses different tools for different responsibilities.

```text
Java
 ├── Spotless
 │    └── Formatting
 │
 └── Checkstyle
      └── Static style/code checks

TypeScript / React
 ├── Prettier
 │    └── Formatting
 │
 └── ESLint
      └── Code quality
```

Do not manually configure Java formatting to fight Spotless. Spotless is the source of truth for Java formatting.

## 7. Pre-commit Hooks

Outbid uses Husky + lint-staged.
The pre-commit hook automatically checks staged files.

```text
git commit
    ↓
Husky
    ↓
lint-staged
    ↓
Format / lint affected files
    ↓
Commit allowed or rejected
```

You normally do not need to run these manually before every commit.

If a commit fails:

1. Read the error.
2. Fix the reported issue.
3. Stage the changes again.
4. Retry the commit.

Check staged files:

```bash
git status
```

## 8. Conventional Commits

All commits should follow Conventional Commits.

Format:

```text
<type>(<scope>): <description>
```

Examples:

```text
feat(api): add auction creation endpoint
feat(web): add auction details page
fix(api): prevent duplicate bids
fix(web): correct auction timer
refactor(api): simplify auction service
test(api): add bid service tests
docs: update development guide
chore: update dependencies
```

Common types:

| Type       | Purpose                                    |
| ---------- | ------------------------------------------ |
| `feat`     | New functionality                          |
| `fix`      | Bug fix                                    |
| `refactor` | Code restructuring without behavior change |
| `test`     | Tests                                      |
| `docs`     | Documentation                              |
| `chore`    | Maintenance/tooling                        |
| `style`    | Formatting/style-only changes              |
| `perf`     | Performance improvement                    |

Keep commit messages short and describe the actual change.

## 10. Database

Outbid uses PostgreSQL.
Database migrations are managed with Flyway. The database schema is divided into several major areas.

### Users & Authentication

```text
users
├── sessions
├── accounts
├── verifications
└── user_profiles
```

These tables handle:

- User accounts
- Login sessions
- Authentication providers
- Email verification
- Extended profile information

### Auctions

```text
categories
    ↓
auctions
    ├── bids
    ├── watchlists
    └── auction_media
```

An auction belongs to:

- one seller
- one category

An auction can have:

- many bids
- many watchers
- multiple media files

### Orders & Payments

```text
auction
   ↓
order
   ↓
payment
```

A completed auction can result in an order. The order stores the buyer, seller, winning bid, amounts, and order lifecycle. Payments are associated with orders and track payment status and provider information.

### Notifications

```text
notifications
```

Notifications can reference auctions and orders.

Examples include:

- Outbid notifications
- Auction started
- Auction ending
- Auction won
- Auction lost
- Order created
- Payment success/failure

### Reviews

```text
orders
   ↓
reviews
```

Reviews are associated with completed transactions and identify:

- reviewer
- reviewee
- rating
- comment
- review status

### Reports

```text
reports
```

Reports allow users to report auctions or users for moderation.

### Full Database Diagram

The complete relational schema is maintained in [dbdiagram.io](https://dbdocs.io/adityaprasad1837/OutBid?view=table_structure).

The diagram should be treated as the visual reference for relationships. Actual database changes must be implemented through Flyway migrations.

## 11. Database Migrations

Never modify the database schema manually for a change that belongs in the application.

Create a new Flyway migration.

Example:

```text
V1__initial_schema.sql
V2__add_auction_indexes.sql
V3__add_watchlist.sql
```

Migration files should be:

- Sequential
- Immutable after being applied
- Descriptive
- Small and focused

Do not edit an already-applied migration.

## 12. API Structure

The backend follows a feature-oriented structure.

Example:

```text
api/
└── src/
    └── main/
        └── java/
            └── com/outbid/api/
                ├── common/
                ├── health/
                ├── auth/
                ├── users/
                ├── auctions/
                ├── bids/
                ├── categories/
                ├── orders/
                └── ...
```

Features should generally keep their related:

- Controllers
- Services
- Repositories
- Entities
- DTOs
- Mappers
- Exceptions

together where practical.
Shared functionality belongs under `common/`.

## 13. API URL Structure

The backend uses:

```text
/api/v1
```

Example:

```text
GET /api/v1/auctions
GET /api/v1/auctions/{id}
POST /api/v1/auctions
POST /api/v1/auctions/{id}/bids
```

Keep API versioning at the application boundary.

## 14. Authentication

Authentication will use:

- Access tokens
- Refresh tokens
- HTTP cookies where applicable
- JWT
- Session/account persistence

Authentication-related implementation should remain centralized rather  
than duplicated across features.

## 15. Pull Request Guidelines

Before opening a PR:

```bash
git status
pnpm lint:web
pnpm typecheck:web
pnpm test:api
pnpm check:api
```

Also make sure:

- The code is formatted.
- Tests are included for meaningful behavior changes.
- No secrets are committed.
- Database migrations are included when the schema changes.
- The PR has a clear description.
- The branch is up to date with `main`.

Keep PRs focused. Avoid mixing unrelated changes.

## 16. Useful Commands

| Command                  | Purpose               |
| ------------------------ | --------------------- |
| `pnpm dev:web`           | Start frontend        |
| `pnpm build:web`         | Build frontend        |
| `pnpm lint:web`          | Lint frontend         |
| `pnpm typecheck:web`     | Typecheck frontend    |
| `pnpm format:web`        | Format frontend       |
| `pnpm format:api`        | Format Java           |
| `pnpm lint:api`          | Run Checkstyle        |
| `pnpm test:api`          | Run API tests         |
| `pnpm check:api`         | Full API verification |
| `git status`             | View working tree     |
| `git switch -c <branch>` | Create branch         |
