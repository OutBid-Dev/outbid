import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRef } from "react";
import { useNavigate } from "react-router";

import api from "@/api/axios";
import { ENDPOINTS } from "@/api/endpoints";
import { toast } from "@/components/ui/toast";
import type { ApiSuccessResponse } from "@/lib/api.types";
import { type UploadedImage, uploadImage } from "@/lib/cloudinary";
import { parseApiError } from "@/lib/error-handler";

import type { AuctionResponse } from "../types/auction-types";
import type {
    CreateAuctionRequest,
    UpdateAuctionImagesRequest,
} from "../types/create-auction-types";

import { sellerAuctionsQueryKey } from "./use-auctions";

interface CreateAuctionVariables {
    request: CreateAuctionRequest;
    images: File[];
    primaryImageIndex: number | null;
}

interface WorkflowState {
    auction: AuctionResponse | null;
    uploadedImages: Map<number, UploadedImage>;
}

export function useCreateAuction() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const workflowRef = useRef<WorkflowState>({
        auction: null,
        uploadedImages: new Map(),
    });

    const { mutate, mutateAsync, isPending, isError, error, reset } =
        useMutation<AuctionResponse, Error, CreateAuctionVariables>({
            mutationFn: async ({ request, images }) => {
                const workflow = workflowRef.current;

                if (!workflow.auction) {
                    try {
                        const { data } = await api.post<
                            ApiSuccessResponse<AuctionResponse>
                        >(ENDPOINTS.auctions.list, request);

                        workflow.auction = data.data;
                    } catch (error) {
                        throw parseApiError(error);
                    }
                }

                const auctionId = workflow.auction.id;

                for (const [index, file] of images.entries()) {
                    if (!workflow.uploadedImages.has(index)) {
                        const uploadedImage = await uploadImage(file);

                        workflow.uploadedImages.set(index, uploadedImage);
                    }
                }

                if (images.length > 0) {
                    const operations: UpdateAuctionImagesRequest["operations"] =
                        images.map((_, index) => ({
                            operation: "ADD",
                            imageUrl: workflow.uploadedImages.get(index)?.url,
                            displayOrder: index + 1,
                        }));

                    const imageRequest: UpdateAuctionImagesRequest = {
                        operations,
                    };

                    try {
                        const { data } = await api.patch<
                            ApiSuccessResponse<AuctionResponse>
                        >(
                            `${ENDPOINTS.auctions.list}/${auctionId}/images`,
                            imageRequest
                        );

                        return data.data;
                    } catch (error) {
                        throw parseApiError(error);
                    }
                }

                return workflow.auction;
            },

            onSuccess: () => {
                workflowRef.current = {
                    auction: null,
                    uploadedImages: new Map(),
                };

                queryClient.invalidateQueries({
                    queryKey: sellerAuctionsQueryKey,
                });

                toast.success("Auction created successfully!");

                navigate("/dashboard/auctions");
            },

            onError: (error) => {
                toast.error(error.message || "Failed to create auction.");
            },
        });

    const resetWorkflow = () => {
        if (isPending) return;

        workflowRef.current = {
            auction: null,
            uploadedImages: new Map(),
        };

        reset();
    };

    return {
        createAuction: mutate,
        createAuctionAsync: mutateAsync,
        isPending,
        isError,
        error,
        reset,
        resetWorkflow,
    };
}
