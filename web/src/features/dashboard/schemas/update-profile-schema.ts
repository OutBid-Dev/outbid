import { z } from "zod";

export const updateProfileSchema = z.object({
    firstName: z
        .string()
        .trim()
        .min(1, "First name is required.")
        .max(50, "First name cannot exceed 50 characters."),
    lastName: z
        .string()
        .trim()
        .min(1, "Last name is required.")
        .max(50, "Last name cannot exceed 50 characters."),
    image: z.instanceof(File).nullable(),
});

export type UpdateProfileFormValues = z.infer<typeof updateProfileSchema>;
