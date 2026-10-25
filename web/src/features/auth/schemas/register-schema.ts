import { z } from "zod";

export const passwordSchema = z
    .string()
    .min(12, "Password must be at least 12 characters long")
    .regex(/[a-z]/, "Must contain a lowercase letter")
    .regex(/[A-Z]/, "Must contain an uppercase letter")
    .regex(/[0-9]/, "Must contain a number")
    .regex(/[^A-Za-z0-9]/, "Must contain a special character");

export const registerSchema = z.object({
    firstName: z.string().trim().min(1, "First name is required"),
    lastName: z.string().trim().min(1, "Last name is required"),
    email: z.email("Invalid email address"),
    password: passwordSchema,
});

export type RegisterFormValues = z.infer<typeof registerSchema>;
