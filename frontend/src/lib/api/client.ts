import axios, { AxiosInstance } from "axios";
import { DEFAULT_TENANT_ID, TENANT_HEADER } from "@/constants/api";
import { authStorage } from "@/lib/auth/authStorage";

/**
 * Centralised Axios instance shared across all feature services.
 * - The ABP multi-tenancy header is set once here; replace DEFAULT_TENANT_ID
 *   with dynamic tenant resolution if multi-tenancy selection is added.
 */
const apiClient: AxiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
        [TENANT_HEADER]: DEFAULT_TENANT_ID,
    },
});

apiClient.interceptors.request.use((config) => {
    config.headers[TENANT_HEADER] = DEFAULT_TENANT_ID;

    const token = authStorage.getAccessToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

export { apiClient };
