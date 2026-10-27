import { Link } from "react-router";
import {
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import { DASHBOARD_TABS } from "@/lib/app-data";

export default function SidebarMain() {
    const currentPath = window.location.pathname;

    return (
        <SidebarGroup>
            <SidebarGroupContent className="flex flex-col gap-2">
                <SidebarMenu className="gap-2">
                    {DASHBOARD_TABS.map((item) => (
                        <SidebarMenuItem key={item.id}>
                            <Link
                                to={item.url}
                                className={`${currentPath === item.url && "hover:bg-primary"}`}
                            >
                                <SidebarMenuButton
                                    tooltip={item.name}
                                    className={` ${
                                        currentPath === item.url &&
                                        "bg-primary text-primary-foreground hover:bg-primary"
                                    }`}
                                >
                                    {item.icon && <item.icon />}
                                    <span>{item.name}</span>
                                </SidebarMenuButton>
                            </Link>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    );
}
