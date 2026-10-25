import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { toast } from "@/components/ui/toast";
import type { User } from "@/lib/api.types";
import { type ParsedError, parseApiError } from "@/utils/error-handler";
import { loginService } from "../services/auth-service";
import type { LoginPayload } from "../types/auth-types";
import { currentUserQueryKey } from "./use-current-user";

export function useLogin() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { mutate, isPending, isError, error, reset } = useMutation<
        void,
        ParsedError,
        LoginPayload
    >({
        mutationFn: async (payload: LoginPayload) => {
            try {
                const result = await loginService(payload);

                queryClient.setQueryData<User | null>(
                    currentUserQueryKey,
                    result.data
                );
                toast.success(result.response || "Login successful!");
            } catch (rawError) {
                throw parseApiError(rawError);
            }
        },
        onSuccess: async () => {
            navigate("/dashboard", { replace: true });
        },
        onError: (error) => {
            toast.error(error.message || "Unable to log in. Please try again.");
            console.error("[useLogin]", error.message);
        },
    });

    return {
        login: mutate,
        isPending,
        isError,
        error,
        reset,
    };
}
