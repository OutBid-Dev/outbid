import { Toast as ToastPrimitive } from "@base-ui/react/toast";
import { cn } from "cn";
import {
    CircleCheckIcon,
    InfoIcon,
    Loader2Icon,
    OctagonXIcon,
    TriangleAlertIcon,
    XIcon,
} from "lucide-react";
import type * as React from "react";
import { Button } from "@/components/ui/button";

type ToastKind =
    "default" | "success" | "info" | "warning" | "error" | "loading";

const toastManager = ToastPrimitive.createToastManager();

function showToast(
    type: ToastKind,
    title: string,
    description?: string,
    timeout?: number
) {
    return toastManager.add({
        title,
        description,
        type: type === "default" ? undefined : type,
        timeout,
    });
}

export const toast = Object.assign(
    (title: string, description?: string) =>
        showToast("default", title, description),
    {
        show: (title: string, description?: string) =>
            showToast("default", title, description),

        success: (title: string, description?: string) =>
            showToast("success", title, description),

        info: (title: string, description?: string) =>
            showToast("info", title, description),

        warn: (title: string, description?: string) =>
            showToast("warning", title, description),

        warning: (title: string, description?: string) =>
            showToast("warning", title, description),

        error: (title: string, description?: string) =>
            showToast("error", title, description),

        loading: (title: string, description?: string) =>
            showToast("loading", title, description, 0),
    }
);

function getToastVariantClasses(type: string | undefined) {
    switch (type) {
        case "success":
            return "border-emerald-500/40 bg-emerald-50 text-emerald-950 dark:bg-emerald-950 dark:text-emerald-50";

        case "info":
            return "border-sky-500/40 bg-sky-50 text-sky-950 dark:bg-sky-950 dark:text-sky-50";

        case "warning":
            return "border-amber-500/40 bg-amber-50 text-amber-950 dark:bg-amber-950 dark:text-amber-50";

        case "error":
            return "border-red-500/40 bg-red-50 text-red-950 dark:bg-red-950 dark:text-red-50";

        case "loading":
            return "border-violet-500/40 bg-violet-50 text-violet-950 dark:bg-violet-950 dark:text-violet-50";

        default:
            return "border-border bg-popover text-popover-foreground";
    }
}

function getToastIconClasses(type: string | undefined) {
    switch (type) {
        case "success":
            return "text-emerald-600 dark:text-emerald-400";

        case "info":
            return "text-sky-600 dark:text-sky-400";

        case "warning":
            return "text-amber-600 dark:text-amber-400";

        case "error":
            return "text-red-600 dark:text-red-400";

        case "loading":
            return "text-violet-600 dark:text-violet-400";

        default:
            return "text-muted-foreground";
    }
}

function ToastProvider({ ...props }: ToastPrimitive.Provider.Props) {
    return <ToastPrimitive.Provider {...props} />;
}

function ToastPortal({ ...props }: ToastPrimitive.Portal.Props) {
    return <ToastPrimitive.Portal data-slot="toast-portal" {...props} />;
}

function ToastViewport({ className, ...props }: ToastPrimitive.Viewport.Props) {
    return (
        <ToastPrimitive.Viewport
            data-slot="toast-viewport"
            className={cn(
                "sm:insert-end-4 sm:insert-s-auto pointer-events-none fixed inset-x-4 bottom-4 z-50 mx-auto w-auto max-w-sm outline-none sm:mx-0 sm:w-full",
                className
            )}
            {...props}
        />
    );
}

function Toast({ className, ...props }: ToastPrimitive.Root.Props) {
    return (
        <ToastPrimitive.Root
            data-slot="toast"
            className={cn(
                "group/toast insert-end-0 pointer-events-auto absolute bottom-0 z-[calc(1000-var(--toast-index))] w-full origin-bottom rounded-xl border shadow-lg will-change-transform outline-none select-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
                "[--gap:0.75rem] [--height:var(--toast-frontmost-height,var(--toast-height))] [--offset-y:calc(var(--toast-offset-y)*-1+calc(var(--toast-index)*var(--gap)*-1)+var(--toast-swipe-movement-y))] [--peek:0.75rem] [--scale:calc(max(0,1-(var(--toast-index)*0.1)))] [--shrink:calc(1-var(--scale))]",
                "h-(--height) transform-[translateX(var(--toast-swipe-movement-x))_translateY(calc(var(--toast-swipe-movement-y)-(var(--toast-index)*var(--peek))-(var(--shrink)*var(--height))))_scale(var(--scale))] [transition:transform_500ms_cubic-bezier(0.22,1,0.36,1),opacity_500ms,height_150ms]",
                "after:absolute after:inset-s-0 after:top-full after:h-[calc(var(--gap)+1px)] after:w-full after:content-['']",
                "data-expanded:h-(--toast-height) data-expanded:transform-[translateX(var(--toast-swipe-movement-x))_translateY(var(--offset-y))]",
                "data-limited:opacity-0 data-starting-style:transform-[translateY(150%)]",
                "[&[data-ending-style]:not([data-limited]):not([data-swipe-direction])]:transform-[translateY(150%)]",
                "data-ending-style:data-[swipe-direction=down]:transform-[translateY(calc(var(--toast-swipe-movement-y)+150%))]",
                "data-ending-style:data-[swipe-direction=left]:transform-[translateX(calc(var(--toast-swipe-movement-x)-150%))_translateY(var(--offset-y))]",
                "data-ending-style:data-[swipe-direction=right]:transform-[translateX(calc(var(--toast-swipe-movement-x)+150%))_translateY(var(--offset-y))]",
                "data-ending-style:data-[swipe-direction=up]:transform-[translateY(calc(var(--toast-swipe-movement-y)-150%))]",
                "data-expanded:data-ending-style:data-[swipe-direction=down]:transform-[translateY(calc(var(--toast-swipe-movement-y)+150%))]",
                "data-expanded:data-ending-style:data-[swipe-direction=left]:transform-[translateX(calc(var(--toast-swipe-movement-x)-150%))_translateY(var(--offset-y))]",
                "data-expanded:data-ending-style:data-[swipe-direction=right]:transform-[translateX(calc(var(--toast-swipe-movement-x)+150%))_translateY(var(--offset-y))]",
                "data-expanded:data-ending-style:data-[swipe-direction=up]:transform-[translateY(calc(var(--toast-swipe-movement-y)-150%))]",
                className
            )}
            {...props}
        />
    );
}

