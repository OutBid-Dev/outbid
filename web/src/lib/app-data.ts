import { GavelIcon, LayoutDashboardIcon, UserCog2Icon } from "lucide-react";

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

export const DASHBOARD_TABS = {
    main: [
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
            items: [
                {
                    title: "All Auctions",
                    url: "/dashboard/auctions",
                },
                {
                    title: "Create Auction",
                    url: "/dashboard/auctions/create",
                },
            ],
        },
    ],
    secondary: [
        {
            id: "d-profile",
            name: "Profile",
            url: "/dashboard/profile",
            icon: UserCog2Icon,
        },
    ],
};
