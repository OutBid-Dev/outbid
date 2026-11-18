import {
    CalendarDays,
    Check,
    Clock3,
    Copy,
    Fingerprint,
    Mail,
    ShieldCheck,
    UserRound,
} from "lucide-react";
import type { ComponentType, ReactNode } from "react";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import type { User } from "@/lib/api.types";

interface ProfileInformationProps {
    user: User;
}

function formatDate(value: string) {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return "—";

    return new Intl.DateTimeFormat("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
    }).format(date);
}

function InfoRow({
    icon: Icon,
    label,
    children,
}: {
    icon: ComponentType<{ className?: string }>;
    label: string;
    children: ReactNode;
}) {
    return (
        <div className="grid gap-2 border-b border-dashed py-4 last:border-b-0 sm:grid-cols-[minmax(140px,0.8fr)_2fr] sm:items-center sm:gap-6">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Icon className="size-4 shrink-0" />
                <span>{label}</span>
            </div>

            <div className="min-w-0 text-sm font-medium">{children}</div>
        </div>
    );
}

function InformationSection({
    title,
    description,
    children,
}: {
    title: string;
    description?: string;
    children: ReactNode;
}) {
    return (
        <section className="min-w-0">
            <div className="border-b pb-3">
                <h3 className="font-heading text-base font-semibold">
                    {title}
                </h3>

                {description && (
                    <p className="mt-1 text-sm text-muted-foreground">
                        {description}
                    </p>
                )}
            </div>

            <div>{children}</div>
        </section>
    );
}

export function ProfileInformation({ user }: ProfileInformationProps) {
    const [copied, setCopied] = useState(false);

    const copyAccountId = async () => {
        try {
            await navigator.clipboard.writeText(user.id);
            setCopied(true);
            toast.success("Account ID copied.");

            window.setTimeout(() => setCopied(false), 2000);
        } catch {
            toast.error("Unable to copy account ID.");
        }
    };

    return (
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
            <InformationSection
                title="Personal details"
                description="Your personal profile information."
            >
                <InfoRow icon={UserRound} label="First name">
                    {user.firstName}
                </InfoRow>

                <InfoRow icon={UserRound} label="Last name">
                    {user.lastName}
                </InfoRow>

                <InfoRow icon={Mail} label="Email address">
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="break-all">{user.email}</span>

                        {user.emailVerified && (
                            <Badge
                                variant="outline"
                                className="border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
                            >
                                Verified
                            </Badge>
                        )}
                    </div>
                </InfoRow>
            </InformationSection>

            <InformationSection
                title="Account details"
                description="Information about your OutBid account."
            >
                <InfoRow icon={Fingerprint} label="Account ID">
                    <div className="flex items-center justify-between gap-2">
                        <span className="min-w-0 font-mono text-xs break-all">
                            {user.id}
                        </span>

                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="size-8 shrink-0"
                            onClick={copyAccountId}
                            aria-label="Copy account ID"
                        >
                            {copied ? (
                                <Check className="size-4 text-emerald-500" />
                            ) : (
                                <Copy className="size-4" />
                            )}
                        </Button>
                    </div>
                </InfoRow>

                <InfoRow icon={ShieldCheck} label="Account role">
                    {user.role}
                </InfoRow>

                <InfoRow icon={CalendarDays} label="Member since">
                    {formatDate(user.createdAt)}
                </InfoRow>

                <InfoRow icon={Clock3} label="Last updated">
                    {formatDate(user.updatedAt)}
                </InfoRow>
            </InformationSection>
        </div>
    );
}
