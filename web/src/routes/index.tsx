import AuthLayout from "@/layouts/auth-layout";
import LoginPage from "@/pages/auth/login-page";
import RegisterPage from "@/pages/auth/register-page";
import { createBrowserRouter } from "react-router";

const router = createBrowserRouter([
    {
        path: "/",
        element: <div>Hello World</div>,
    },
    {
        element: <AuthLayout />,
        path: "/auth",
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
]);

export { router };
