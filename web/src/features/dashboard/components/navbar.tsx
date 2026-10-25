import Logo from "@/components/ui/logo";
import DashboardTabs from "./dashboard-tabs";
import NavUser from "./nav-user";

export default function Navbar() {
    return (
        <nav className="flex items-center justify-between p-4">
            <div className="flex items-center gap-2">
                <Logo size="lg" shape="square" />
                <h1 className="text-2xl font-bold">OutBid</h1>
            </div>
            <DashboardTabs />
            <NavUser />
        </nav>
    );
}
