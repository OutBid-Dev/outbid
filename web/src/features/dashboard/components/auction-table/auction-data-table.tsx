import { useState } from "react";
import { DataTable } from "@/components/data-table/data-table";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useDataTable } from "@/hooks/use-data-table";
import { useDeleteAuction } from "../../hooks/use-auctions";
import type { AuctionResponse } from "../../types/auction-types";
import { auctionTableColumns } from "./auction-columns";

interface AuctionDataTableProps {
    data: AuctionResponse[];
    pageCount: number;
}

export function AuctionDataTable({ data, pageCount }: AuctionDataTableProps) {
    const deleteAuction = useDeleteAuction();
    const [isDeleting, setIsDeleting] = useState<boolean>(false);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);

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

    const selectedRows = table.getSelectedRowModel().rows;
    const selectedIds = selectedRows.map((row) => row.original.id);

    const openDeleteDialog = () => {
        if (selectedIds.length > 0) {
            setIsConfirmOpen(true);
        }
    };

    const handleBulkDelete = async () => {
        if (!selectedIds.length || isDeleting) return;

        setIsDeleting(true);

        try {
            const results = await Promise.allSettled(
                selectedIds.map((id) => deleteAuction.mutateAsync(id))
            );

            const failed = results.filter(
                (result) => result.status === "rejected"
            ).length;

            if (failed === 0) {
                setIsConfirmOpen(false);
                table.resetRowSelection();
            } else {
                console.error(`${failed} auction(s) failed to delete.`);
            }
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="data-table-container">
            <DataTable table={table}>
                <DataTableToolbar
                    table={table}
                    globalFilterPlaceholder="Search auctions..."
                    selectedCount={selectedIds.length}
                    onDeleteSelected={openDeleteDialog}
                    isDeleting={isDeleting}
                />
            </DataTable>

            <ConfirmDialog
                open={isConfirmOpen}
                onOpenChange={setIsConfirmOpen}
                title="Delete selected auctions?"
                description={`Are you sure you want to delete ${selectedIds.length} selected auctions? This action cannot be undone.`}
                confirmText="Delete"
                onConfirm={handleBulkDelete}
                isPending={isDeleting}
            />
        </div>
    );
}
