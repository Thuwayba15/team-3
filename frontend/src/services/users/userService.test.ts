import { beforeEach, describe, expect, it, vi } from "vitest";
import { userService } from "@/services/users/userService";

const { apiClientMock } = vi.hoisted(() => ({
    apiClientMock: {
        get: vi.fn(),
        post: vi.fn(),
        put: vi.fn(),
    },
}));

vi.mock("@/lib/api/client", () => ({
    apiClient: apiClientMock,
}));

describe("userService", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("maps paged ABP responses for getAll", async () => {
        apiClientMock.get.mockResolvedValueOnce({
            data: {
                result: {
                    totalCount: 1,
                    items: [
                        {
                            id: 7,
                            userName: "admin.user",
                            name: "Admin",
                            surname: "User",
                            emailAddress: "admin@example.com",
                            isActive: true,
                            fullName: "Admin User",
                            lastLoginTime: null,
                            creationTime: "2026-03-19T10:00:00Z",
                            roleNames: ["Admin"],
                        },
                    ],
                },
            },
        });

        const result = await userService.getAll({ keyword: "admin", roleName: "Admin", isActive: true });

        expect(apiClientMock.get).toHaveBeenCalledWith("/api/services/app/User/GetAll", {
            params: expect.objectContaining({
                Keyword: "admin",
                RoleName: "Admin",
                IsActive: true,
            }),
        });
        expect(result.totalCount).toBe(1);
        expect(result.items[0]?.userName).toBe("admin.user");
    });

    it("falls back to POST when update PUT is not allowed", async () => {
        apiClientMock.put.mockRejectedValueOnce({
            isAxiosError: true,
            response: { status: 405 },
        });
        apiClientMock.post.mockResolvedValueOnce({
            data: {
                result: {
                    id: 7,
                    userName: "admin.user",
                    name: "Admin",
                    surname: "User",
                    emailAddress: "admin@example.com",
                    isActive: true,
                    fullName: "Admin User",
                    lastLoginTime: null,
                    creationTime: "2026-03-19T10:00:00Z",
                    roleNames: ["Admin"],
                },
            },
        });

        const result = await userService.update({
            id: 7,
            userName: "admin.user",
            name: "Admin",
            surname: "User",
            emailAddress: "admin@example.com",
            isActive: true,
            roleNames: ["Admin"],
        });

        expect(apiClientMock.put).toHaveBeenCalledTimes(1);
        expect(apiClientMock.post).toHaveBeenCalledWith(
            "/api/services/app/User/Update",
            expect.objectContaining({ id: 7 })
        );
        expect(result.id).toBe(7);
    });

    it("posts status changes to the ABP activation endpoints", async () => {
        apiClientMock.post.mockResolvedValue({});

        await userService.activate(3);
        await userService.deactivate(4);

        expect(apiClientMock.post).toHaveBeenNthCalledWith(1, "/api/services/app/User/Activate", { id: 3 });
        expect(apiClientMock.post).toHaveBeenNthCalledWith(2, "/api/services/app/User/DeActivate", { id: 4 });
    });
});
