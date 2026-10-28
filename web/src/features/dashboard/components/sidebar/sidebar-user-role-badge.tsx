import { Badge } from "@/components/ui/badge";
import type { UserRole } from "@/lib/api.types";

export default function SidebarUserRoleBadge({
    role,
    className,
}: {
    role: UserRole;
    className?: string;
}) {
    return (
        <Badge
            variant={role === "ADMIN" ? "admin" : "seller"}
            className={className}
        >
            {role}
        </Badge>
    );
}
