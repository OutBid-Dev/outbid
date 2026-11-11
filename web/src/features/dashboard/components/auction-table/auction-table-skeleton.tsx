import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";

export function AuctionTableSkeleton() {
    return (
        <DataTableSkeleton
            columnCount={6}
            rowCount={5}
            filterCount={2}
            cellWidths={["3rem", "14rem", "8rem", "10rem", "10rem", "10rem"]}
            withViewOptions
            withPagination
        />
    );
}
