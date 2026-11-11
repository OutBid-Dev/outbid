import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import api from "@/api/axios";
import { ENDPOINTS } from "@/api/endpoints";
import { toast } from "@/components/ui/toast";
import type { ApiSuccessResponse } from "@/lib/api.types";
import { parseApiError } from "@/utils/error-handler";
import type { CreateAuctionFormValues } from "../schemas/create-auction-schema";
import type { AuctionResponse } from "../types/auction-types";
import { sellerAuctionsQueryKey } from "./use-auctions";

export function useCreateAuction() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { mutate, isPending, isError, error, reset } = useMutation<
        AuctionResponse,
        Error,
        CreateAuctionFormValues
    >({
        mutationFn: async (payload: CreateAuctionFormValues) => {
            try {
                const { data } = await api.post<
                    ApiSuccessResponse<AuctionResponse>
                >(ENDPOINTS.auctions.list, payload);
                return data.data;
            } catch (rawError) {
                throw parseApiError(rawError);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: sellerAuctionsQueryKey });
            toast.success("Auction created successfully!");
            navigate(`/dashboard/auctions`);
        },
        onError: (error) => {
            toast.error(error.message || "Failed to create auction.");
        },
    });

    return {
        createAuction: mutate,
        isPending,
        isError,
        error,
        reset,
    };
}
