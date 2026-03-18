import axios from "axios";
import { apiClient } from "@/lib/api/client";

const BASE = "/api/services/app/ParentChildManagement";

export interface LinkChildInput {
    usernameOrEmail: string;
}

export interface RegisterChildInput {
    name: string;
    surname: string;
    emailAddress: string;
    userName: string;
    password: string;
    gradeLevel: string;
}

export interface ChildLinkResult {
    studentUserId: number;
    studentName: string;
    gradeLevel: string;
    relationship: string;
}

function extractErrorMessage(error: unknown): string {
    if (axios.isAxiosError(error)) {
        const abpMessage = error.response?.data?.error?.message;
        if (abpMessage) return abpMessage;
        if (error.response?.status === 401) return "You are not logged in.";
        if (error.response?.status === 403) return "You do not have permission to perform this action.";
    }
    return "An unexpected error occurred.";
}

export async function linkChild(input: LinkChildInput): Promise<ChildLinkResult> {
    try {
        const res = await apiClient.post<{ result: ChildLinkResult }>(`${BASE}/LinkChild`, input);
        return res.data.result;
    } catch (error) {
        throw new Error(extractErrorMessage(error));
    }
}

export async function registerChild(input: RegisterChildInput): Promise<ChildLinkResult> {
    try {
        const res = await apiClient.post<{ result: ChildLinkResult }>(`${BASE}/RegisterChild`, input);
        return res.data.result;
    } catch (error) {
        throw new Error(extractErrorMessage(error));
    }
}
