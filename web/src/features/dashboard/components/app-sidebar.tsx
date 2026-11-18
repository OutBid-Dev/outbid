import { useLocation } from "react-router";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarRail,
} from "@/components/ui/sidebar";
import { DASHBOARD_TABS } from "@/lib/app-data";
import SidebarHead from "./sidebar/sidebar-header";
import SidebarMain from "./sidebar/sidebar-main";
import { SidebarSecondary } from "./sidebar/sidebar-secondary";
import SidebarUser from "./sidebar/sidebar-user";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const { pathname } = useLocation();

    return (
        <Sidebar collapsible="offcanvas" {...props}>
            <SidebarHeader className="p-0">
                <SidebarHead />
            </SidebarHeader>
            <SidebarContent>
                <SidebarMain items={DASHBOARD_TABS.main} pathname={pathname} />
                <SidebarSecondary
                    items={DASHBOARD_TABS.secondary}
                    className="mt-auto"
                    pathname={pathname}
                />
            </SidebarContent>
            <SidebarFooter className="px-1 py-2">
                <SidebarUser />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
}
