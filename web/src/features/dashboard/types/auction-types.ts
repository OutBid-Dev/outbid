export type AuctionStatus = "SCHEDULED" | "ACTIVE" | "COMPLETED" | "CANCELLED";

export type ItemCondition = "NEW" | "LIKE_NEW" | "GOOD" | "FAIR" | "POOR";

export interface AuctionResponse {
    id: string;
    title: string;
    description: string;
    itemCondition: ItemCondition;
    brand: string | null;
    model: string | null;
    specifications: AuctionSpecifications | null;
    location: string | null;
    startingPrice: number;
    currentPrice: number;
    minimumBidIncrement: number;
    startTime: string;
    endTime: string;
    status: AuctionStatus;
    sellerId: string;
    categoryIds: string[];
    images: AuctionImageResponse[];
    createdAt: string;
    updatedAt: string;
}

export type AuctionSpecifications = Record<string, string>;

export interface AuctionImageResponse {
    id: string;
    url: string;
    isPrimary: boolean;
    displayOrder: number;
}

export interface SortResponse {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
}

export interface PageableResponse {
    offset: number;
    pageNumber: number;
    pageSize: number;
    paged: boolean;
    unpaged: boolean;
    sort: SortResponse;
}

export interface PageResponse<T> {
    content: T[];
    empty: boolean;
    first: boolean;
    last: boolean;
    number: number;
    numberOfElements: number;
    pageable: PageableResponse;
    size: number;
    sort: SortResponse;
    totalElements: number;
    totalPages: number;
}
