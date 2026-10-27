import Logo from "@/components/ui/logo";

export default function SidebarHead() {
    return (
        <div className="m-2 flex items-center gap-2 rounded-lg bg-secondary p-2 font-heading text-xl font-semibold text-primary-foreground">
            <Logo size="lg" shape="square" />
            <h4>OutBid</h4>
        </div>
    );
}
