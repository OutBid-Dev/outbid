import { Eye, Trash2 } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useDeleteAuction } from "../../hooks/use-auctions";
import type { AuctionResponse } from "../../types/auction-types";

export function AuctionRowActions({ auction }: { auction: AuctionResponse }) {
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const deleteAuction = useDeleteAuction();

    const handleDelete = () => {
        deleteAuction.mutate(auction.id, {
            onSuccess: () => setIsConfirmOpen(false),
        });
    };

    return (
        <div className="flex items-center gap-1">
            <Button
                variant="ghost"
                size="icon"
                aria-label={`View ${auction.title}`}
            >
                <Link to={`/dashboard/auctions/${auction.id}`}>
                    <Eye className="size-4" />
                </Link>
            </Button>

            <Button
                variant="ghost"
                size="icon"
                className="text-destructive hover:text-destructive"
                onClick={() => setIsConfirmOpen(true)}
                disabled={deleteAuction.isPending}
                aria-label={`Delete ${auction.title}`}
            >
                <Trash2 className="size-4" />
            </Button>

            <ConfirmDialog
                open={isConfirmOpen}
                onOpenChange={setIsConfirmOpen}
                title="Delete auction?"
                description={
                    <p>
                        Are you sure you want to delete{" "}
                        <span className="font-semibold text-primary-foreground">
                            {auction.title}
                        </span>
                        ? This action cannot be undone.
                    </p>
                }
                confirmText="Delete"
                onConfirm={handleDelete}
                isPending={deleteAuction.isPending}
            />
        </div>
    );
}
