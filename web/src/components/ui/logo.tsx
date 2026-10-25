import { cn } from "cn";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";

interface LogoProps {
    className?: string;
    size?: "sm" | "md" | "lg";
    shape?: "circle" | "square";
}

function Logo({ className, size = "md", shape = "circle" }: LogoProps) {
    return (
        <Avatar
            className={cn(
                shape === "circle" ? "rounded-full" : "rounded-md",
                size === "sm" ? "size-6" : size === "md" ? "size-8" : "size-10",
                "bg-muted text-muted-foreground",
                "group-data-[size=lg]/avatar:[&>svg]:size-6 group-data-[size=md]/avatar:[&>svg]:size-5 group-data-[size=sm]/avatar:[&>svg]:size-4",
                className
            )}
        >
            <AvatarImage src="/ico.svg" />
            <AvatarFallback>O</AvatarFallback>
        </Avatar>
    );
}

export default Logo;
