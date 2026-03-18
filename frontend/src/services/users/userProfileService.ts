import { USER_PROFILE_GET_MY_PROFILE_ENDPOINT } from "@/constants/api";
import { apiClient } from "@/lib/api/client";

interface IAbpResponseEnvelope<T> {
    result: T;
}

export interface IMyProfileResponse {
    userId: number;
    preferredLanguage: string;
}

/** Fetches the authenticated user's profile from UserProfileAppService. */
async function getMyProfile(): Promise<IMyProfileResponse> {
    const response = await apiClient.get<IAbpResponseEnvelope<IMyProfileResponse>>(USER_PROFILE_GET_MY_PROFILE_ENDPOINT);
    return response.data.result;
}

export const userProfileService = {
    getMyProfile,
};
