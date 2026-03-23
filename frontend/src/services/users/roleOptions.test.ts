import { describe, expect, it } from "vitest";
import {
    filterAdminManageableRoles,
    normalizeRoleName,
    toAdminRoleFilterOptions,
    toAdminRoleSelectOptions,
} from "@/services/users/roleOptions";
import type { IRoleOption } from "@/services/users/userService";

const roles: IRoleOption[] = [
    { id: 1, name: "Admin", displayName: "Admin", normalizedName: "ADMIN" },
    { id: 2, name: "Student", displayName: "Student", normalizedName: "STUDENT" },
    { id: 3, name: "Tutor", displayName: "Tutor", normalizedName: "TUTOR" },
    { id: 4, name: "Parent", displayName: "Parent", normalizedName: "PARENT" },
];

describe("roleOptions", () => {
    it("normalizes role names case-insensitively", () => {
        expect(normalizeRoleName("  admin ")).toBe("ADMIN");
    });

    it("filters backend roles down to Admin, Student, and Tutor only", () => {
        expect(filterAdminManageableRoles(roles)).toEqual(roles.slice(0, 3));
    });

    it("builds admin users filter options with only allowed roles", () => {
        expect(toAdminRoleFilterOptions(filterAdminManageableRoles(roles), "All roles")).toEqual([
            { label: "All roles", value: "" },
            { label: "Admin", value: "ADMIN" },
            { label: "Student", value: "STUDENT" },
            { label: "Tutor", value: "TUTOR" },
        ]);
    });

    it("builds admin user modal select options with only allowed roles", () => {
        expect(toAdminRoleSelectOptions(filterAdminManageableRoles(roles))).toEqual([
            { label: "Admin", value: "Admin" },
            { label: "Student", value: "Student" },
            { label: "Tutor", value: "Tutor" },
        ]);
    });
});
