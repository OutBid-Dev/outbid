import { useFormContext } from "react-hook-form";

import {
    Field,
    FieldDescription,
    FieldError,
    FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

import type { CreateAuctionFormValues } from "../../schemas/create-auction-schema";

export function AuctionTimingForm() {
    const {
        register,
        formState: { errors },
    } = useFormContext<CreateAuctionFormValues>();

    return (
        <section className="rounded-xl border bg-card p-5">
            <div className="mb-5">
                <h3 className="text-base font-semibold">Auction Schedule</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                    Set when your auction starts and ends.
                </p>
            </div>

            <div className="space-y-4">
                <Field data-invalid={!!errors.startTime}>
                    <FieldLabel htmlFor="startTime">
                        Start Date & Time
                    </FieldLabel>
                    <Input
                        id="startTime"
                        type="datetime-local"
                        {...register("startTime")}
                        aria-invalid={!!errors.startTime}
                    />
                    <FieldDescription>
                        When bidding becomes available.
                    </FieldDescription>
                    {errors.startTime && (
                        <FieldError errors={[errors.startTime]} />
                    )}
                </Field>

                <Field data-invalid={!!errors.endTime}>
                    <FieldLabel htmlFor="endTime">End Date & Time</FieldLabel>
                    <Input
                        id="endTime"
                        type="datetime-local"
                        {...register("endTime")}
                        aria-invalid={!!errors.endTime}
                    />
                    <FieldDescription>
                        When the auction closes.
                    </FieldDescription>
                    {errors.endTime && <FieldError errors={[errors.endTime]} />}
                </Field>
            </div>
        </section>
    );
}
