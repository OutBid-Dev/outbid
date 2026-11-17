import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { useParams } from "react-router";
import { z } from "zod";

import { Button } from "@/components/ui/button";

import { AuctionCategoriesForm } from "../components/create-auction/auction-categories.form";
import { AuctionImagesForm } from "../components/create-auction/auction-images.form";
import AuctionSpecificationForm from "../components/create-auction/auction-specifications.form";
import { AuctionTimingForm } from "../components/create-auction/auction-timing.form";
import { PricingForm } from "../components/create-auction/pricing.form";
import ProductDetailsForm from "../components/create-auction/product-details.form";

import { useAuction } from "../hooks/use-auctions";
import { useUpdateAuction } from "../hooks/use-update-auction";

import { createAuctionSchema } from "../schemas/create-auction-schema";

import type { AuctionImage, AuctionResponse } from "../types/auction-types";
import type { UpdateAuctionRequest } from "../types/update-auction-types";

const editAuctionSchema = createAuctionSchema.safeExtend({
    images: z.array(z.instanceof(File)),
    removedImageIds: z.array(z.string()),
    primaryExistingImageId: z.string().nullable(),
});

type EditAuctionFormValues = z.infer<typeof editAuctionSchema>;

function toDateTimeLocal(value: string): string {
    const date = new Date(value);
    const offset = date.getTimezoneOffset() * 60_000;

    return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}

function getFormValues(auction: AuctionResponse): EditAuctionFormValues {
    return {
        title: auction.title,
        description: auction.description ?? "",
        itemCondition: auction.itemCondition ?? "NEW",
        brand: auction.brand ?? "",
        model: auction.model ?? "",
        specifications: Object.entries(auction.specifications ?? {}).map(
            ([key, value]) => ({
                key,
                value: String(value),
            })
        ),
        location: auction.location ?? "",
        startingPrice: auction.startingPrice,
        minimumBidIncrement: auction.minimumBidIncrement,
        startTime: toDateTimeLocal(auction.startTime),
        endTime: toDateTimeLocal(auction.endTime),
        categoryIds: auction.categoryIds,
        images: [],
        primaryImageIndex: null,
        removedImageIds: [],
        primaryExistingImageId:
            auction.images.find((image) => image.primary)?.id ?? null,
    };
}

