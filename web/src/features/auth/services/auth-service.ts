import api from "@/api/axios";
import { ENDPOINTS } from "@/api/endpoints";
import type { ApiSuccessResponse, User } from "@/lib/api.types";
import type { LoginPayload, RegisterPayload } from "../types/auth-types";

export const loginService = async (
    payload: LoginPayload
): Promise<ApiSuccessResponse<User>> => {
    const { data } = await api.post<ApiSuccessResponse<User>>(
        ENDPOINTS.auth.login,
        payload
    );

    if (!data.success) {
        throw new Error(data.response || "Login failed. Please try again.");
    }

    return data;
};

export const registerService = async (
    payload: RegisterPayload
): Promise<ApiSuccessResponse<User>> => {
    const { data } = await api.post<ApiSuccessResponse<User>>(
        ENDPOINTS.auth.register,
        payload
    );

    if (!data.success) {
        throw new Error(
            data.response || "Registration failed. Please try again."
        );
    }

    return data;
};

export const logoutService = async (): Promise<void> => {
    await api.post(ENDPOINTS.auth.logout);
};
