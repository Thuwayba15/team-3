"use client";

import { apiClient } from "@/lib/api/client";
import { getCachedResource, invalidateCachedResource } from "@/lib/api/requestCache";
import { 
    LOGOUT_ENDPOINT, 
    ME_ENDPOINT, 
    TOKEN_AUTH_ENDPOINT,
    // Ensure this constant is defined in your @/constants/api file
    REGISTER_ENDPOINT 
} from "@/constants/api";

interface IAbpResponseEnvelope<T> {
    result: T;
}

/** Request body sent to the ABP TokenAuth/Authenticate endpoint. */
export interface ILoginRequest {
    userNameOrEmailAddress: string;
    password: string;
    rememberClient: boolean;
}

/** Request body for the ABP Account/Register endpoint. */
export interface IRegisterRequest {
    userName: string;
    name: string;
    surname: string;
    emailAddress: string;
    password: string;
    roleNames: string[];
}

/** Response from the ABP TokenAuth/Authenticate endpoint. */
export interface ILoginResponse {
    expireInSeconds: number;
    userId: number;
    roles: string[];
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
    invalidateCachedResource("auth:");
    invalidateCachedResource("session:");
    return payload;
}

/** * Handles user registration.
 */
async function register(request: IRegisterRequest): Promise<void> {
    await apiClient.post(REGISTER_ENDPOINT, request);
    invalidateCachedResource("auth:");
    invalidateCachedResource("session:");
}

/** Instructs the backend to clear the HttpOnly auth cookie. */
async function logout(): Promise<void> {
    await apiClient.post(LOGOUT_ENDPOINT);
    invalidateCachedResource("auth:");
    invalidateCachedResource("session:");
}

/**
 * Validates the current auth cookie and returns the userId.
 */
async function getMe(): Promise<IMeResponse> {
    return getCachedResource("auth:me", async () => {
        const response = await apiClient.get<IMeResponse | IAbpResponseEnvelope<IMeResponse>>(ME_ENDPOINT);
        const payload = "result" in response.data ? response.data.result : response.data;
        return payload;
    }, 30000);
}

export const authService = {
    login,
    register, // Now exported and accessible
    logout,
    getMe,
};
