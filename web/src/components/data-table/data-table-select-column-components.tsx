import {
    type CellContext,
    type HeaderContext,
    type RowData,
    Subscribe,
} from "@tanstack/react-table";
import { cn } from "cn";

import { Checkbox } from "@/components/ui/checkbox";
import type { DataTableFeatures } from "@/lib/data-table-features";

interface DataTableSelectHeaderProps<TData extends RowData> extends Pick<
    HeaderContext<DataTableFeatures, TData>,
    "table"
> {
    debug?: boolean;
}

export function DataTableSelectHeader<TData extends RowData>({
    table,
    debug,
}: DataTableSelectHeaderProps<TData>) {
    return (
        <Subscribe
            source={table.store}
            selector={() => ({
                checked: table.getIsAllPageRowsSelected(),
                indeterminate:
                    table.getIsSomePageRowsSelected() &&
                    !table.getIsAllPageRowsSelected(),
            })}
        >
            {({ checked, indeterminate }) => (
                <Checkbox
                    aria-label="Select all"
                    className={getHitboxClassName(debug)}
                    checked={checked}
                    indeterminate={indeterminate}
                    onCheckedChange={(value) =>
                        table.toggleAllPageRowsSelected(value)
                    }
                />
            )}
        </Subscribe>
    );
}

interface DataTableSelectCellProps<TData extends RowData> extends Pick<
    CellContext<DataTableFeatures, TData>,
    "row"
> {
    debug?: boolean;
}

export function DataTableSelectCell<TData extends RowData>({
    row,
    debug,
}: DataTableSelectCellProps<TData>) {
    return (
        <Subscribe
            source={row.table.atoms.rowSelection}
            selector={(selection) => selection[row.id] === true}
        >
            {(isSelected) => (
                <Checkbox
                    aria-label="Select row"
                    className={getHitboxClassName(debug)}
                    checked={isSelected}
                    onClick={(event) => {
                        if (
                            row.table.options.enableRowRangeSelection !== true
                        ) {
                            row.toggleSelected(!isSelected);
                            return;
                        }

                        if (event.shiftKey) event.preventDefault();

                        row.getToggleSelectedHandler()({
                            target: { checked: !isSelected },
                            shiftKey: event.shiftKey,
                            nativeEvent: event.nativeEvent,
                        });
                    }}
                />
            )}
        </Subscribe>
    );
}

function getHitboxClassName(debug?: boolean) {
    return cn(
        "select-none after:-inset-2",
        debug &&
            "after:border after:border-dashed after:border-red-500 after:bg-red-500/20"
    );
}
