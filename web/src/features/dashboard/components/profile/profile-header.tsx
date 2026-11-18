import { Pencil } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { User } from "@/lib/api.types";

interface ProfileHeaderProps {
    user: User;
    onEdit: () => void;
}

const roleLabels: Record<User["role"], string> = {
    ADMIN: "Administrator",
    SELLER: "Seller",
    USER: "Buyer",
};

export function ProfileHeader({ user, onEdit }: ProfileHeaderProps) {
    const initials =
        `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();

    return (
        <section className="relative overflow-hidden pb-7">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-center">
                    <Avatar className="size-24 shrink-0 border border-border shadow-sm">
                        <AvatarImage
                            src={user.image ?? undefined}
                            alt={`${user.firstName} ${user.lastName}`}
                        />
                        <AvatarFallback className="bg-muted text-2xl font-semibold">
                            {initials || "U"}
                        </AvatarFallback>
                    </Avatar>

                    <div className="min-w-0 space-y-2">
                        <h2 className="flex flex-wrap items-center gap-2 font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
                            {user.firstName} {user.lastName}
                        </h2>

                        <p className="truncate text-sm text-muted-foreground sm:text-base">
                            {user.email}
                        </p>

                        <div className="flex flex-wrap items-center gap-2">
                            <Badge
                                variant="secondary"
                                className="text-xs uppercase"
                            >
                                {roleLabels[user.role] ?? user.role}
                            </Badge>
                        </div>
                    </div>
                </div>

                <Button
                    onClick={onEdit}
                    variant="outline"
                    className="w-full gap-2 sm:w-auto"
                >
                    <Pencil className="size-4" />
                    Edit profile
                </Button>
            </div>
        </section>
    );
}
