import { queryOptions, useQuery } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import api from "@/api/axios";
import { ENDPOINTS } from "@/api/endpoints";
import type { ApiSuccessResponse, User } from "@/lib/api.types";

export const currentUserQueryKey = ["auth", "current-user"] as const;

export const currentUserQueryOptions = queryOptions({
    queryKey: currentUserQueryKey,
    queryFn: async (): Promise<User | null> => {
        try {
            const { data } = await api.get<ApiSuccessResponse<User>>(
                ENDPOINTS.user.me
            );

            return data.data;
        } catch (error: unknown) {
            if (isAxiosError(error) && error.response?.status === 401) {
                return null;
            }

            throw error;
        }
    },
    staleTime: 1000 * 60 * 5,
    retry: false,
});

export function useCurrentUser() {
    return useQuery(currentUserQueryOptions);
}
