"use client";

import { apiClient } from "@/lib/api/client";
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

/** Request body for the Register endpoint based on your backend schema. */
export interface IRegisterRequest {
    userName: string;
    name: string;
    surname: string;
    emailAddress: string;
    isActive: boolean;
    roleNames: string[];
    password: string;
}

/** Response from the ABP TokenAuth/Authenticate endpoint. */
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

/** * Handles user registration.
 */
async function register(request: IRegisterRequest): Promise<void> {
    await apiClient.post(REGISTER_ENDPOINT, request);
}

/** Instructs the backend to clear the HttpOnly auth cookie. */
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
    register, // Now exported and accessible
    logout,
    getMe,
};