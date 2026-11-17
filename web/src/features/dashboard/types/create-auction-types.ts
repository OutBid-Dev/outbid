import type { AuctionSpecifications, ItemCondition } from "./auction-types";

export interface CreateAuctionRequest {
    title: string;
    description: string;
    itemCondition: ItemCondition;
    brand: string | null;
    model: string | null;
    specifications: AuctionSpecifications | null;
    location: string | null;
    startingPrice: number;
    minimumBidIncrement: number;
    startTime: string;
    endTime: string;
    categoryIds: string[];
}

export type ImageOperationType = "ADD" | "REPLACE" | "REMOVE" | "REORDER";

export interface AuctionImageOperation {
    operation: ImageOperationType;
    imageId?: string;
    imageUrl?: string;
    displayOrder?: number;
}

export interface UpdateAuctionImagesRequest {
    operations: AuctionImageOperation[];
}
