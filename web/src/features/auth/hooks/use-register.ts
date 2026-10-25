import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { toast } from "@/components/ui/toast";
import type { User } from "@/lib/api.types";
import { type ParsedError, parseApiError } from "@/utils/error-handler";
import { registerService } from "../services/auth-service";
import type { RegisterPayload } from "../types/auth-types";
import { currentUserQueryKey } from "./use-current-user";

export function useRegister() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { mutate, isPending, isError, error, reset } = useMutation<
        void,
        ParsedError,
        RegisterPayload
    >({
        mutationFn: async (payload: RegisterPayload) => {
            try {
                const result = await registerService(payload);

                queryClient.setQueryData<User | null>(
                    currentUserQueryKey,
                    result.data
                );
                toast.success(result.response || "Registered successfully!");
            } catch (rawError) {
                throw parseApiError(rawError);
            }
        },
        onSuccess: async () => {
            navigate("/dashboard", { replace: true });
        },
        onError: (error) => {
            toast.error(
                error.message || "Unable to register. Please try again."
            );
            console.error("[useRegister]", error.message);
        },
    });

    return {
        register: mutate,
        isPending,
        isError,
        error,
        reset,
    };
}
