import { createColumnHelper } from "@tanstack/react-table";
import { CalendarClock, CircleDashed, Tag } from "lucide-react";

import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { getDataTableSelectColumn } from "@/components/data-table/data-table-select-column";
import { Badge } from "@/components/ui/badge";
import type { DataTableFeatures } from "@/lib/data-table-features";
import { formatDate } from "@/lib/format";

import type { AuctionResponse } from "../../types/auction-types";

const columnHelper = createColumnHelper<DataTableFeatures, AuctionResponse>();

const currencyFormatter = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
});

export const auctionTableColumns = columnHelper.columns([
    getDataTableSelectColumn<AuctionResponse>(),

    columnHelper.accessor("title", {
        id: "title",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} label="Auction" />
        ),
        cell: ({ cell }) => (
            <span className="font-medium">{cell.getValue()}</span>
        ),
        enableSorting: false,
        enableHiding: false,
    }),

    columnHelper.accessor("status", {
        id: "status",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} label="Status" />
        ),
        cell: ({ cell }) => (
            <Badge variant="outline" className="capitalize">
                {cell.getValue().toLowerCase()}
            </Badge>
        ),
        meta: {
            label: "Status",
            variant: "select",
            options: [
                { label: "Scheduled", value: "SCHEDULED" },
                { label: "Active", value: "ACTIVE" },
                { label: "Completed", value: "COMPLETED" },
                { label: "Cancelled", value: "CANCELLED" },
            ],
            icon: CircleDashed,
        },
        enableColumnFilter: true,
        enableSorting: false,
    }),

    columnHelper.accessor("itemCondition", {
        id: "itemCondition",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} label="Condition" />
        ),
        cell: ({ cell }) => (
            <div className="flex items-center gap-2">
                <Tag className="size-3.5 text-muted-foreground" />
                <span className="capitalize">
                    {cell.getValue().replaceAll("_", " ").toLowerCase()}
                </span>
            </div>
        ),
        meta: {
            label: "Condition",
            variant: "select",
            options: [
                { label: "New", value: "NEW" },
                { label: "Like New", value: "LIKE_NEW" },
                { label: "Good", value: "GOOD" },
                { label: "Fair", value: "FAIR" },
                { label: "Poor", value: "POOR" },
            ],
            icon: Tag,
        },
        enableColumnFilter: true,
        enableSorting: false,
    }),

    columnHelper.accessor("currentPrice", {
        id: "currentPrice",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} label="Current Price" />
        ),
        cell: ({ cell }) => (
            <span className="font-medium tabular-nums">
                {currencyFormatter.format(cell.getValue())}
            </span>
        ),
        enableSorting: false,
    }),

    columnHelper.accessor("endTime", {
        id: "endTime",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} label="Ends At" />
        ),
        cell: ({ cell }) => (
            <div className="flex items-center gap-2 whitespace-nowrap">
                <CalendarClock className="size-3.5 text-muted-foreground" />
                <span>{formatDate(cell.getValue())}</span>
            </div>
        ),
        enableSorting: false,
    }),
]);
