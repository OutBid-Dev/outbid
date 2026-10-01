import { Outlet } from "react-router";

function AuthLayout() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center p-4">
            <div className="grid w-full max-w-5xl gap-5 overflow-hidden rounded-none bg-card p-4 shadow-md md:grid-cols-2">
                <AuthBanner />
                <div className="flex w-full flex-col justify-center rounded-md">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}

function AuthBanner() {
    return (
        <div className="relative min-h-0 overflow-hidden rounded-md">
            <img
                src="/slide1.jpg"
                alt="Auth Banner"
                className="h-full w-full object-cover"
            />
        </div>
    );
}

export default AuthLayout;
