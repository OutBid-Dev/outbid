import type { ColumnDef, RowData } from "@tanstack/react-table";
import {
    DataTableSelectCell,
    DataTableSelectHeader,
} from "@/components/data-table/data-table-select-column-components";
import type { DataTableFeatures } from "@/lib/data-table-features";

interface GetDataTableSelectColumnOptions<TData extends RowData> extends Omit<
    Partial<ColumnDef<DataTableFeatures, TData>>,
    "id" | "header" | "cell"
> {
    debug?: boolean;
}

export function getDataTableSelectColumn<TData extends RowData>({
    size = 40,
    enableHiding = false,
    enableSorting = false,
    debug = false,
    ...props
}: GetDataTableSelectColumnOptions<TData> = {}): ColumnDef<
    DataTableFeatures,
    TData
> {
    return {
        id: "select",
        header: ({ table }) => (
            <DataTableSelectHeader table={table} debug={debug} />
        ),
        cell: ({ row }) => <DataTableSelectCell row={row} debug={debug} />,
        size,
        enableHiding,
        enableSorting,
        ...props,
    };
}
