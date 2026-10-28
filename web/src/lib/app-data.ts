import { GavelIcon, LayoutDashboardIcon } from "lucide-react";

export const REGISTER_OPTIONS = [
    {
        id: "google",
        name: "Google",
        icon: "https://res.cloudinary.com/aditya1837/image/upload/v1790793389/svg/google_nttfvp.svg",
    },
    {
        id: "apple",
        name: "Apple",
        icon: "https://res.cloudinary.com/aditya1837/image/upload/v1790793645/svg/Apple_dark_umpowb.svg",
    },
];

export const DASHBOARD_TABS = [
    {
        id: "d-dashboard",
        name: "Dashboard",
        url: "/dashboard",
        icon: LayoutDashboardIcon,
    },
    {
        id: "d-auctions",
        name: "Auctions",
        url: "/dashboard/auctions",
        icon: GavelIcon,
    },
];
