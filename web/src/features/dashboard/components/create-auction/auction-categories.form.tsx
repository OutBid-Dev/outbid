import { PlusCircle, RefreshCw, Trash2 } from "lucide-react";
import { useController, useFormContext } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { FieldError } from "@/components/ui/field";

import { useCategories } from "../../hooks/use-categories";
import type { CreateAuctionFormValues } from "../../schemas/create-auction-schema";

import { CategorySelect } from "./auction-category-select";

export function AuctionCategoriesForm() {
    const { control } = useFormContext<CreateAuctionFormValues>();

    const { field, fieldState } = useController({
        control,
        name: "categoryIds",
    });

    const {
        data: categories = [],
        isPending,
        isError,
        refetch,
    } = useCategories();

    const selectedCategoryIds = field.value ?? [];

    const handleAdd = () => {
        field.onChange([...selectedCategoryIds, ""]);
    };

    const handleRemove = (index: number) => {
        field.onChange(
            selectedCategoryIds.filter(
                (_, currentIndex) => currentIndex !== index
            )
        );
    };

    const handleCategoryChange = (index: number, categoryId: string) => {
        const nextCategoryIds = [...selectedCategoryIds];
        nextCategoryIds[index] = categoryId;
        field.onChange(nextCategoryIds);
    };

    const canAddCategory = selectedCategoryIds.length < categories.length;

    return (
        <section className="rounded-xl border bg-card p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                    <h3 className="text-base font-semibold">Categories</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Select categories for your product.
                    </p>
                </div>

                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAdd}
                    disabled={
                        isPending ||
                        isError ||
                        categories.length === 0 ||
                        !canAddCategory
                    }
                >
                    <PlusCircle className="mr-2 size-4" />
                    Add
                </Button>
            </div>

            {isPending && (
                <div className="flex items-center justify-center gap-2 py-4 text-sm text-muted-foreground">
                    <RefreshCw className="size-4 animate-spin" />
                    Loading categories...
                </div>
            )}

            {isError && (
                <div className="flex flex-col items-center gap-3 py-4 text-center">
                    <p className="text-sm text-muted-foreground">
                        Failed to load categories.
                    </p>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => refetch()}
                    >
                        <RefreshCw className="mr-2 size-4" />
                        Try again
                    </Button>
                </div>
            )}

            {!isPending && !isError && categories.length === 0 && (
                <p className="py-4 text-center text-sm text-muted-foreground">
                    No categories available.
                </p>
            )}

            {!isPending && !isError && selectedCategoryIds.length > 0 && (
                <div className="space-y-3">
                    {selectedCategoryIds.map((categoryId, index) => {
                        const excludedCategoryIds = selectedCategoryIds.filter(
                            (id, selectedIndex) =>
                                selectedIndex !== index && id !== ""
                        );

                        return (
                            <div
                                key={categoryId || index}
                                className="grid grid-cols-[1fr_36px] items-center gap-2"
                            >
                                <CategorySelect
                                    value={categoryId}
                                    categories={categories}
                                    excludedCategoryIds={excludedCategoryIds}
                                    onValueChange={(value) =>
                                        handleCategoryChange(index, value)
                                    }
                                />

                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="text-muted-foreground hover:text-destructive"
                                    onClick={() => handleRemove(index)}
                                    aria-label={`Remove category ${index + 1}`}
                                >
                                    <Trash2 className="size-4" />
                                </Button>
                            </div>
                        );
                    })}
                </div>
            )}

            {fieldState.invalid && (
                <div className="mt-2">
                    <FieldError errors={[fieldState.error]} />
                </div>
            )}
        </section>
    );
}
