import { Link } from "react-router";
import {
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import type { DASHBOARD_TABS } from "@/lib/app-data";

export default function SidebarMain({
    items,
    pathname,
}: {
    items: typeof DASHBOARD_TABS.main;
    pathname: string;
}) {
    return (
        <SidebarGroup>
            <SidebarGroupContent className="flex flex-col gap-2">
                <SidebarMenu className="gap-2">
                    {items.map((item) => {
                        const hasSubMenu = !!item.items?.length;
                        const isActive = !hasSubMenu && pathname === item.url;
                        const targetUrl = item.items?.[0]?.url ?? item.url;

                        return (
                            <SidebarMenuItem key={item.id}>
                                <Link
                                    to={targetUrl}
                                    className={`${isActive && "hover:bg-primary"}`}
                                >
                                    <SidebarMenuButton
                                        tooltip={item.name}
                                        className={`${
                                            isActive &&
                                            "bg-primary text-primary-foreground hover:bg-primary"
                                        }`}
                                    >
                                        {item.icon && <item.icon />}
                                        <span>{item.name}</span>
                                    </SidebarMenuButton>
                                </Link>

                                {item.items?.length ? (
                                    <SidebarMenuSub>
                                        {item.items.map((subItem) => {
                                            const isSubActive =
                                                pathname === subItem.url;

                                            return (
                                                <SidebarMenuSubItem
                                                    key={subItem.title}
                                                >
                                                    <Link
                                                        to={subItem.url}
                                                        className={`${isSubActive && "hover:bg-primary"}`}
                                                    >
                                                        <SidebarMenuSubButton
                                                            className={`${
                                                                isSubActive &&
                                                                "bg-primary text-primary-foreground hover:bg-primary"
                                                            }`}
                                                        >
                                                            <span>
                                                                {subItem.title}
                                                            </span>
                                                        </SidebarMenuSubButton>
                                                    </Link>
                                                </SidebarMenuSubItem>
                                            );
                                        })}
                                    </SidebarMenuSub>
                                ) : null}
                            </SidebarMenuItem>
                        );
                    })}
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    );
}
