import { Input as InputPrimitive } from "@base-ui/react/input";
import { Eye, EyeOff } from "lucide-react";

import { cn } from "@/lib/utils";

function Input({
    className,
    type,
    showPassword = false,
    setShowPassword,
    ...props
}: React.ComponentProps<"input"> & {
    showPassword?: boolean;
    setShowPassword?: React.Dispatch<React.SetStateAction<boolean>>;
}) {
    const isPassword = type === "password";
    const inputType = isPassword ? (showPassword ? "text" : "password") : type;

    const inputClassName = cn(
        "h-8 w-full min-w-0 rounded-none border border-input bg-transparent px-2.5 py-1 text-xs transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-xs file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-1 aria-invalid:ring-destructive/20 md:text-xs dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
        isPassword && "pr-8",
        className
    );

    if (!isPassword) {
        return (
            <InputPrimitive
                type={type}
                data-slot="input"
                className={inputClassName}
                {...props}
            />
        );
    }

    return (
        <div className="relative flex w-full items-center">
            <InputPrimitive
                type={inputType}
                data-slot="input"
                className={inputClassName}
                {...props}
            />

            {setShowPassword && (
                <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-2.5 text-muted-foreground hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none"
                    aria-label={
                        showPassword ? "Hide password" : "Show password"
                    }
                    aria-pressed={showPassword}
                >
                    {showPassword ? (
                        <EyeOff className="h-3.5 w-3.5" />
                    ) : (
                        <Eye className="h-3.5 w-3.5" />
                    )}
                </button>
            )}
        </div>
    );
}

export { Input };
