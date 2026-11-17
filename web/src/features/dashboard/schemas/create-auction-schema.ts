import { z } from "zod";

export const auctionItemConditionSchema = z.enum([
    "NEW",
    "LIKE_NEW",
    "USED_GOOD",
    "USED_FAIR",
    "FOR_PARTS",
]);

const specificationSchema = z.object({
    key: z.string(),
    value: z.string(),
});

const auctionImageSchema = z
    .instanceof(File)
    .refine(
        (file) => file.size <= 5 * 1024 * 1024,
        "Image size cannot exceed 5MB"
    )
    .refine(
        (file) => ["image/png", "image/jpeg"].includes(file.type),
        "Only PNG and JPG images are allowed"
    );

export const createAuctionSchema = z
    .object({
        title: z
            .string()
            .trim()
            .min(1, "Title is required")
            .max(150, "Title cannot exceed 150 characters"),

        description: z
            .string()
            .trim()
            .min(1, "Description is required")
            .max(5000, "Description cannot exceed 5000 characters"),

        itemCondition: auctionItemConditionSchema,

        brand: z.string().max(100, "Brand cannot exceed 100 characters"),

        model: z.string().max(100, "Model cannot exceed 100 characters"),

        specifications: z.array(specificationSchema),

        location: z.string().max(255, "Location cannot exceed 255 characters"),

        startingPrice: z
            .number()
            .positive("Starting price must be greater than zero"),

        minimumBidIncrement: z
            .number()
            .positive("Minimum bid increment must be greater than zero"),

        startTime: z.string().min(1, "Start time is required"),

        endTime: z.string().min(1, "End time is required"),

        categoryIds: z
            .array(z.uuid("Invalid category ID"))
            .min(1, "Select at least one category"),

        images: z
            .array(auctionImageSchema)
            .max(5, "You can upload a maximum of 5 images"),

        primaryImageIndex: z.number().int().nullable(),
    })
    .superRefine((values, ctx) => {
        const start = new Date(values.startTime).getTime();
        const end = new Date(values.endTime).getTime();

        if (
            values.startTime &&
            values.endTime &&
            !Number.isNaN(start) &&
            !Number.isNaN(end) &&
            end <= start
        ) {
            ctx.addIssue({
                code: "custom",
                path: ["endTime"],
                message: "End time must be after start time",
            });
        }

        if (values.images.length === 0) {
            if (values.primaryImageIndex !== null) {
                ctx.addIssue({
                    code: "custom",
                    path: ["primaryImageIndex"],
                    message: "No primary image can be selected without images",
                });
            }
        } else if (
            values.primaryImageIndex === null ||
            values.primaryImageIndex < 0 ||
            values.primaryImageIndex >= values.images.length
        ) {
            ctx.addIssue({
                code: "custom",
                path: ["primaryImageIndex"],
                message: "Select a primary image",
            });
        }

        const keys = new Set<string>();

        values.specifications.forEach((specification, index) => {
            const key = specification.key.trim();
            const value = specification.value.trim();

            if (!key && !value) return;

            if (!key) {
                ctx.addIssue({
                    code: "custom",
                    path: ["specifications", index, "key"],
                    message: "Specification name is required",
                });
            }

            if (!value) {
                ctx.addIssue({
                    code: "custom",
                    path: ["specifications", index, "value"],
                    message: "Specification value is required",
                });
            }

            if (key && keys.has(key.toLowerCase())) {
                ctx.addIssue({
                    code: "custom",
                    path: ["specifications", index, "key"],
                    message: "Specification names must be unique",
                });
            }

            if (key) {
                keys.add(key.toLowerCase());
            }
        });
    });

export type CreateAuctionFormValues = z.infer<typeof createAuctionSchema>;