function ToastContent({ className, ...props }: ToastPrimitive.Content.Props) {
    return (
        <ToastPrimitive.Content
            data-slot="toast-content"
            className={cn(
                "flex h-full items-center gap-3 overflow-hidden p-4 transition-opacity duration-250 ease-[cubic-bezier(0.22,1,0.36,1)] data-behind:opacity-0 data-expanded:opacity-100",
                className
            )}
            {...props}
        />
    );
}

function ToastTitle({ className, ...props }: ToastPrimitive.Title.Props) {
    return (
        <ToastPrimitive.Title
            data-slot="toast-title"
            className={cn("text-sm font-semibold", className)}
            {...props}
        />
    );
}

function ToastDescription({
    className,
    ...props
}: ToastPrimitive.Description.Props) {
    return (
        <ToastPrimitive.Description
            data-slot="toast-description"
            className={cn("text-sm text-current/75", className)}
            {...props}
        />
    );
}

function ToastAction({
    className,
    render = <Button variant="outline" size="sm" />,
    ...props
}: ToastPrimitive.Action.Props) {
    return (
        <ToastPrimitive.Action
            data-slot="toast-action"
            render={render}
            className={cn("shrink-0", className)}
            {...props}
        />
    );
}

function ToastClose({
    className,
    children,
    render = <Button variant="ghost" size="icon-sm" />,
    ...props
}: ToastPrimitive.Close.Props) {
    return (
        <ToastPrimitive.Close
            data-slot="toast-close"
            aria-label="Close toast"
            render={render}
            className={cn(
                "relative shrink-0 text-current/70 after:absolute after:-inset-2 after:content-[''] hover:text-current",
                className
            )}
            {...props}
        >
            {children ?? <XIcon aria-hidden="true" />}
        </ToastPrimitive.Close>
    );
}

function getToastIcon(type: string | undefined): React.ReactNode {
    const iconClass = "size-5";

    switch (type) {
        case "success":
            return <CircleCheckIcon className={iconClass} aria-hidden="true" />;

        case "info":
            return <InfoIcon className={iconClass} aria-hidden="true" />;

        case "warning":
            return (
                <TriangleAlertIcon className={iconClass} aria-hidden="true" />
            );

        case "error":
            return <OctagonXIcon className={iconClass} aria-hidden="true" />;

        case "loading":
            return (
                <Loader2Icon
                    className={cn(iconClass, "animate-spin")}
                    aria-hidden="true"
                />
            );

        default:
            return null;
    }
}

function ToastIcon({ type }: { type: string | undefined }) {
    const icon = getToastIcon(type);

    if (!icon) return null;

    return (
        <span
            data-slot="toast-icon"
            className={cn(
                "shrink-0",
                getToastIconClasses(type),
                "[&_svg]:pointer-events-none"
            )}
        >
            {icon}
        </span>
    );
}

function ToastList() {
    const { toasts } = ToastPrimitive.useToastManager();

    return toasts.map((toastItem) => (
        <Toast
            key={toastItem.id}
            toast={toastItem}
            className={getToastVariantClasses(toastItem.type)}
        >
            <ToastContent>
                <ToastIcon type={toastItem.type} />

                <div className="flex min-w-0 flex-1 flex-col gap-1">
                    <ToastTitle />
                    <ToastDescription />
                </div>

                <ToastAction />
                <ToastClose />
            </ToastContent>
        </Toast>
    ));
}

function Toaster({
    children,
    toastManager: suppliedManager,
    ...props
}: ToastPrimitive.Provider.Props) {
    return (
        <ToastProvider
            toastManager={suppliedManager ?? toastManager}
            {...props}
        >
            {children}

            <ToastPortal>
                <ToastViewport>
                    <ToastList />
                </ToastViewport>
            </ToastPortal>
        </ToastProvider>
    );
}

const createToastManager = ToastPrimitive.createToastManager;
const useToastManager = ToastPrimitive.useToastManager;

export {
    createToastManager,
    Toast,
    ToastAction,
    ToastClose,
    ToastContent,
    ToastDescription,
    Toaster,
    ToastPortal,
    ToastProvider,
    ToastTitle,
    ToastViewport,
    useToastManager,
};
