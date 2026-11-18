import { Plus, Trash2 } from "lucide-react";
import {
    type Control,
    useController,
    useFieldArray,
    useFormContext,
} from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import type { CreateAuctionFormValues } from "../../schemas/create-auction-schema";

export default function AuctionSpecificationForm() {
    const { control } = useFormContext<CreateAuctionFormValues>();

    const { fields, append, remove } = useFieldArray({
        control,
        name: "specifications",
    });

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Specifications</CardTitle>
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="rounded-full"
                    onClick={() => append({ key: "", value: "" })}
                >
                    <Plus className="size-3" />
                    Add Specification
                </Button>
            </CardHeader>
            <Separator />
            <CardContent>
                <div className="mb-2 grid grid-cols-[1fr_1.5fr_36px] gap-3 px-1">
                    <span className="text-sm font-medium text-muted-foreground">
                        Property
                    </span>
                    <span className="text-sm font-medium text-muted-foreground">
                        Value
                    </span>
                    <span />
                </div>
                <div className="space-y-3">
                    {fields.map((field, index) => (
                        <div
                            key={field.id}
                            className="grid grid-cols-[1fr_1.5fr_36px] items-start gap-3"
                        >
                            <SpecificationInput
                                control={control}
                                name={`specifications.${index}.key`}
                                placeholder="e.g. Material"
                            />

                            <SpecificationInput
                                control={control}
                                name={`specifications.${index}.value`}
                                placeholder="e.g. Aluminum"
                            />

                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="text-muted-foreground hover:text-destructive"
                                onClick={() => remove(index)}
                                aria-label={`Remove specification ${index + 1}`}
                            >
                                <Trash2 className="size-4" />
                            </Button>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}

interface SpecificationInputProps {
    control: Control<CreateAuctionFormValues>;
    name: `specifications.${number}.key` | `specifications.${number}.value`;
    placeholder: string;
}

function SpecificationInput({
    control,
    name,
    placeholder,
}: SpecificationInputProps) {
    const { field, fieldState } = useController({
        control,
        name,
    });

    return (
        <Field data-invalid={fieldState.invalid}>
            <Input
                {...field}
                value={field.value ?? ""}
                placeholder={placeholder}
                autoComplete="off"
                aria-invalid={fieldState.invalid}
            />

            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
    );
}
