import { z } from "zod";

export const createAuctionSchema = z.object({
    title: z.string().min(1, "Title is required").max(150),
    description: z.string().min(1, "Description is required").max(5000),
    itemCondition: z.enum(["NEW", "LIKE_NEW", "GOOD", "FAIR", "POOR"]),
    brand: z.string().max(100).optional(),
    model: z.string().max(100).optional(),
    location: z.string().max(255).optional(),
    startingPrice: z.coerce
        .number()
        .min(0.01, "Starting price must be at least 0.01"),
    minimumBidIncrement: z.coerce
        .number()
        .min(0.01, "Bid increment must be at least 0.01"),
    startTime: z.string().min(1, "Start time is required"),
    endTime: z.string().min(1, "End time is required"),
    categoryIds: z
        .array(z.string().uuid())
        .min(1, "Select at least one category"),
});

export type CreateAuctionFormValues = z.infer<typeof createAuctionSchema>;
