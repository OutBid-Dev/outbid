import { MutationCache, QueryCache, QueryClient } from "@tanstack/react-query";
import { parseApiError } from "@/utils/error-handler";

const queryClient = new QueryClient({
    queryCache: new QueryCache({
        onError: (error) => {
            const parsed = parseApiError(error);
            console.error("[Query Error]", parsed);
        },
    }),

    mutationCache: new MutationCache({
        onError: (error) => {
            const parsed = parseApiError(error);
            console.error("[Mutation Error]", parsed);
        },
    }),

    defaultOptions: {
        queries: {
            retry: (failureCount, error) => {
                const { statusCode } = parseApiError(error);

                if (
                    statusCode !== null &&
                    statusCode >= 400 &&
                    statusCode < 500
                ) {
                    return false;
                }

                return failureCount < 2;
            },
            staleTime: 1000 * 60 * 5,
            refetchOnWindowFocus: false,
        },

        mutations: {
            retry: false,
        },
    },
});

export default queryClient;
