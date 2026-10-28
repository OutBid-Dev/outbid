import { Navigate, Outlet, useLocation } from "react-router";
import { useCurrentUser } from "@/features/auth/hooks/use-current-user";

export default function ProtectedRoute() {
    const { data: user, isPending, isError } = useCurrentUser();
    const location = useLocation();

    if (isPending) {
        return <div>Checking session...</div>;
    }

    if (isError) {
        return <div>Unable to verify your session. Please try again.</div>;
    }

    if (!user) {
        return <Navigate to="/auth/login" replace state={{ from: location }} />;
    }

    return <Outlet />;
}
