import { TooltipProvider } from "../ui/tooltip";
import { TanstackProvider } from "./tanstack-provider";
import { ThemeProvider } from "./theme-provider";
import { Toaster } from "@/components/ui/toast";

export function AppProvider({ children, ...props }: React.PropsWithChildren) {
    return (
        <TanstackProvider>
            <ThemeProvider {...props}>
                <TooltipProvider>
                    {children}
                    <Toaster />
                </TooltipProvider>
            </ThemeProvider>
        </TanstackProvider>
    );
}
