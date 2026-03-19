import { beforeEach, describe, expect, it, vi } from "vitest";
import { adminDashboardService } from "@/services/admin/adminDashboardService";

const { getAllMock, getActiveLanguagesMock } = vi.hoisted(() => ({
    getAllMock: vi.fn(),
    getActiveLanguagesMock: vi.fn(),
}));

vi.mock("@/services/users/userService", () => ({
    userService: {
        getAll: getAllMock,
    },
}));

vi.mock("@/services/users/userProfileService", () => ({
    userProfileService: {
        getActiveLanguages: getActiveLanguagesMock,
    },
}));

describe("adminDashboardService", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("builds summary metrics and recent login data from available services", async () => {
        getAllMock.mockResolvedValueOnce({
            totalCount: 3,
            items: [
                {
                    id: 1,
                    userName: "admin.user",
                    name: "Admin",
                    surname: "User",
                    emailAddress: "admin@example.com",
                    isActive: true,
                    fullName: "Admin User",
                    lastLoginTime: "2026-03-19T09:00:00Z",
                    creationTime: "2026-03-10T09:00:00Z",
                    roleNames: ["Admin"],
                },
                {
                    id: 2,
                    userName: "tutor.user",
                    name: "Tutor",
                    surname: "User",
                    emailAddress: "tutor@example.com",
                    isActive: true,
                    fullName: "Tutor User",
                    lastLoginTime: "2026-03-18T09:00:00Z",
                    creationTime: "2026-03-12T09:00:00Z",
                    roleNames: ["Tutor"],
                },
                {
                    id: 3,
                    userName: "parent.user",
                    name: "Parent",
                    surname: "User",
                    emailAddress: "parent@example.com",
                    isActive: false,
                    fullName: "Parent User",
                    lastLoginTime: null,
                    creationTime: "2026-03-15T09:00:00Z",
                    roleNames: ["Parent"],
                },
            ],
        });
        getActiveLanguagesMock.mockResolvedValueOnce([
            { code: "en", name: "English", isDefault: true },
            { code: "zu", name: "isiZulu", isDefault: false },
        ]);

        const summary = await adminDashboardService.getSummary();

        expect(summary.metrics).toHaveLength(4);
        expect(summary.metrics[0]?.value).toBe("3");
        expect(summary.roleDistribution[0]).toEqual(
            expect.objectContaining({ roleName: "Admin", count: 1 })
        );
        expect(summary.recentLogins).toHaveLength(2);
        expect(summary.recentLogins[0]?.id).toBe(1);
    });

    it("handles missing language data without failing the summary", async () => {
        getAllMock.mockResolvedValueOnce({
            totalCount: 0,
            items: [],
        });
        getActiveLanguagesMock.mockRejectedValueOnce(new Error("unavailable"));

        const summary = await adminDashboardService.getSummary();

        expect(summary.metrics[3]?.value).toBe("0");
        expect(summary.recentLogins).toEqual([]);
        expect(summary.roleDistribution).toEqual([]);
    });
});
