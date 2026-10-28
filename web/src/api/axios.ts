import type {
    AxiosInstance,
    AxiosResponse,
    InternalAxiosRequestConfig,
} from "axios";
import axios from "axios";
import { ENDPOINTS } from "./endpoints";

const api: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL as string,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

type RetryableRequestConfig = InternalAxiosRequestConfig & {
    _retry?: boolean;
};

type QueuedRequest = {
    resolve: () => void;
    reject: (error: unknown) => void;
};

let isRefreshing = false;
let failedQueue: QueuedRequest[] = [];

const processQueue = (error?: unknown): void => {
    failedQueue.forEach(({ resolve, reject }) => {
        if (error) {
            reject(error);
        } else {
            resolve();
        }
    });

    failedQueue = [];
};

const matchesEndpoint = (url: string, endpoint: string): boolean => {
    return url.includes(endpoint);
};

api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        return config;
    },
    (error: Error) => Promise.reject(error)
);

api.interceptors.response.use(
    (res: AxiosResponse) => res,
    async (err: unknown) => {
        if (!axios.isAxiosError(err) || !err.config) {
            return Promise.reject(err);
        }

        const originalRequest = err.config as RetryableRequestConfig;
        const requestUrl = originalRequest.url ?? "";
        const status = err.response?.status;

        const isRefreshRequest = matchesEndpoint(
            requestUrl,
            ENDPOINTS.auth.refreshToken
        );

        const isLogoutRequest = matchesEndpoint(
            requestUrl,
            ENDPOINTS.auth.logout
        );

        if (isRefreshRequest || isLogoutRequest) {
            return Promise.reject(err);
        }

        if (status !== 401) {
            return Promise.reject(err);
        }

        if (originalRequest._retry) {
            return Promise.reject(err);
        }

        if (isRefreshing) {
            return new Promise<void>((resolve, reject) => {
                failedQueue.push({
                    resolve,
                    reject,
                });
            }).then(() => {
                originalRequest._retry = true;
                return api(originalRequest);
            });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
            await api.post(ENDPOINTS.auth.refreshToken);
            processQueue();
            return api(originalRequest);
        } catch (refreshError) {
            processQueue(refreshError);
            window.dispatchEvent(new Event("auth:logout"));
            return Promise.reject(refreshError);
        } finally {
            isRefreshing = false;
        }
    }
);

export default api;
