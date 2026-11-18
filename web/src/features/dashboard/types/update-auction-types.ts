import type { AuctionImage, ItemCondition } from "./auction-types";

export interface UpdateAuctionRequest {
    title: string;
    description: string;
    itemCondition: ItemCondition;
    brand: string;
    model: string;
    location: string;
    startingPrice: number;
    minimumBidIncrement: number;
    startTime: string;
    endTime: string;
}

export interface UpdateAuctionVariables {
    auctionId: string;
    request: UpdateAuctionRequest;

    existingImages: AuctionImage[];
    newImages: File[];
    removedImageIds: string[];

    primaryExistingImageId: string | null;
    primaryImageIndex: number | null;

    originalCategoryIds: string[];
    categoryIds: string[];

    originalSpecifications: Record<string, unknown> | null;
    specifications: { key: string; value: string }[];
}
