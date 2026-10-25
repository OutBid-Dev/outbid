import { LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCurrentUser } from "@/features/auth/hooks/use-current-user";
import { useLogout } from "@/features/auth/hooks/use-logout";

export default function NavUser() {
    const { data, isError } = useCurrentUser();
    const { logout, isPending: isLoggingOut } = useLogout();

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
        <div className="flex flex-row items-center gap-3">
            <div className="flex items-center gap-2">
                <div className="flex flex-col items-end">
                    <h4 className="text-md">
                        Welcome,{" "}
                        <span className="font-bold">{data?.firstName}</span>
                    </h4>
                    <p className="text-xs text-muted-foreground">
                        {data?.role}
                    </p>
                </div>

                <Avatar size="lg">
                    <AvatarImage
                        src={data?.image ?? undefined}
                        alt={data?.firstName}
                    />
                    <AvatarFallback>
                        {data?.firstName?.[0] ?? "U"}
                    </AvatarFallback>
                </Avatar>
            </div>

            <Separator orientation="vertical" className="h-10" />

            <Button
                variant="destructive"
                size="icon"
                className="rounded-full"
                aria-label="Log out"
                onClick={() => logout()}
                disabled={isLoggingOut}
            >
                <LogOut className="h-4 w-4" />
            </Button>
        </div>
    );
}
