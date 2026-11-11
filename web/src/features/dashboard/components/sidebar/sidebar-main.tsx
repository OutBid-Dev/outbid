import { Link, useLocation } from "react-router";
import {
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import { DASHBOARD_TABS } from "@/lib/app-data";

export default function SidebarMain() {
    const { pathname } = useLocation();

    return (
        <SidebarGroup>
            <SidebarGroupContent className="flex flex-col gap-2">
                <SidebarMenu className="gap-2">
                    {DASHBOARD_TABS.map((item) => {
                        const isActive = pathname === item.url;

                        return (
                            <SidebarMenuItem key={item.id}>
                                <Link
                                    to={item.url}
                                    className={`${isActive && "hover:bg-primary"}`}
                                >
                                    <SidebarMenuButton
                                        tooltip={item.name}
                                        className={` ${
                                            isActive &&
                                            "bg-primary text-primary-foreground hover:bg-primary"
                                        }`}
                                    >
                                        {item.icon && <item.icon />}
                                        <span>{item.name}</span>
                                    </SidebarMenuButton>
                                </Link>
                            </SidebarMenuItem>
                        );
                    })}
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    );
}
