import {
    USER_PROFILE_GET_MY_PLATFORM_LANGUAGE_ENDPOINT,
    USER_PROFILE_UPDATE_PLATFORM_LANGUAGE_ENDPOINT,
} from "@/constants/api";
import { apiClient } from "@/lib/api/client";
import axios from "axios";

interface IAbpResponseEnvelope<T> {
    result: T;
}

export interface IMyProfileResponse {
    preferredLanguage: string;
}

interface IUpdatePlatformLanguageRequest {
    preferredLanguage: string;
}

/** Fetches the authenticated user's preferred platform language. */
async function getMyProfile(): Promise<IMyProfileResponse> {
    const response = await apiClient.get<IAbpResponseEnvelope<IMyProfileResponse>>(USER_PROFILE_GET_MY_PLATFORM_LANGUAGE_ENDPOINT);
    return response.data.result;
}

/** Persists the authenticated user's preferred platform language. */
async function updateMyPlatformLanguage(preferredLanguage: string): Promise<void> {
    const payload: IUpdatePlatformLanguageRequest = {
        preferredLanguage,
    };

    try {
        await apiClient.put<IAbpResponseEnvelope<IMyProfileResponse>>(USER_PROFILE_UPDATE_PLATFORM_LANGUAGE_ENDPOINT, payload);
    } catch (error) {
        // fallback for environments where dynamic API maps Update* methods to POST
        if (axios.isAxiosError(error) && error.response?.status === 405) {
            await apiClient.post<IAbpResponseEnvelope<IMyProfileResponse>>(USER_PROFILE_UPDATE_PLATFORM_LANGUAGE_ENDPOINT, payload);
            return;
        }

        throw error;
    }
}

export const userProfileService = {
    getMyProfile,
    updateMyPlatformLanguage,
};
