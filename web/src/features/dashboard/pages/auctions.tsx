import { Plus } from "lucide-react";
import { Suspense } from "react";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { AuctionTableSection } from "../components/auction-table/auction-table-section";
import { AuctionTableSkeleton } from "../components/auction-table/auction-table-skeleton";

export default function AuctionsPage() {
    return (
        <div className="flex w-full flex-col gap-6 px-4 py-6 lg:px-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold">My Auctions</h1>
                    <p className="text-sm text-muted-foreground">
                        Manage your auctions and track their performance.
                    </p>
                </div>
                <Button size="lg">
                    <Link
                        to="/dashboard/auctions/create"
                        className="flex items-center gap-2"
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        <span>Create Auction</span>
                    </Link>
                </Button>
            </div>

            <Suspense fallback={<AuctionTableSkeleton />}>
                <AuctionTableSection />
            </Suspense>
        </div>
    );
}
