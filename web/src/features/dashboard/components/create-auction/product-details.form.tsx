import { Controller, useFormContext } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import type { CreateAuctionFormValues } from "../../schemas/create-auction-schema";
import type { ItemCondition } from "../../types/auction-types";

const itemConditions: { value: ItemCondition; label: string }[] = [
    { value: "NEW", label: "New" },
    { value: "LIKE_NEW", label: "Like New" },
    { value: "USED_GOOD", label: "Used - Good" },
    { value: "USED_FAIR", label: "Used - Fair" },
    { value: "FOR_PARTS", label: "For Parts / Repair" },
];

export default function ProductDetailsForm() {
    const {
        register,
        control,
        formState: { errors },
    } = useFormContext<CreateAuctionFormValues>();

    return (
        <Card>
            <CardHeader>
                <CardTitle>Product Details</CardTitle>
            </CardHeader>
            <Separator />
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input id="title" {...register("title")} />
                    {errors.title && (
                        <p className="text-sm text-destructive">
                            {errors.title.message}
                        </p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" {...register("description")} />
                    {errors.description && (
                        <p className="text-sm text-destructive">
                            {errors.description.message}
                        </p>
                    )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="brand">Brand</Label>
                        <Input id="brand" {...register("brand")} />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="model">Model</Label>
                        <Input id="model" {...register("model")} />
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        <Input
                            id="location"
                            placeholder="e.g. Kolkata, West Bengal"
                            {...register("location")}
                        />
                        {errors.location && (
                            <p className="text-sm text-destructive">
                                {errors.location.message}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="itemCondition">Condition</Label>

                        <Controller
                            name="itemCondition"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    items={itemConditions}
                                    value={field.value}
                                    onValueChange={field.onChange}
                                >
                                    <SelectTrigger
                                        id="itemCondition"
                                        className="w-full"
                                    >
                                        <SelectValue placeholder="Select condition" />
                                    </SelectTrigger>

                                    <SelectContent>
                                        <SelectGroup>
                                            {itemConditions.map((item) => (
                                                <SelectItem
                                                    key={item.value}
                                                    value={item.value}
                                                >
                                                    {item.label}
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            )}
                        />

                        {errors.itemCondition && (
                            <p className="text-sm text-destructive">
                                {errors.itemCondition.message}
                            </p>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
