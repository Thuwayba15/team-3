import { userProfileService } from "@/services/users/userProfileService";
import { userService, type IUser } from "@/services/users/userService";

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

const ROLE_PRIORITY = ["Admin", "Tutor", "Parent", "Student"];

function formatCount(value: number): string {
    return new Intl.NumberFormat("en-US").format(value);
}

function toPrimaryRole(user: IUser): string {
    return ROLE_PRIORITY.find((role) => user.roleNames.includes(role)) ?? user.roleNames[0] ?? "Unassigned";
}

function toRoleDistribution(users: IUser[]): IRoleDistributionItem[] {
    if (users.length === 0) {
        return [];
    }

    const counts = users.reduce<Record<string, number>>((accumulator, user) => {
        const roleName = toPrimaryRole(user);
        accumulator[roleName] = (accumulator[roleName] ?? 0) + 1;
        return accumulator;
    }, {});

    return Object.entries(counts)
        .map(([roleName, count]) => ({
            roleName,
            count,
            percent: Math.round((count / users.length) * 100),
        }))
        .sort((left, right) => right.count - left.count);
}

/** Builds an admin dashboard summary from existing frontend services. */
async function getSummary(): Promise<IAdminDashboardSummary> {
    const [usersResult, languages] = await Promise.all([
        userService.getAll({
            skipCount: 0,
            maxResultCount: 500,
            sorting: "CreationTime DESC",
        }),
        userProfileService.getSupportedLanguages().catch(() => []),
    ]);

    const users = usersResult.items;
    const activeUsers = users.filter((user) => user.isActive).length;
    const inactiveUsers = users.length - activeUsers;

    return {
        metrics: [
            {
                key: "total-users",
                value: formatCount(users.length),
                label: "Total users",
                helperText: `${formatCount(activeUsers)} active`,
            },
            {
                key: "active-users",
                value: formatCount(activeUsers),
                label: "Active users",
                helperText: inactiveUsers > 0 ? `${formatCount(inactiveUsers)} inactive` : "No inactive users",
            },
            {
                key: "supported-languages",
                value: formatCount(languages.length),
                label: "Supported languages",
                helperText: languages.length > 0 ? "All the languages supported" : "Language data unavailable",
            },
        ],
        roleDistribution: toRoleDistribution(users),
    };
}

export const adminDashboardService = {
    getSummary,
};
