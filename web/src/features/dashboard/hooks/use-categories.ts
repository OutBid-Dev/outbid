import { queryOptions, useQuery } from "@tanstack/react-query";
import api from "@/api/axios";
import { ENDPOINTS } from "@/api/endpoints";
import type { ApiSuccessResponse } from "@/lib/api.types";
import type {
    AuctionCategoriesResponse,
    AuctionCategory,
} from "../types/auction-types";

export const categoriesQueryKey = ["categories"] as const;

export const categoriesQueryOptions = () =>
    queryOptions({
        queryKey: categoriesQueryKey,
        queryFn: async (): Promise<AuctionCategory[]> => {
            const { data } = await api.get<
                ApiSuccessResponse<AuctionCategoriesResponse>
            >(ENDPOINTS.auctions.categories, {
                params: {
                    sortBy: "name",
                    sortDir: "asc",
                },
            });

            return data.data.content;
        },
        staleTime: 5 * 60 * 1000,
    });

export function useCategories() {
    return useQuery(categoriesQueryOptions());
}