export default function EditAuction() {
    const { auctionId = "" } = useParams<{ auctionId: string }>();

    const { data: auction, isLoading, isError, error } = useAuction(auctionId);

    const { mutate: updateAuction, isPending } = useUpdateAuction();

    const form = useForm<EditAuctionFormValues>({
        resolver: zodResolver(editAuctionSchema),
        defaultValues: {
            title: "",
            description: "",
            itemCondition: "NEW",
            brand: "",
            model: "",
            specifications: [],
            location: "",
            startingPrice: 0,
            minimumBidIncrement: 0,
            startTime: "",
            endTime: "",
            categoryIds: [],
            images: [],
            primaryImageIndex: null,
            removedImageIds: [],
            primaryExistingImageId: null,
        },
    });

    const { reset, setError, handleSubmit, getValues, setValue } = form;

    useEffect(() => {
        if (!auction) return;

        reset(getFormValues(auction));
    }, [auction, reset]);

    const removedImageIds = useWatch({
        control: form.control,
        name: "removedImageIds",
    });

    const primaryExistingImageId = useWatch({
        control: form.control,
        name: "primaryExistingImageId",
    });

    const visibleImages: AuctionImage[] =
        auction?.images.filter(
            (image) => !removedImageIds.includes(image.id)
        ) ?? [];

    const handleRemoveImage = (imageId: string) => {
        const current = getValues("removedImageIds");

        if (!current.includes(imageId)) {
            setValue("removedImageIds", [...current, imageId], {
                shouldDirty: true,
            });
        }

        if (getValues("primaryExistingImageId") === imageId) {
            setValue("primaryExistingImageId", null, {
                shouldDirty: true,
            });
        }
    };

    const handleExistingPrimaryChange = (imageId: string) => {
        setValue("primaryExistingImageId", imageId, {
            shouldDirty: true,
            shouldValidate: true,
        });

        setValue("primaryImageIndex", null, {
            shouldDirty: true,
        });
    };

    const handleReset = () => {
        if (!auction) return;

        reset(getFormValues(auction));
    };

    const onSubmit = (values: EditAuctionFormValues) => {
        if (!auction) return;

        const remainingImageCount = visibleImages.length + values.images.length;

        if (remainingImageCount < 1) {
            setError("images", {
                type: "manual",
                message: "At least one auction image is required.",
            });

            return;
        }

        if (
            values.primaryExistingImageId &&
            values.removedImageIds.includes(values.primaryExistingImageId)
        ) {
            setError("images", {
                type: "manual",
                message: "The primary image cannot be removed.",
            });

            return;
        }

        const request: UpdateAuctionRequest = {
            title: values.title,
            description: values.description,
            itemCondition: values.itemCondition,
            brand: values.brand.trim(),
            model: values.model.trim(),
            location: values.location.trim(),
            startingPrice: values.startingPrice,
            minimumBidIncrement: values.minimumBidIncrement,
            startTime: new Date(values.startTime).toISOString(),
            endTime: new Date(values.endTime).toISOString(),
        };

        updateAuction({
            auctionId: auction.id,
            request,
            existingImages: auction.images,
            newImages: values.images,
            removedImageIds: values.removedImageIds,
            primaryExistingImageId: values.primaryExistingImageId,
            primaryImageIndex: values.primaryImageIndex,
            originalCategoryIds: auction.categoryIds,
            categoryIds: values.categoryIds,
            originalSpecifications: auction.specifications,
            specifications: values.specifications,
        });
    };

    if (isLoading) {
        return (
            <div className="p-6 text-sm text-muted-foreground">
                Loading auction...
            </div>
        );
    }

    if (isError || !auction) {
        return (
            <div className="p-6 text-sm text-destructive">
                {error?.message || "Failed to load auction."}
            </div>
        );
    }

    return (
        <div className="@container/main p-6 xl:group-data-[theme-content-layout=centered]/layout:mx-auto xl:group-data-[theme-content-layout=centered]/layout:w-full xl:group-data-[theme-content-layout=centered]/layout:max-w-7xl">
            <div className="mx-auto max-w-5xl space-y-4 lg:space-y-6">
                <FormProvider {...form}>
                    <form onSubmit={handleSubmit(onSubmit)} noValidate>
                        <div className="flex flex-row items-center justify-between">
                            <div className="space-y-2">
                                <h1 className="text-2xl font-semibold">
                                    Edit Auction
                                </h1>

                                <p className="text-sm text-muted-foreground">
                                    Update your auction listing.
                                </p>
                            </div>

                            <div className="flex items-center gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="xl"
                                    onClick={handleReset}
                                    disabled={isPending}
                                >
                                    Reset
                                </Button>

                                <Button
                                    type="submit"
                                    size="xl"
                                    disabled={isPending}
                                >
                                    {isPending
                                        ? "Saving Changes..."
                                        : "Save Changes"}
                                </Button>
                            </div>
                        </div>

                        <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-6">
                            <div className="space-y-4 lg:col-span-4">
                                <ProductDetailsForm />

                                <div className="rounded-xl border p-4">
                                    <div className="mb-4 space-y-1">
                                        <h2 className="font-semibold">
                                            Existing Images
                                        </h2>

                                        <p className="text-sm text-muted-foreground">
                                            Select a primary image or remove
                                            images you no longer need.
                                        </p>
                                    </div>

                                    {visibleImages.length > 0 ? (
                                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                                            {visibleImages.map((image) => (
                                                <div
                                                    key={image.id}
                                                    className="relative overflow-hidden rounded-lg border"
                                                >
                                                    <img
                                                        src={image.imageUrl}
                                                        alt={auction.title}
                                                        className="aspect-square w-full object-cover"
                                                    />

                                                    <label className="absolute bottom-2 left-2 flex cursor-pointer items-center gap-2 rounded-md bg-background/90 px-2 py-1 text-xs">
                                                        <input
                                                            type="radio"
                                                            name="existing-primary-image"
                                                            checked={
                                                                primaryExistingImageId ===
                                                                image.id
                                                            }
                                                            onChange={() =>
                                                                handleExistingPrimaryChange(
                                                                    image.id
                                                                )
                                                            }
                                                            disabled={isPending}
                                                        />
                                                        Primary
                                                    </label>

                                                    <Button
                                                        type="button"
                                                        variant="destructive"
                                                        size="sm"
                                                        className="absolute top-2 right-2"
                                                        onClick={() =>
                                                            handleRemoveImage(
                                                                image.id
                                                            )
                                                        }
                                                        disabled={isPending}
                                                    >
                                                        Remove
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-sm text-muted-foreground">
                                            No existing images remaining.
                                        </p>
                                    )}

                                    <p className="mt-3 text-xs text-muted-foreground">
                                        {visibleImages.length} existing image(s)
                                        remaining.
                                    </p>

                                    {form.formState.errors.images && (
                                        <p className="mt-2 text-sm text-destructive">
                                            {
                                                form.formState.errors.images
                                                    .message
                                            }
                                        </p>
                                    )}
                                </div>

                                <AuctionImagesForm
                                    onPrimaryChange={() => {
                                        setValue(
                                            "primaryExistingImageId",
                                            null,
                                            {
                                                shouldDirty: true,
                                            }
                                        );
                                    }}
                                />

                                <AuctionSpecificationForm />
                            </div>

                            <div className="space-y-4 lg:col-span-2">
                                <PricingForm />
                                <AuctionTimingForm />
                                <AuctionCategoriesForm />
                            </div>
                        </div>
                    </form>
                </FormProvider>
            </div>
        </div>
    );
}
