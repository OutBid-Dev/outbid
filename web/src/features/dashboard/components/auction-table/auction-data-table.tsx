import { DataTable } from "@/components/data-table/data-table";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import { useDataTable } from "@/hooks/use-data-table";

import type { AuctionResponse } from "../../types/auction-types";
import { auctionTableColumns } from "./auction-columns";

interface AuctionDataTableProps {
    data: AuctionResponse[];
    pageCount: number;
}

export function AuctionDataTable({ data, pageCount }: AuctionDataTableProps) {
    const { table } = useDataTable({
        mode: "server",
        data,
        columns: auctionTableColumns,
        pageCount,
        debounceMs: 800,
        initialState: {
            sorting: [{ id: "endTime", desc: false }],
            pagination: {
                pageSize: 10,
                pageIndex: 0,
            },
            columnPinning: {
                start: ["select"],
                end: [],
            },
        },
        getRowId: (row) => row.id,
    });

    return (
        <div className="data-table-container">
            <DataTable table={table}>
                <DataTableToolbar
                    table={table}
                    globalFilterPlaceholder="Search auctions..."
                />
            </DataTable>
        </div>
    );
}
