import type { IRoleOption } from "./userService";

export const ADMIN_MANAGEABLE_ROLE_NAMES = ["ADMIN", "STUDENT", "TUTOR"] as const;

export function normalizeRoleName(roleName: string): string {
    return roleName.trim().toUpperCase();
}

export function isAdminManageableRole(role: Pick<IRoleOption, "name" | "normalizedName">): boolean {
    const normalizedCandidates = [
        normalizeRoleName(role.name),
        normalizeRoleName(role.normalizedName ?? ""),
    ];

    return normalizedCandidates.some((candidate) =>
        ADMIN_MANAGEABLE_ROLE_NAMES.includes(candidate as typeof ADMIN_MANAGEABLE_ROLE_NAMES[number])
    );
}

export function filterAdminManageableRoles(roles: IRoleOption[]): IRoleOption[] {
    return roles.filter(isAdminManageableRole);
}

export function toAdminRoleFilterOptions(
    roles: IRoleOption[],
    allRolesLabel: string
): Array<{ label: string; value: string }> {
    return [
        { label: allRolesLabel, value: "" },
        ...roles.map((role) => ({
            label: role.displayName || role.name,
            value: role.normalizedName || normalizeRoleName(role.name),
        })),
    ];
}

export function toAdminRoleSelectOptions(roles: IRoleOption[]): Array<{ label: string; value: string }> {
    return roles.map((role) => ({
        label: role.displayName || role.name,
        value: role.name,
    }));
}
