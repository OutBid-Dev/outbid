import { NuqsAdapter } from "nuqs/adapters/react";
import { Toaster } from "@/components/ui/toast";
import { TooltipProvider } from "../ui/tooltip";
import { TanstackProvider } from "./tanstack-provider";
import { ThemeProvider } from "./theme-provider";

export function AppProvider({ children, ...props }: React.PropsWithChildren) {
    return (
        <NuqsAdapter>
            <TanstackProvider>
                <ThemeProvider {...props}>
                    <TooltipProvider>
                        {children}
                        <Toaster />
                    </TooltipProvider>
                </ThemeProvider>
            </TanstackProvider>
        </NuqsAdapter>
    );
}
