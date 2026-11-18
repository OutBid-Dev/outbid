import { zodResolver } from "@hookform/resolvers/zod/dist/zod.js";
import { FormProvider, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { AuctionCategoriesForm } from "../components/create-auction/auction-categories.form";
import { AuctionImagesForm } from "../components/create-auction/auction-images.form";
import AuctionSpecificationForm from "../components/create-auction/auction-specifications.form";
import { AuctionTimingForm } from "../components/create-auction/auction-timing.form";
import { PricingForm } from "../components/create-auction/pricing.form";
import ProductDetailsForm from "../components/create-auction/product-details.form";
import { useCreateAuction } from "../hooks/use-create-auction";
import {
    type CreateAuctionFormValues,
    createAuctionSchema,
} from "../schemas/create-auction-schema";
import type { CreateAuctionRequest } from "../types/create-auction-types";

const defaultValues: CreateAuctionFormValues = {
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
};

export default function CreateAuction() {
    const form = useForm<CreateAuctionFormValues>({
        resolver: zodResolver(createAuctionSchema),
        defaultValues: defaultValues,
    });

    const { createAuctionAsync, isPending } = useCreateAuction();

    const onSubmit = async (values: CreateAuctionFormValues) => {
        try {
            const specifications = Object.fromEntries(
                values.specifications
                    .filter(({ key, value }) => key.trim() && value.trim())
                    .map(({ key, value }) => [key.trim(), value.trim()])
            );

            const request: CreateAuctionRequest = {
                title: values.title,
                description: values.description,
                itemCondition: values.itemCondition,
                brand: values.brand.trim() || null,
                model: values.model.trim() || null,
                specifications:
                    Object.keys(specifications).length > 0
                        ? specifications
                        : null,
                location: values.location.trim() || null,
                startingPrice: values.startingPrice,
                minimumBidIncrement: values.minimumBidIncrement,
                startTime: new Date(values.startTime).toISOString(),
                endTime: new Date(values.endTime).toISOString(),
                categoryIds: values.categoryIds,
            };

            await createAuctionAsync({
                request,
                images: values.images,
                primaryImageIndex: values.primaryImageIndex,
            });

            form.reset(defaultValues);
        } catch (error) {
            console.error("Auction submission failed:", error);
        }
    };

    const onInvalid = (errors: typeof form.formState.errors) => {
        console.error("Auction form validation failed:", errors);
    };

    const handleReset = () => {
        form.reset(defaultValues);
    };

    return (
        <div className="@container/main p-6 xl:group-data-[theme-content-layout=centered]/layout:mx-auto xl:group-data-[theme-content-layout=centered]/layout:w-full xl:group-data-[theme-content-layout=centered]/layout:max-w-7xl">
            <div className="mx-auto max-w-5xl space-y-4 lg:space-y-6">
                <FormProvider {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit, onInvalid)}
                        noValidate
                    >
                        <div className="flex flex-row items-center justify-between">
                            <div className="space-y-2">
                                <h1 className="text-2xl font-semibold">
                                    Create Auction
                                </h1>
                                <p className="mt-2 text-sm text-gray-500">
                                    Fill out the form below to create a new
                                    auction.
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="xl"
                                    type="button"
                                    onClick={handleReset}
                                    disabled={isPending}
                                >
                                    Reset
                                </Button>

                                <Button
                                    size="xl"
                                    type="submit"
                                    disabled={isPending}
                                >
                                    {isPending
                                        ? "Creating Auction..."
                                        : "Create Auction"}
                                </Button>
                            </div>
                        </div>
                        <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-6">
                            <div className="space-y-4 lg:col-span-4">
                                <ProductDetailsForm />
                                <AuctionImagesForm />
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
