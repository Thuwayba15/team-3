import {
    USER_PROFILE_GET_ACTIVE_LANGUAGES_ENDPOINT,
    USER_PROFILE_GET_SUPPORTED_LANGUAGES_ENDPOINT,
    USER_PROFILE_GET_MY_PLATFORM_LANGUAGE_ENDPOINT,
    USER_PROFILE_UPDATE_PLATFORM_LANGUAGE_ENDPOINT,
} from "@/constants/api";
import { apiClient } from "@/lib/api/client";
import axios from "axios";

interface IAbpResponseEnvelope<T> {
    result: T;
}

interface IAbpListResultEnvelope<T> {
    result: {
        items: T[];
    };
}

export interface IPlatformLanguageOption {
    code: string;
    name: string;
    isDefault: boolean;
}

export interface IMyProfileResponse {
    preferredLanguage: string;
}

interface IUpdatePlatformLanguageRequest {
    preferredLanguage: string;
}

interface IUpdatePlatformLanguageResponse {
    preferredLanguage: string;
}

/** Fetches active platform languages available for selection in the UI. */
async function getActiveLanguages(): Promise<IPlatformLanguageOption[]> {
    const response = await apiClient.get<IAbpListResultEnvelope<IPlatformLanguageOption>>(USER_PROFILE_GET_ACTIVE_LANGUAGES_ENDPOINT);
    return response.data.result.items;
}

/** Fetches all supported platform languages from the Languages table. */
async function getSupportedLanguages(): Promise<IPlatformLanguageOption[]> {
    const response = await apiClient.get<IAbpListResultEnvelope<IPlatformLanguageOption>>(USER_PROFILE_GET_SUPPORTED_LANGUAGES_ENDPOINT);
    return response.data.result.items;
}

/** Fetches the authenticated user's preferred platform language. */
async function getMyProfile(): Promise<IMyProfileResponse> {
    const response = await apiClient.get<IAbpResponseEnvelope<IMyProfileResponse>>(USER_PROFILE_GET_MY_PLATFORM_LANGUAGE_ENDPOINT);
    return response.data.result;
}

/** Persists the authenticated user's preferred platform language. */
async function updateMyPlatformLanguage(preferredLanguage: string): Promise<IUpdatePlatformLanguageResponse> {
    const payload: IUpdatePlatformLanguageRequest = {
        preferredLanguage,
    };

    try {
        const response = await apiClient.put<IAbpResponseEnvelope<IUpdatePlatformLanguageResponse>>(
            USER_PROFILE_UPDATE_PLATFORM_LANGUAGE_ENDPOINT,
            payload
        );

        return response.data.result;
    } catch (error) {
        // fallback for environments where dynamic API maps Update* methods to POST
        if (axios.isAxiosError(error) && error.response?.status === 405) {
            const response = await apiClient.post<IAbpResponseEnvelope<IUpdatePlatformLanguageResponse>>(
                USER_PROFILE_UPDATE_PLATFORM_LANGUAGE_ENDPOINT,
                payload
            );

            return response.data.result;
        }

        throw error;
    }
}

export const userProfileService = {
    getActiveLanguages,
    getSupportedLanguages,
    getMyProfile,
    updateMyPlatformLanguage,
};
