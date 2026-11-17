import { IndianRupee } from "lucide-react";
import type { Control } from "react-hook-form";
import { useController, useFormContext } from "react-hook-form";

import {
    Field,
    FieldDescription,
    FieldError,
    FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

import type { CreateAuctionFormValues } from "../../schemas/create-auction-schema";

export function PricingForm() {
    const { control } = useFormContext<CreateAuctionFormValues>();

    return (
        <section className="rounded-xl border bg-card p-5">
            <div className="mb-5">
                <h3 className="text-base font-semibold">Pricing</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                    Set the starting price and bidding increment.
                </p>
            </div>

            <div className="space-y-5">
                <PricingInput
                    control={control}
                    name="startingPrice"
                    label="Starting Price"
                    placeholder="e.g. 1000"
                    description="The initial price at which your auction will start."
                />

                <PricingInput
                    control={control}
                    name="minimumBidIncrement"
                    label="Minimum Bid Increment"
                    placeholder="e.g. 100"
                    description="The minimum amount a bidder must increase the current bid by."
                />
            </div>
        </section>
    );
}

interface PricingInputProps {
    control: Control<CreateAuctionFormValues>;
    name: "startingPrice" | "minimumBidIncrement";
    label: string;
    placeholder: string;
    description: string;
}

function PricingInput({
    control,
    name,
    label,
    placeholder,
    description,
}: PricingInputProps) {
    const { field, fieldState } = useController({
        control,
        name,
    });

    return (
        <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={name}>{label}</FieldLabel>

            <div className="relative">
                <IndianRupee className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />

                <Input
                    {...field}
                    id={name}
                    type="number"
                    min="0.01"
                    step="0.01"
                    placeholder={placeholder}
                    value={field.value ?? ""}
                    onChange={(event) => {
                        const value = event.target.value;
                        field.onChange(value === "" ? 0 : Number(value));
                    }}
                    className="pl-9"
                    aria-invalid={fieldState.invalid}
                />
            </div>

            <FieldDescription>{description}</FieldDescription>

            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
    );
}
