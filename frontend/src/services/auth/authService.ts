import { apiClient } from "@/lib/api/client";
import { LOGOUT_ENDPOINT, ME_ENDPOINT, TOKEN_AUTH_ENDPOINT } from "@/constants/api";

interface IAbpResponseEnvelope<T> {
    result: T;
}

/** Request body sent to the ABP TokenAuth/Authenticate endpoint. */
export interface ILoginRequest {
    userNameOrEmailAddress: string;
    password: string;
    rememberClient: boolean;
}

/** Response from the ABP TokenAuth/Authenticate endpoint. The token is set as an HttpOnly cookie; only metadata is returned in the body. */
export interface ILoginResponse {
    expireInSeconds: number;
    userId: number;
}

export interface IMeResponse {
    userId: number;
}

async function login(request: ILoginRequest): Promise<ILoginResponse> {
    const response = await apiClient.post<ILoginResponse | IAbpResponseEnvelope<ILoginResponse>>(
        TOKEN_AUTH_ENDPOINT,
        request
    );
    const payload = "result" in response.data ? response.data.result : response.data;
    if (typeof payload.userId !== "number") {
        throw new Error("Unexpected authentication response payload.");
    }
    return payload;
}

/** Instructs the backend to clear the HttpOnly auth cookie. Fire-and-forget safe. */
async function logout(): Promise<void> {
    await apiClient.post(LOGOUT_ENDPOINT);
}

/**
 * Validates the current auth cookie and returns the userId.
 */
async function getMe(): Promise<IMeResponse> {
    const response = await apiClient.get<IMeResponse | IAbpResponseEnvelope<IMeResponse>>(ME_ENDPOINT);
    const payload = "result" in response.data ? response.data.result : response.data;
    return payload;
}

export const authService = {
    login,
    logout,
    getMe,
};
