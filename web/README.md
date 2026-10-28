# OutBid Frontend Documentation

The OutBid frontend is a modern, responsive single-page application built to power the digital-goods auction marketplace. It delivers real-time auction interactions, buyer and seller dashboards, item management, and AI-assisted price estimation workflows.

## Purpose and Responsibilities

The frontend application is responsible for:
*   Providing a seamless, accessible user interface for discovering, bidding on, and managing auctions.
*   Enabling sellers to create, edit, and track product listings and verification statuses.
*   Handling client-side routing, protected routes, and session persistence.
*   Managing server state via TanStack Query and global client state via Zustand.
*   Validating user inputs and forms using React Hook Form and Zod schemas.

## Technology Stack

*   **Core Framework:** React 19, TypeScript
*   **Build Tool & Bundler:** Vite with `@vitejs/plugin-react` and Tailwind CSS v4
*   **Routing:** React Router v8
*   **Server State & Caching:** TanStack Query (React Query)
*   **Global State Management:** Zustand
*   **Form Handling & Validation:** React Hook Form, Zod, `@hookform/resolvers`
*   **UI Components & Styling:** Tailwind CSS, `@base-ui/react`, Lucide React icons, Class Variance Authority (CVA)
*   **HTTP Client:** Axios

## Prerequisites

*   Node.js (18+ recommended)
*   pnpm (package manager)

## Installation & Setup

1.  Navigate to the `web` directory:
    ```bash
    cd web
    ```
2.  Install dependencies:
    ```bash
    pnpm install
    ```
3.  Configure environment variables by copying `.env.example` (or creating `.env`):
    ```env
    VITE_API_BASE_URL=http://localhost:8080/api
    ```

## Available Scripts

Defined in `package.json`:

*   `pnpm dev` — Starts the local Vite development server with HMR.
*   `pnpm build` — Runs type-checking (`tsc -b`) and bundles the app for production (`vite build`).
*   `pnpm lint` — Runs ESLint across the codebase.
*   `pnpm format` — Formats source files using Prettier.
*   `pnpm format:check` — Checks code formatting without making modifications.
*   `pnpm typecheck` — Runs TypeScript type-checking without emitting files.
*   `pnpm preview` — Locally previews the production build.

## Architecture & Directory Structure

```
web/
├── public/          # Static assets (images, icons)
├── src/
│   ├── api/         # Axios client setup and API integration modules
│   ├── components/  # Reusable UI components (shadcn/ui base, layout elements)
│   ├── features/    # Feature-specific components, hooks, and business logic
│   ├── hooks/       # Shared custom React hooks
│   ├── layouts/     # Application layout wrappers (Header, Footer, Navigation)
│   ├── lib/         # Utility libraries and third-party wrappers
│   ├── routes/      # Page-level route components and router configuration
│   ├── utils/       # Helper functions and shared formatters
│   ├── App.tsx      # Root component
│   ├── index.css    # Global CSS and Tailwind imports
│   └── main.tsx     # Application entry point
```

### Routing & Layouts
Routing is managed using React Router. Protected routes enforce authentication barriers, redirecting unauthenticated users to the login/authentication flow. Layout components provide consistent wrappers featuring responsive navigation headers and footers supporting both light and dark themes.

### Authentication Flow
Authentication state is synchronized with the backend via secure HTTP-only cookies or bearer tokens handled through Axios interceptors. Protected routes inspect current user state and handle session refresh/logout cycles gracefully.

### API Integration & TanStack Query
*   **Axios Client:** Centralized HTTP configuration with interceptors for error handling and credential attachment.
*   **TanStack Query:** Used for server state management. Query keys follow structured naming conventions (e.g., `['auctions']`, `['auction', id]`). Optimistic updates and cache invalidation are implemented for mutations like bidding and listing creation.

### Form Handling & Validation
Forms utilize `react-hook-form` paired with `zod` schemas via `@hookform/resolvers` to ensure robust client-side validation, error messaging, and type safety.

## Adding a New Feature

1.  **Define Types:** Create or update TypeScript interfaces in the relevant feature folder or `src/types/`.
2.  **API Service:** Add API caller functions inside `src/api/` using the shared Axios instance.
3.  **Hooks:** Create custom TanStack Query hooks (`useQuery` / `useMutation`) in `src/features/...` or `src/hooks/`.
4.  **Components & Routes:** Build accessible UI components utilizing Tailwind CSS and existing primitives, then wire them into `src/routes/`.

## Troubleshooting

*   **Port Conflicts:** If Vite fails to start on default port 5173, check running processes or configure a custom port in `vite.config.ts`.
*   **API Connection Errors:** Ensure the Spring Boot backend API is running and `VITE_API_BASE_URL` correctly points to the backend server.
