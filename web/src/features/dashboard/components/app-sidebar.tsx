import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarRail,
} from "@/components/ui/sidebar";
import SidebarHead from "./sidebar/sidebar-header";
import SidebarMain from "./sidebar/sidebar-main";
import SidebarUser from "./sidebar/sidebar-user";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar collapsible="offcanvas" {...props}>
            <SidebarHeader className="p-0">
                <SidebarHead />
            </SidebarHeader>
            <SidebarContent>
                <SidebarMain />
            </SidebarContent>
            <SidebarFooter className="px-1 py-2">
                <SidebarUser />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
}
