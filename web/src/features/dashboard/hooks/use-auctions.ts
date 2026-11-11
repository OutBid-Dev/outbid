import {
    queryOptions,
    useQuery,
    useSuspenseQuery,
} from "@tanstack/react-query";
import api from "@/api/axios";
import { ENDPOINTS } from "@/api/endpoints";
import type { ApiSuccessResponse } from "@/lib/api.types";
import type { AuctionResponse, PageResponse } from "../types/auction-types";

export const auctionsQueryKey = ["auctions"] as const;
export const sellerAuctionsQueryKey = [...auctionsQueryKey, "seller"] as const;

export interface SellerAuctionParams {
    search?: string;
    status?: string;
    itemCondition?: string;
    minPrice?: number;
    maxPrice?: number;
    brand?: string;
    location?: string;
    page?: number;
    size?: number;
    sortBy?: string;
    direction?: "asc" | "desc";
}

export const auctionsQueryOptions = queryOptions({
    queryKey: auctionsQueryKey,
    queryFn: async (): Promise<PageResponse<AuctionResponse>> => {
        const { data } = await api.get<
            ApiSuccessResponse<PageResponse<AuctionResponse>>
        >(ENDPOINTS.auctions.list);

        return data.data;
    },
    staleTime: 1000 * 60,
});

export const sellerAuctionsQueryOptions = (params: SellerAuctionParams) =>
    queryOptions({
        queryKey: [...sellerAuctionsQueryKey, params],
        queryFn: async (): Promise<PageResponse<AuctionResponse>> => {
            const { data } = await api.get<
                ApiSuccessResponse<PageResponse<AuctionResponse>>
            >(ENDPOINTS.auctions.listForSeller, {
                params,
            });

            return data.data;
        },
        staleTime: 1000 * 60,
    });

export function useAuctions() {
    return useQuery(auctionsQueryOptions);
}

export function useSuspenseSellerAuctions(params: SellerAuctionParams) {
    return useSuspenseQuery(sellerAuctionsQueryOptions(params));
}
