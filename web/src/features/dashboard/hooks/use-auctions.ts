import {
    mutationOptions,
    type QueryClient,
    queryOptions,
    useMutation,
    useQuery,
    useQueryClient,
    useSuspenseQuery,
} from "@tanstack/react-query";
import api from "@/api/axios";
import { ENDPOINTS } from "@/api/endpoints";
import type { ApiSuccessResponse } from "@/lib/api.types";
import type { AuctionResponse, PageResponse } from "../types/auction-types";

export const auctionsQueryKey = ["auctions"] as const;
export const auctionQueryKey = (id: string) => ["auction", id] as const;
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

export const auctionQueryOptions = (id: string) =>
    queryOptions({
        queryKey: auctionQueryKey(id),
        queryFn: async (): Promise<AuctionResponse> => {
            const { data } = await api.get<ApiSuccessResponse<AuctionResponse>>(
                `${ENDPOINTS.auctions.list}/${id}`
            );

            return data.data;
        },
        enabled: Boolean(id),
        staleTime: 5 * 60 * 1000,
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

export const deleteAuctionMutationOptions = (queryClient: QueryClient) =>
    mutationOptions({
        mutationFn: async (auctionId: string) => {
            await api.delete(`${ENDPOINTS.auctions.list}/${auctionId}`);
        },
        onSuccess: (_, auctionId) => {
            queryClient.invalidateQueries({
                queryKey: auctionsQueryKey,
            });

            queryClient.invalidateQueries({
                queryKey: sellerAuctionsQueryKey,
            });

            queryClient.removeQueries({
                queryKey: auctionQueryKey(auctionId),
            });
        },
    });

export function useAuctions() {
    return useQuery(auctionsQueryOptions);
}

export function useAuction(id: string) {
    return useQuery(auctionQueryOptions(id));
}

export function useSuspenseSellerAuctions(params: SellerAuctionParams) {
    return useSuspenseQuery(sellerAuctionsQueryOptions(params));
}

export function useDeleteAuction() {
    const queryClient = useQueryClient();

    return useMutation(deleteAuctionMutationOptions(queryClient));
}
