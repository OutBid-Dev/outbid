import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { toast } from "@/components/ui/toast";
import { type ParsedError, parseApiError } from "@/utils/error-handler";
import { logoutService } from "../services/auth-service";
import { currentUserQueryKey } from "./use-current-user";

export function useLogout() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { mutate, isPending, isError, error, reset } = useMutation<
        void,
        ParsedError
    >({
        mutationFn: async () => {
            try {
                await logoutService();
            } catch (rawError) {
                throw parseApiError(rawError);
            }
        },
        onSuccess: async () => {
            await queryClient.cancelQueries({ queryKey: currentUserQueryKey });

            navigate("/auth/login", { replace: true });

            queryClient.removeQueries({
                queryKey: currentUserQueryKey,
                exact: true,
            });

            toast.success("Logout successful!");
        },
        onError: (error) => {
            toast.error(
                error.message || "Unable to log out. Please try again."
            );
            console.error("[useLogout]", error.message);
        },
    });

    return {
        logout: mutate,
        isPending,
        isError,
        error,
        reset,
    };
}
