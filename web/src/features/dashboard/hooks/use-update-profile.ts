import { useMutation, useQueryClient } from "@tanstack/react-query";

import api from "@/api/axios";
import { ENDPOINTS } from "@/api/endpoints";
import { toast } from "@/components/ui/toast";
import { currentUserQueryKey } from "@/features/auth/hooks/use-current-user";
import type { ApiSuccessResponse, User } from "@/lib/api.types";
import { uploadImage } from "@/lib/cloudinary";
import type { UpdateProfileRequest } from "../types/user-types";

export interface UpdateProfileVariables {
    firstName: string;
    lastName: string;
    image: File | null;
}

export function useUpdateProfile() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            firstName,
            lastName,
            image,
        }: UpdateProfileVariables): Promise<User> => {
            let imageUrl: string | undefined;

            if (image) {
                const uploadedImage = await uploadImage(image);
                imageUrl = uploadedImage.url;
            }

            const request: UpdateProfileRequest = {
                firstName,
                lastName,
                ...(imageUrl !== undefined && { image: imageUrl }),
            };

            const { data } = await api.patch<ApiSuccessResponse<User>>(
                ENDPOINTS.user.me,
                request
            );

            return data.data;
        },

        onSuccess: (updatedUser) => {
            queryClient.setQueryData(currentUserQueryKey, updatedUser);

            queryClient.invalidateQueries({
                queryKey: currentUserQueryKey,
            });

            toast.success("Profile updated successfully.");
        },

        onError: (error: Error) => {
            toast.error(error.message || "Failed to update profile.");
        },
    });
}
