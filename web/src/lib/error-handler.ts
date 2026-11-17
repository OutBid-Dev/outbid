import axios from "axios";
import type { ApiErrorResponse } from "@/lib/api.types";

export interface ParsedError {
    message: string;
    errors: string[];
    statusCode: number | null;
}

const isRecord = (value: unknown): value is Record<string, unknown> => {
    return typeof value === "object" && value !== null;
};

export const parseApiError = (error: unknown): ParsedError => {
    if (axios.isCancel(error)) {
        return {
            message: "Request was cancelled.",
            errors: [],
            statusCode: 0,
        };
    }

    if (axios.isAxiosError<ApiErrorResponse>(error)) {
        // No response: network failure, timeout, connection issue, etc.
        if (!error.response) {
            const isTimeout =
                error.code === "ECONNABORTED" || error.code === "ETIMEDOUT";

            return {
                message: isTimeout
                    ? "The request timed out. Please try again."
                    : "Network error. Please check your connection.",
                errors: [],
                statusCode: 0,
            };
        }

        const data: unknown = error.response.data;
        const body = isRecord(data) ? data : {};

        const message =
            typeof body.message === "string" && body.message.trim()
                ? body.message
                : "Something went wrong.";

        const errors = Array.isArray(body.errors)
            ? body.errors.filter(
                  (item): item is string => typeof item === "string"
              )
            : [];

        return {
            message,
            errors,
            statusCode: error.response.status,
        };
    }

    return {
        message: "An unexpected error occurred.",
        errors: [],
        statusCode: null,
    };
};
