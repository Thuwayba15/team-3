import { apiClient } from "@/lib/api/client";
import { getCachedResource } from "@/lib/api/requestCache";
import { SESSION_LOGIN_INFO_ENDPOINT } from "@/constants/api";

interface IAbpResponseEnvelope<T> {
    result: T;
}

export interface ISessionUserLoginInfo {
    id: number;
    name: string;
    surname: string;
    userName: string;
    emailAddress: string;
}

interface ICurrentLoginInformationsResponse {
    user: ISessionUserLoginInfo | null;
}

/** Fetches the current login information for the authenticated session. */
async function getCurrentLoginInformations(): Promise<ICurrentLoginInformationsResponse> {
    return getCachedResource("session:current-login", async () => {
        const response = await apiClient.get<IAbpResponseEnvelope<ICurrentLoginInformationsResponse>>(SESSION_LOGIN_INFO_ENDPOINT);
        return response.data.result;
    }, 30000);
}

export const sessionService = {
    getCurrentLoginInformations,
};
