import { createSearchParamsCache } from "nuqs/server";
import type { AuctionResponse } from "@/features/dashboard/types/auction-types";
import { getDataTableSearchParams } from "@/lib/data-table-parsers";
import type {
    ColumnSortItem,
    DataTableColumnConfig,
    SortableColumnId,
} from "@/lib/data-table-types";

export const auctionColumnConfigs = {
    title: { variant: "text" },
    status: { variant: "multi-select" },
    itemCondition: { variant: "multi-select" },
    currentPrice: { variant: "number" },
    endTime: { variant: "date" },
} as const satisfies Partial<
    Record<keyof AuctionResponse, DataTableColumnConfig>
>;

export const auctionDefaultSorting = [
    { id: "endTime", desc: false },
] satisfies ColumnSortItem<SortableColumnId<typeof auctionColumnConfigs>>[];

export const searchParamsCache = createSearchParamsCache({
    ...getDataTableSearchParams({
        columnConfigs: auctionColumnConfigs,
        defaultSorting: auctionDefaultSorting,
    }),
});
