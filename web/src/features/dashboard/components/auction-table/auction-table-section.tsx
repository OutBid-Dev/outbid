import { parseAsInteger, parseAsString, useQueryStates } from "nuqs";
import { useMemo } from "react";

import { useSuspenseSellerAuctions } from "../../hooks/use-auctions";
import { AuctionDataTable } from "./auction-data-table";

export function AuctionTableSection() {
    const [filters] = useQueryStates({
        page: parseAsInteger.withDefault(1),
        perPage: parseAsInteger.withDefault(10),
        sort: parseAsString.withDefault(""),
        search: parseAsString.withDefault(""),
        status: parseAsString.withDefault(""),
        itemCondition: parseAsString.withDefault(""),
    });

    const params = useMemo(() => {
        const firstSort = filters.sort.split(",")[0] || "endTime.asc";
        const [sortBy, sortDirection] = firstSort.split(".");

        return {
            search: filters.search.trim() || undefined,
            status: filters.status || undefined,
            itemCondition: filters.itemCondition || undefined,
            page: Math.max(0, filters.page - 1),
            size: filters.perPage,
            sortBy: sortBy || "endTime",
            direction:
                sortDirection === "desc" ? ("desc" as const) : ("asc" as const),
        };
    }, [filters]);

    const { data } = useSuspenseSellerAuctions(params);

    return (
        <>
            <p className="mb-3 text-sm text-muted-foreground">
                {data.totalElements} auctions
            </p>

            <AuctionDataTable data={data.content} pageCount={data.totalPages} />
        </>
    );
}
