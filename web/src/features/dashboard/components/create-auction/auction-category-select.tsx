import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import type { AuctionCategory } from "../../types/auction-types";

interface CategorySelectProps {
    value: string;
    categories: AuctionCategory[];
    excludedCategoryIds?: string[];
    onValueChange: (value: string) => void;
    disabled?: boolean;
}

export function CategorySelect({
    value,
    categories,
    excludedCategoryIds = [],
    onValueChange,
    disabled = false,
}: CategorySelectProps) {
    return (
        <Select
            value={value}
            onValueChange={(nextValue) => {
                if (nextValue !== null) {
                    onValueChange(nextValue);
                }
            }}
            disabled={disabled}
        >
            <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a category">
                    {categories.find((category) => category.id === value)?.name}
                </SelectValue>
            </SelectTrigger>

            <SelectContent>
                {categories.map((category) => (
                    <SelectItem
                        key={category.id}
                        value={category.id}
                        disabled={excludedCategoryIds.includes(category.id)}
                    >
                        {category.name}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}
