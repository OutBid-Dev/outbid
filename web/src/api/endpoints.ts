export const ENDPOINTS = {
    auth: {
        register: "/auth/register",
        login: "/auth/login",
        logout: "/auth/logout",
        logoutAll: "/auth/logout/all",
        refreshToken: "/auth/refresh",
        changePassword: "/auth/change-password",
    },

    user: {
        me: "/users/me",
        meUpdate: "/users/me",
        byId: (userId: string) => `/users/${userId}`,
    },

    seller: {
        apply: "/seller/apply",
        applications: "/seller/apply",
        applicationById: (applicationId: string) =>
            `/seller/apply/${applicationId}`,
    },

    admin: {
        sellerApplications: "/admin/seller-applications",
        sellerApplicationById: (applicationId: string) =>
            `/admin/seller-applications/${applicationId}`,
        approveSellerApplication: (applicationId: string) =>
            `/admin/seller-applications/${applicationId}/approve`,
        rejectSellerApplication: (applicationId: string) =>
            `/admin/seller-applications/${applicationId}/reject`,
    },

    health: "/health",
} as const;
