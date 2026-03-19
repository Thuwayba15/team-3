/**
 * Student Dashboard Service
 * HTTP client for fetching personalized student dashboard data from the backend API.
 * Handles ABP response envelope structure and error extraction.
 */

import { apiClient } from "@/lib/api/client";
import type { StudentDashboardData } from "@/providers/student/context";

/**
 * Backend response envelope structure matching ABP convention.
 */
interface IStudentDashboardApiResponse {
    result: StudentDashboardData;
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
     * @returns Promise<StudentDashboardData> - Complete dashboard with all data
     * @throws Error if the request fails or returns an error from the backend
     */
    async getMyDashboard(): Promise<StudentDashboardData> {
        try {
            const response = await apiClient.get<IStudentDashboardApiResponse>(
                "/api/services/app/student-dashboard/get-my-dashboard"
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
