import { Home, LogOut, UserCog2 } from "lucide-react";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { useLogout } from "@/features/auth/hooks/use-logout";

export default function SidebarUserButtons() {
    const { logout, isPending } = useLogout();

    return (
        <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
                <Link to="/">
                    <Button
                        variant="outline"
                        size="sm"
                        className="rounded-md"
                        aria-label="Home"
                    >
                        <Home className="h-4 w-4" />
                        <span>Home</span>
                    </Button>
                </Link>

                <Link to="/dashboard/profile">
                    <Button
                        variant="outline"
                        size="sm"
                        className="rounded-md"
                        aria-label="Profile"
                    >
                        <UserCog2 className="h-4 w-4" />
                        <span>Profile</span>
                    </Button>
                </Link>
            </div>

            <Button
                variant="destructive"
                size="icon"
                className="rounded-full"
                aria-label="Log out"
                onClick={() => logout()}
                disabled={isPending}
            >
                <LogOut className="h-4 w-4" />
            </Button>
        </div>
    );
}
