import { TooltipProvider } from "../ui/tooltip";
import { ThemeProvider } from "./theme-provider";

export function AppProvider({ children, ...props }: React.PropsWithChildren) {
    return (
        <ThemeProvider {...props}>
            <TooltipProvider>{children}</TooltipProvider>
        </ThemeProvider>
    );
}
