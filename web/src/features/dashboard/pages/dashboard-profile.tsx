import { AlertCircle, RefreshCw } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useCurrentUser } from "@/features/auth/hooks/use-current-user";
import { EditProfileDialog } from "../components/profile/edit-profile-dialog";
import { ProfileHeader } from "../components/profile/profile-header";
import { ProfileInformation } from "../components/profile/profile-information";

export default function DashboardProfile() {
    const [isEditOpen, setIsEditOpen] = useState(false);

    const { data: user, isLoading, isError, refetch } = useCurrentUser();

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="space-y-2">
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-4 w-64" />
                </div>

                <div className="rounded-xl border p-6">
                    <div className="flex items-center gap-4">
                        <Skeleton className="size-24 rounded-full" />
                        <div className="flex-1 space-y-3">
                            <Skeleton className="h-6 w-48" />
                            <Skeleton className="h-4 w-56" />
                            <Skeleton className="h-5 w-24" />
                        </div>
                    </div>
                </div>

                <div className="grid gap-5 lg:grid-cols-2">
                    <Skeleton className="h-72 rounded-xl" />
                    <Skeleton className="h-72 rounded-xl" />
                </div>
            </div>
        );
    }

    if (isError || !user) {
        return (
            <div className="flex min-h-100 flex-col items-center justify-center rounded-xl border border-dashed px-6 text-center">
                <div className="mb-4 rounded-full bg-muted p-4">
                    <AlertCircle className="size-6 text-muted-foreground" />
                </div>

                <h2 className="font-heading text-lg font-semibold">
                    Unable to load your profile
                </h2>

                <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                    We couldn't retrieve your account information. Please try
                    again.
                </p>

                <Button
                    variant="outline"
                    className="mt-5"
                    onClick={() => refetch()}
                >
                    <RefreshCw className="mr-2 size-4" />
                    Try again
                </Button>
            </div>
        );
    }

    return (
        <div className="mx-auto w-full max-w-5xl space-y-8">
            <div className="border-b pb-5">
                <div className="flex items-center gap-2">
                    <h1 className="font-heading text-2xl font-semibold tracking-tight">
                        My Profile
                    </h1>
                </div>

                <p className="mt-1 text-sm text-muted-foreground">
                    Manage your personal information and account details.
                </p>
            </div>

            <ProfileHeader user={user} onEdit={() => setIsEditOpen(true)} />

            <ProfileInformation user={user} />

            <EditProfileDialog
                user={user}
                open={isEditOpen}
                onOpenChange={setIsEditOpen}
            />
        </div>
    );
}
