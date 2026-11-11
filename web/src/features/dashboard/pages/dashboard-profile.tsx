import {
    AlertCircle,
    Calendar,
    CheckCircle2,
    Loader2,
    Lock,
    Mail,
    Shield,
    User,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useCurrentUser } from "@/features/auth/hooks/use-current-user";

export default function DashboardProfile() {
    const { data: user, isLoading, isError, refetch } = useCurrentUser();

    if (isLoading) {
        return (
            <div className="flex flex-col gap-4">
                <div className="animate-pulse space-y-4">
                    <div className="h-8 w-48 rounded bg-muted" />
                    <div className="h-4 w-64 rounded bg-muted" />
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="h-24 rounded-lg bg-muted" />
                        <div className="h-24 rounded-lg bg-muted" />
                        <div className="h-24 rounded-lg bg-muted" />
                        <div className="h-24 rounded-lg bg-muted" />
                    </div>
                </div>
            </div>
        );
    }

    if (isError || !user) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-center">
                <AlertCircle className="mb-4 h-12 w-12 text-muted-foreground/50" />
                <h3 className="text-lg font-medium">Unable to load profile</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                    Please try refreshing the page or log in again.
                </p>
                <button
                    onClick={() => refetch()}
                    className="mt-4 text-sm text-primary hover:underline"
                >
                    Retry
                </button>
            </div>
        );
    }

    const initials =
        `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase() ||
        "U";
    const roleColors: Record<
        string,
        { bg: string; text: string; icon: string }
    > = {
        ADMIN: { bg: "bg-purple-800", text: "text-purple-200", icon: "👑" },
        SELLER: { bg: "bg-teal-800", text: "text-emerald-200", icon: "🏪" },
        USER: { bg: "bg-primary/20", text: "text-primary", icon: "👤" },
    };

    const roleConfig = roleColors[user.role] || roleColors.USER;

    const formatDate = (dateStr: string) => {
        try {
            return new Date(dateStr).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
            });
        } catch {
            return dateStr;
        }
    };

    return (
        <div className="space-y-6">
            {/* Hero Section */}
            <Card className="relative overflow-hidden border-primary/10 bg-linear-to-br from-primary/5 via-background to-secondary/5">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--primary)_0%,transparent_70%)] opacity-20" />
                <CardContent className="relative px-6 py-8 md:px-8">
                    <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                        <div className="flex items-center gap-4">
                            <Avatar className="h-20 w-20 bg-background shadow-lg ring-4 ring-primary/20">
                                <AvatarImage
                                    shape="square"
                                    src={user.image ?? "/profile_nsjsjksj.jpg"}
                                    alt={`${user.firstName} ${user.lastName}`}
                                />
                                <AvatarFallback className="font-heading text-2xl">
                                    {initials}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <h1 className="font-heading text-2xl font-bold tracking-tight md:text-3xl">
                                    {user.firstName} {user.lastName}
                                </h1>
                                <p className="mt-1 flex items-center gap-2 text-muted-foreground">
                                    <Mail className="h-4 w-4 shrink-0" />
                                    {user.email}
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-3">
                            <Badge
                                variant={
                                    user.role === "ADMIN"
                                        ? "admin"
                                        : user.role === "SELLER"
                                          ? "seller"
                                          : "default"
                                }
                                className="gap-1.5 px-3 py-1.5 text-sm"
                            >
                                <span className="text-lg">
                                    {roleConfig.icon}
                                </span>
                                {user.role}
                            </Badge>
                            {user.emailVerified && (
                                <Badge variant="secondary" className="gap-1.5">
                                    <CheckCircle2 className="h-3 w-3 text-green-500" />
                                    <span>Verified</span>
                                </Badge>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Details Grid */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="group transition-colors hover:border-primary/30">
                    <CardContent className="px-5 py-4">
                        <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-primary/10 p-2.5 transition-colors group-hover:bg-primary/20">
                                <User className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <p className="text-xs tracking-wider text-muted-foreground uppercase">
                                    Full Name
                                </p>
                                <p className="text-sm font-medium">
                                    {user.firstName} {user.lastName}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="group transition-colors hover:border-primary/30">
                    <CardContent className="px-5 py-4">
                        <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-blue-500/10 p-2.5 transition-colors group-hover:bg-blue-500/20">
                                <Mail className="h-5 w-5 text-blue-500" />
                            </div>
                            <div>
                                <p className="text-xs tracking-wider text-muted-foreground uppercase">
                                    Email
                                </p>
                                <p className="truncate text-sm font-medium">
                                    {user.email}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="group transition-colors hover:border-primary/30">
                    <CardContent className="px-5 py-4">
                        <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-amber-500/10 p-2.5 transition-colors group-hover:bg-amber-500/20">
                                <Shield className="h-5 w-5 text-amber-500" />
                            </div>
                            <div>
                                <p className="text-xs tracking-wider text-muted-foreground uppercase">
                                    Email Status
                                </p>
                                <p className="flex items-center gap-1 text-sm font-medium">
                                    {user.emailVerified ? (
                                        <>
                                            <CheckCircle2 className="h-3 w-3 text-green-500" />
                                            Verified
                                        </>
                                    ) : (
                                        <>
                                            <AlertCircle className="h-3 w-3 text-amber-500" />
                                            Pending
                                        </>
                                    )}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="group transition-colors hover:border-primary/30">
                    <CardContent className="px-5 py-4">
                        <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-purple-500/10 p-2.5 transition-colors group-hover:bg-purple-500/20">
                                <Calendar className="h-5 w-5 text-purple-500" />
                            </div>
                            <div>
                                <p className="text-xs tracking-wider text-muted-foreground uppercase">
                                    Member Since
                                </p>
                                <p className="text-sm font-medium">
                                    {formatDate(user.createdAt)}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Account Details Section */}
            <Card className="border-border/50">
                <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2">
                        <Lock className="h-5 w-5" />
                        Account Details
                    </CardTitle>
                    <CardDescription>
                        Manage your account information and security settings
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="flex flex-col gap-3 rounded-lg bg-muted/30 p-4 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex items-center gap-3">
                                <div className="rounded-lg border bg-background p-2">
                                    <User className="h-5 w-5 text-muted-foreground" />
                                </div>
                                <div>
                                    <p className="text-xs tracking-wider text-muted-foreground uppercase">
                                        User ID
                                    </p>
                                    <p className="font-mono text-sm break-all text-foreground/80">
                                        {user.id}
                                    </p>
                                </div>
                            </div>
                            <Badge
                                variant="outline"
                                className="whitespace-nowrap"
                            >
                                System Identifier
                            </Badge>
                        </div>

                        <Separator />

                        <div className="flex flex-col gap-3 rounded-lg bg-muted/30 p-4 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex items-center gap-3">
                                <div className="rounded-lg border bg-background p-2">
                                    <Calendar className="h-5 w-5 text-muted-foreground" />
                                </div>
                                <div>
                                    <p className="text-xs tracking-wider text-muted-foreground uppercase">
                                        Account Created
                                    </p>
                                    <p className="text-sm font-medium">
                                        {formatDate(user.createdAt)}
                                    </p>
                                </div>
                            </div>
                            <Badge
                                variant="outline"
                                className="whitespace-nowrap"
                            >
                                Registration Date
                            </Badge>
                        </div>

                        <Separator />

                        <div className="flex flex-col gap-3 rounded-lg bg-muted/30 p-4 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex items-center gap-3">
                                <div className="rounded-lg border bg-background p-2">
                                    <Calendar className="h-5 w-5 text-muted-foreground" />
                                </div>
                                <div>
                                    <p className="text-xs tracking-wider text-muted-foreground uppercase">
                                        Last Updated
                                    </p>
                                    <p className="text-sm font-medium">
                                        {formatDate(user.updatedAt)}
                                    </p>
                                </div>
                            </div>
                            <Badge
                                variant="outline"
                                className="whitespace-nowrap"
                            >
                                Profile Updated
                            </Badge>
                        </div>

                        <Separator />

                        <div className="flex flex-col gap-3 rounded-lg bg-muted/30 p-4 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex items-center gap-3">
                                <div className="rounded-lg border bg-background p-2">
                                    <Shield className="h-5 w-5 text-muted-foreground" />
                                </div>
                                <div>
                                    <p className="text-xs tracking-wider text-muted-foreground uppercase">
                                        Account Role
                                    </p>
                                    <p className="text-sm font-medium capitalize">
                                        {user.role.toLowerCase()}
                                    </p>
                                </div>
                            </div>
                            <Badge
                                variant={
                                    user.role === "ADMIN"
                                        ? "admin"
                                        : user.role === "SELLER"
                                          ? "seller"
                                          : "default"
                                }
                            >
                                {user.role}
                            </Badge>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="pt-0">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Loader2 className="h-3 w-3 animate-spin" />
                        <span>
                            Data loaded from server •{" "}
                            {new Date().toLocaleTimeString()}
                        </span>
                    </div>
                </CardFooter>
            </Card>

            {/* Quick Actions */}
            <Card className="border-border/50">
                <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2">
                        <User className="h-5 w-5" />
                        Quick Actions
                    </CardTitle>
                    <CardDescription>
                        Common account management tasks
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <button className="group flex items-center gap-3 rounded-lg bg-muted/30 p-4 text-left transition-colors hover:bg-muted/50">
                            <div className="rounded-lg bg-primary/10 p-2 transition-colors group-hover:bg-primary/20">
                                <User className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <p className="font-medium">Edit Profile</p>
                                <p className="text-xs text-muted-foreground">
                                    Update your name, email, and avatar
                                </p>
                            </div>
                        </button>
                        <button className="group flex items-center gap-3 rounded-lg bg-muted/30 p-4 text-left transition-colors hover:bg-muted/50">
                            <div className="rounded-lg bg-blue-500/10 p-2 transition-colors group-hover:bg-blue-500/20">
                                <Lock className="h-5 w-5 text-blue-500" />
                            </div>
                            <div>
                                <p className="font-medium">Change Password</p>
                                <p className="text-xs text-muted-foreground">
                                    Update your account password
                                </p>
                            </div>
                        </button>
                        <button className="group flex items-center gap-3 rounded-lg bg-muted/30 p-4 text-left transition-colors hover:bg-muted/50">
                            <div className="rounded-lg bg-amber-500/10 p-2 transition-colors group-hover:bg-amber-500/20">
                                <Shield className="h-5 w-5 text-amber-500" />
                            </div>
                            <div>
                                <p className="font-medium">Security Settings</p>
                                <p className="text-xs text-muted-foreground">
                                    Manage 2FA and login sessions
                                </p>
                            </div>
                        </button>
                        <button className="group flex items-center gap-3 rounded-lg bg-muted/30 p-4 text-left transition-colors hover:bg-muted/50">
                            <div className="rounded-lg bg-purple-500/10 p-2 transition-colors group-hover:bg-purple-500/20">
                                <Calendar className="h-5 w-5 text-purple-500" />
                            </div>
                            <div>
                                <p className="font-medium">
                                    Notification Preferences
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    Configure email and push alerts
                                </p>
                            </div>
                        </button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
