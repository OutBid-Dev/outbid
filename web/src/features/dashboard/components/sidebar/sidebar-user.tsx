import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useCurrentUser } from "@/features/auth/hooks/use-current-user";
import { useLogout } from "@/features/auth/hooks/use-logout";
import SidebarUserButtons from "./sidebar-user-buttons";
import SidebarUserRoleBadge from "./sidebar-user-role-badge";

export default function SidebarUser() {
    const { data, isError } = useCurrentUser();
    const { isPending: isLoggingOut } = useLogout();

    if (isLoggingOut) {
        return (
            <div className="flex items-center gap-3">
                <div className="flex flex-col items-end gap-2">
                    <div className="h-4 w-28 animate-pulse rounded bg-muted" />
                    <div className="h-3 w-16 animate-pulse rounded bg-muted" />
                </div>
                <div className="size-10 animate-pulse rounded-full bg-muted" />
            </div>
        );
    }

    if (isError || !data) {
        return (
            <p className="text-sm text-muted-foreground">Unable to load user</p>
        );
    }

    return (
        <div className="relative flex flex-col gap-4 rounded-md border-2 border-dashed border-foreground/20 p-3">
            <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage
                        shape="square"
                        src={data?.image ?? "/profile_nsjsjksj.jpg"}
                        alt={data?.firstName}
                    />
                    <AvatarFallback>
                        {data?.firstName?.[0] ?? "U"}
                    </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                    <div className="flex items-center gap-1">
                        <span className="flex-1 truncate font-medium">
                            {data?.firstName} {data?.lastName}
                        </span>
                        <div className="absolute -top-2.5 right-2">
                            <SidebarUserRoleBadge role={data?.role} />
                        </div>
                    </div>
                    <span className="truncate text-xs text-muted-foreground">
                        {data?.email}
                    </span>
                </div>
            </div>

            <SidebarUserButtons />
        </div>
    );
}
