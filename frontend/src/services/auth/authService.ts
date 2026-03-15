import { apiClient } from "@/lib/api/client";
import { TOKEN_AUTH_ENDPOINT } from "@/constants/api";

interface IAbpResponseEnvelope<T> {
    result: T;
}

export interface ILoginRequest {
    userNameOrEmailAddress: string;
    password: string;
    rememberClient: boolean;
}

export interface ILoginResponse {
    accessToken: string;
    encryptedAccessToken: string;
    expireInSeconds: number;
    userId: number;
}

async function login(request: ILoginRequest): Promise<ILoginResponse> {
    const response = await apiClient.post<ILoginResponse | IAbpResponseEnvelope<ILoginResponse>>(
        TOKEN_AUTH_ENDPOINT,
        request
    );

    const payload =
        "result" in response.data ? response.data.result : response.data;

    if (!payload.accessToken || typeof payload.userId !== "number") {
        throw new Error("Unexpected authentication response payload.");
    }

    return payload;
}

export const authService = {
    login,
};
