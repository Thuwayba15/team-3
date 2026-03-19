import axios, { AxiosInstance } from "axios";
import { DEFAULT_TENANT_ID, TENANT_HEADER } from "@/constants/api";

/**
 * Centralised Axios instance shared across all feature services.
 */
const apiClient: AxiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
        [TENANT_HEADER]: DEFAULT_TENANT_ID,
    },
});

apiClient.interceptors.request.use((config) => {
    config.headers[TENANT_HEADER] = DEFAULT_TENANT_ID;
    return config;
});

export { apiClient };
