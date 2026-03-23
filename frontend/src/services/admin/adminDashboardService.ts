import { ADMIN_DASHBOARD_SUMMARY_ENDPOINT } from "@/constants/api";
import { apiClient } from "@/lib/api/client";
import { getCachedResource } from "@/lib/api/requestCache";

export interface IAdminMetric {
    key: string;
    value: string;
    label: string;
    helperText?: string;
}

export interface IRoleDistributionItem {
    roleName: string;
    count: number;
    percent: number;
}

export interface IAdminDashboardSummary {
    metrics: IAdminMetric[];
    roleDistribution: IRoleDistributionItem[];
}

interface IAbpResponseEnvelope<T> {
    result: T;
}

interface IAdminDashboardSummaryResponse {
    totalUsers: number;
    activeUsers: number;
    supportedLanguages: number;
    roleDistribution: IRoleDistributionItem[];
}

function formatCount(value: number): string {
    return new Intl.NumberFormat("en-US").format(value);
}

/** Builds an admin dashboard summary from a dedicated backend aggregate endpoint. */
async function getSummary(): Promise<IAdminDashboardSummary> {
    return getCachedResource("admin-dashboard:summary", async () => {
        const response = await apiClient.get<IAbpResponseEnvelope<IAdminDashboardSummaryResponse>>(ADMIN_DASHBOARD_SUMMARY_ENDPOINT);
        const summary = response.data.result;
        const inactiveUsers = summary.totalUsers - summary.activeUsers;

        return {
            metrics: [
                {
                    key: "total-users",
                    value: formatCount(summary.totalUsers),
                    label: "Total users",
                    helperText: `${formatCount(summary.activeUsers)} active`,
                },
                {
                    key: "active-users",
                    value: formatCount(summary.activeUsers),
                    label: "Active users",
                    helperText: inactiveUsers > 0 ? `${formatCount(inactiveUsers)} inactive` : "No inactive users",
                },
                {
                    key: "supported-languages",
                    value: formatCount(summary.supportedLanguages),
                    label: "Supported languages",
                    helperText: summary.supportedLanguages > 0 ? "All the languages supported" : "Language data unavailable",
                },
            ],
            roleDistribution: summary.roleDistribution,
        };
    }, 30000);
}

export const adminDashboardService = {
    getSummary,
};
