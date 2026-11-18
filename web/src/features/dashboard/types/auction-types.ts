export type ItemCondition =
    "NEW" | "LIKE_NEW" | "USED_GOOD" | "USED_FAIR" | "FOR_PARTS";

export type AuctionStatus = "SCHEDULED" | "ACTIVE" | "COMPLETED" | "CANCELLED";

export interface AuctionCategory {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface AuctionImage {
    id: string;
    imageUrl: string;
    displayOrder: number;
    primary: boolean;
}

export type AuctionSpecifications = Record<string, string>;

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
    images: AuctionImage[];
    createdAt: string;
    updatedAt: string;
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

export interface AuctionCategoriesResponse {
    content: AuctionCategory[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
    first: boolean;
    last: boolean;
    sortBy: string;
    sortDir: string;
    search: string | null;
}
