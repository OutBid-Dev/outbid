import { Outlet } from "react-router";
import Navbar from "@/features/dashboard/components/navbar";

function DashboardLayout() {
    return (
        <div className="flex h-dvh flex-col overflow-hidden">
            <header className="shrink-0">
                <Navbar />
            </header>
            <div className="flex min-h-0 flex-1">
                <Outlet />
            </div>
        </div>
    );
}

export default DashboardLayout;
