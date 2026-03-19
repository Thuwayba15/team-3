/**
 * Student Dashboard Service
 * HTTP client for fetching personalized student dashboard data from the backend API.
 * Handles ABP response envelope structure and error extraction.
 */

import { apiClient } from "@/lib/api/client";
import { STUDENT_DASHBOARD_GET_MY_DASHBOARD_ENDPOINT } from "@/constants/api";
import type { StudentDashboardData } from "@/providers/student/context";

/**
 * Backend response envelope structure matching ABP convention.
 */
interface IAbpResponseEnvelope<T> {
    result: T;
    targetUrl: string | null;
    success: boolean;
    error: {
        message: string;
        details: string;
        code: string;
    } | null;
    unAuthorizedRequest: boolean;
    __abp: boolean;
}

class StudentDashboardService {
    /**
     * Fetches the complete dashboard for the current authenticated student.
     * Includes progress summary, recommendations, revision advice, and heatmap.
     *
     * Endpoint: GET /api/services/app/student-dashboard/get-my-dashboard
     *
     * @param subjectId - Optional subject UUID to filter dashboard data to a single subject
     * @returns Promise<StudentDashboardData> - Complete dashboard with all data
     * @throws Error if the request fails or returns an error from the backend
     */
    async getMyDashboard(subjectId?: string): Promise<StudentDashboardData> {
        try {
            const response = await apiClient.get<IAbpResponseEnvelope<StudentDashboardData>>(
                STUDENT_DASHBOARD_GET_MY_DASHBOARD_ENDPOINT,
                {
                    params: subjectId ? { subjectId } : {},
                }
            );

            if (!response.data.success) {
                throw new Error(
                    response.data.error?.message || "Failed to load dashboard"
                );
            }

            return response.data.result;
        } catch (error) {
            // Re-throw with a user-friendly message
            if (error instanceof Error) {
                throw error;
            }
            throw new Error("An unexpected error occurred while loading the dashboard");
        }
    }
}

export const studentDashboardService = new StudentDashboardService();
