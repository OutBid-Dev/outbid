import {
    columnFilteringFeature,
    columnVisibilityFeature,
    createFilteredRowModel,
    createPaginatedRowModel,
    createSortedRowModel,
    filterFn_includesString,
    rowPaginationFeature,
    rowSelectionFeature,
    rowSortingFeature,
    sortFn_alphanumeric,
    sortFn_datetime,
    sortFn_text,
    tableFeatures,
} from "@tanstack/react-table";

export const auctionTableFeatures = tableFeatures({
    columnFilteringFeature,
    columnVisibilityFeature,
    rowPaginationFeature,
    rowSelectionFeature,
    rowSortingFeature,

    filteredRowModel: createFilteredRowModel(),
    paginatedRowModel: createPaginatedRowModel(),
    sortedRowModel: createSortedRowModel(),

    filterFns: {
        includesString: filterFn_includesString,
    },

    sortFns: {
        text: sortFn_text,
        alphanumeric: sortFn_alphanumeric,
        datetime: sortFn_datetime,
    },
});

export type DataAuctionTableFeatures = typeof auctionTableFeatures;
