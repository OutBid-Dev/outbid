import { createBrowserRouter, Navigate } from "react-router";
import LoginPage from "@/features/auth/pages/login-page";
import RegisterPage from "@/features/auth/pages/register-page";
import AuctionsPage from "@/features/dashboard/pages/auctions";
import CreateAuction from "@/features/dashboard/pages/create-auction";
import DashboardPage from "@/features/dashboard/pages/dashboard";
import AuthLayout from "@/layouts/auth-layout";
import DashboardLayout from "@/layouts/dashboard-layout";
import ProtectedRoute from "./protected-route";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Navigate to="/dashboard" replace />,
    },
    {
        path: "/auth",
        children: [
            {
                element: <AuthLayout />,
                children: [
                    {
                        path: "login",
                        element: <LoginPage />,
                    },
                    {
                        path: "register",
                        element: <RegisterPage />,
                    },
                ],
            },
        ],
    },
    {
        element: <ProtectedRoute />,
        children: [
            {
                path: "/dashboard",
                children: [
                    {
                        element: <DashboardLayout />,
                        children: [
                            {
                                index: true,
                                element: <DashboardPage />,
                            },
                            {
                                path: "auctions",
                                children: [
                                    {
                                        index: true,
                                        element: <AuctionsPage />,
                                    },
                                    {
                                        path: "create",
                                        element: <CreateAuction />,
                                    },
                                ],
                            },
                        ],
                    },
                ],
            },
        ],
    },
]);

export { router };
