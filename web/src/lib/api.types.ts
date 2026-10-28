export interface ApiSuccessResponse<T> {
    success: true;
    response: string;
    data: T;
}

export interface ApiErrorResponse {
    success: false;
    message: string;
    errors: unknown[];
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

export type UserRole = "USER" | "SELLER" | "ADMIN";

export interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    emailVerified: boolean;
    image: string | undefined;
    role: UserRole;
    createdAt: string;
    updatedAt: string;
}
