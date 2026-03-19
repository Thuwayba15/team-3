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

export interface IRecentLoginItem {
    id: number;
    fullName: string;
    emailAddress: string;
    lastLoginTime: string;
    roleName: string;
}

export interface IAdminDashboardSummary {
    metrics: IAdminMetric[];
    roleDistribution: IRoleDistributionItem[];
    recentLogins: IRecentLoginItem[];
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

function toRecentLogins(users: IUser[]): IRecentLoginItem[] {
    return users
        .filter((user) => Boolean(user.lastLoginTime))
        .sort((left, right) => new Date(right.lastLoginTime ?? "").getTime() - new Date(left.lastLoginTime ?? "").getTime())
        .slice(0, 5)
        .map((user) => ({
            id: user.id,
            fullName: user.fullName,
            emailAddress: user.emailAddress,
            lastLoginTime: user.lastLoginTime ?? "",
            roleName: toPrimaryRole(user),
        }));
}

/** Builds an admin dashboard summary from existing frontend services. */
async function getSummary(): Promise<IAdminDashboardSummary> {
    const [usersResult, languages] = await Promise.all([
        userService.getAll({
            skipCount: 0,
            maxResultCount: 500,
            sorting: "CreationTime DESC",
        }),
        userProfileService.getActiveLanguages().catch(() => []),
    ]);

    const users = usersResult.items;
    const activeUsers = users.filter((user) => user.isActive).length;
    const inactiveUsers = users.length - activeUsers;
    const recentLogins = toRecentLogins(users);

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
                key: "recent-sign-ins",
                value: formatCount(recentLogins.length),
                label: "Recent sign-ins",
                helperText: "Users with a recorded login",
            },
            {
                key: "supported-languages",
                value: formatCount(languages.length),
                label: "Supported languages",
                helperText: languages.length > 0 ? "Available for platform UI" : "Language data unavailable",
            },
        ],
        roleDistribution: toRoleDistribution(users),
        recentLogins,
    };
}

export const adminDashboardService = {
    getSummary,
};
