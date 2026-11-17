import {
    mutationOptions,
    useMutation,
    useQueryClient,
} from "@tanstack/react-query";
import { useNavigate } from "react-router";

import api from "@/api/axios";
import { ENDPOINTS } from "@/api/endpoints";
import { toast } from "@/components/ui/toast";
import type { ApiSuccessResponse } from "@/lib/api.types";
import { uploadImage } from "@/lib/cloudinary";
import { parseApiError } from "@/lib/error-handler";

import type { AuctionResponse } from "../types/auction-types";
import type { UpdateAuctionVariables } from "../types/update-auction-types";

import { auctionQueryKey, sellerAuctionsQueryKey } from "./use-auctions";

function buildCategoryOperations(originalIds: string[], updatedIds: string[]) {
    return [
        ...updatedIds
            .filter((id) => !originalIds.includes(id))
            .map((categoryId) => ({
                operation: "ADD" as const,
                categoryId,
            })),
        ...originalIds
            .filter((id) => !updatedIds.includes(id))
            .map((categoryId) => ({
                operation: "REMOVE" as const,
                categoryId,
            })),
    ];
}

function buildSpecificationOperations(
    original: Record<string, unknown> | null,
    updated: { key: string; value: string }[]
) {
    const previous = original ?? {};
    const next = Object.fromEntries(
        updated
            .filter(({ key, value }) => key.trim() && value.trim())
            .map(({ key, value }) => [key.trim(), value.trim()])
    );

    if (Object.keys(previous).length > 0 && Object.keys(next).length === 0) {
        return [{ operation: "CLEAR" as const }];
    }

    return [
        ...Object.entries(next)
            .filter(([key, value]) => previous[key] !== value)
            .map(([key, value]) => ({
                operation: "SET" as const,
                key,
                value,
            })),
        ...Object.keys(previous)
            .filter((key) => !(key in next))
            .map((key) => ({
                operation: "REMOVE" as const,
                key,
            })),
    ];
}

export const updateAuctionMutationOptions = (
    queryClient: ReturnType<typeof useQueryClient>,
    navigate: ReturnType<typeof useNavigate>
) =>
    mutationOptions({
        mutationFn: async ({
            auctionId,
            request,
            existingImages,
            newImages,
            removedImageIds,
            originalCategoryIds,
            categoryIds,
            originalSpecifications,
            specifications,
        }: UpdateAuctionVariables): Promise<AuctionResponse> => {
            const remainingImages =
                existingImages.filter(
                    (image) => !removedImageIds.includes(image.id)
                ).length + newImages.length;

            if (remainingImages < 1) {
                throw new Error("At least one auction image is required.");
            }

            try {
                const uploadedImages = [];

                for (const file of newImages) {
                    uploadedImages.push(await uploadImage(file));
                }

                const { data } = await api.patch<
                    ApiSuccessResponse<AuctionResponse>
                >(`${ENDPOINTS.auctions.list}/${auctionId}`, request);

                let updatedAuction = data.data;

                const imageOperations = [
                    ...removedImageIds.map((imageId) => ({
                        operation: "REMOVE" as const,
                        imageId,
                    })),
                    ...uploadedImages.map((image) => ({
                        operation: "ADD" as const,
                        imageUrl: image.url,
                    })),
                ];

                if (imageOperations.length > 0) {
                    const { data: imageData } = await api.patch<
                        ApiSuccessResponse<AuctionResponse>
                    >(`${ENDPOINTS.auctions.list}/${auctionId}/images`, {
                        operations: imageOperations,
                    });

                    updatedAuction = imageData.data;
                }

                const categoryOperations = buildCategoryOperations(
                    originalCategoryIds,
                    categoryIds
                );

                if (categoryOperations.length > 0) {
                    const { data: categoryData } = await api.patch<
                        ApiSuccessResponse<AuctionResponse>
                    >(`${ENDPOINTS.auctions.list}/${auctionId}/categories`, {
                        operations: categoryOperations,
                    });

                    updatedAuction = categoryData.data;
                }

                const specificationOperations = buildSpecificationOperations(
                    originalSpecifications,
                    specifications
                );

                if (specificationOperations.length > 0) {
                    const { data: specificationData } = await api.patch<
                        ApiSuccessResponse<AuctionResponse>
                    >(
                        `${ENDPOINTS.auctions.list}/${auctionId}/specifications`,
                        {
                            operations: specificationOperations,
                        }
                    );

                    updatedAuction = specificationData.data;
                }

                return updatedAuction;
            } catch (error) {
                if (
                    error instanceof Error &&
                    error.message === "At least one auction image is required."
                ) {
                    throw error;
                }

                throw parseApiError(error);
            }
        },

        onSuccess: (auction) => {
            queryClient.invalidateQueries({
                queryKey: sellerAuctionsQueryKey,
            });

            queryClient.invalidateQueries({
                queryKey: auctionQueryKey(auction.id),
            });

            toast.success("Auction updated successfully!");
            navigate("/dashboard/auctions");
        },

        onError: (error: Error) => {
            toast.error(error.message || "Failed to update auction.");
        },
    });

export function useUpdateAuction() {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    return useMutation(updateAuctionMutationOptions(queryClient, navigate));
}
