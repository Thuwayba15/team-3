import { expect, test } from "@playwright/test";
import type { Page } from "@playwright/test";

function mockAuthenticatedLanguageApis(page: Page, serverLanguageCode: string): Promise<void>[] {
    return [
        page.route("**/api/TokenAuth/Me", async (route) => {
            await route.fulfill({
                status: 200,
                contentType: "application/json",
                body: JSON.stringify({ result: { userId: 53 } }),
            });
        }),
        page.route("**/api/services/app/UserProfile/GetActiveLanguages", async (route) => {
            await route.fulfill({
                status: 200,
                contentType: "application/json",
                body: JSON.stringify({
                    result: {
                        items: [
                            { code: "en", name: "English", isDefault: true },
                            { code: "zu", name: "isiZulu", isDefault: false },
                        ],
                    },
                }),
            });
        }),
        page.route("**/api/services/app/UserProfile/GetMyPlatformLanguage", async (route) => {
            await route.fulfill({
                status: 200,
                contentType: "application/json",
                body: JSON.stringify({
                    result: {
                        preferredLanguage: serverLanguageCode,
                    },
                }),
            });
        }),
        page.route("**/api/services/app/Session/GetCurrentLoginInformations", async (route) => {
            await route.fulfill({
                status: 200,
                contentType: "application/json",
                body: JSON.stringify({
                    result: {
                        user: {
                            name: "Test",
                            surname: "Student",
                            userName: "test.student",
                            emailAddress: "test.student@example.com",
                        },
                    },
                }),
            });
        }),
    ];
}

test.describe("LanguagePreferenceCache", () => {
    test("does not write platform language on login page when cache is empty", async ({ page }) => {
        await page.goto("/login");

        const cachedLanguage = await page.evaluate(() => window.localStorage.getItem("platformLanguage"));
        await expect(cachedLanguage).toBeNull();
    });

    test("reconciles cached language with server language during dashboard bootstrap", async ({ page }) => {
        await page.addInitScript(() => {
            window.localStorage.setItem("userRole", "student");
            window.localStorage.setItem("platformLanguage", "en");
        });

        await Promise.all(mockAuthenticatedLanguageApis(page, "zu"));

        await page.goto("/student/dashboard");

        await expect.poll(async () =>
            page.evaluate(() => window.localStorage.getItem("platformLanguage"))
        ).toBe("zu");
    });

    test("sends language update to backend and updates local cache from dropdown", async ({ page }) => {
        await page.addInitScript(() => {
            window.localStorage.setItem("userRole", "student");
            window.localStorage.setItem("platformLanguage", "en");
        });

        await Promise.all(mockAuthenticatedLanguageApis(page, "en"));

        let updateMethod = "";
        let updatePayload: Record<string, string> | null = null;

        await page.route("**/api/services/app/UserProfile/UpdatePlatformLanguage", async (route) => {
            updateMethod = route.request().method();
            updatePayload = route.request().postDataJSON() as Record<string, string>;

            await route.fulfill({
                status: 200,
                contentType: "application/json",
                body: JSON.stringify({
                    result: {
                        preferredLanguage: "zu",
                    },
                }),
            });
        });

        await page.goto("/student/dashboard");

        await page.getByLabel("Language").click();
        await page.keyboard.press("ArrowDown");
        await page.keyboard.press("Enter");

        await expect.poll(() => updateMethod).toBe("PUT");
        expect(updatePayload).toEqual({ preferredLanguage: "zu" });

        await expect.poll(async () =>
            page.evaluate(() => window.localStorage.getItem("platformLanguage"))
        ).toBe("zu");
    });

    test("clears role and platform language on logout", async ({ page }) => {
        await page.addInitScript(() => {
            window.localStorage.setItem("userRole", "student");
            window.localStorage.setItem("platformLanguage", "zu");
        });

        await Promise.all(mockAuthenticatedLanguageApis(page, "zu"));
        await page.route("**/api/TokenAuth/Logout", async (route) => {
            await route.fulfill({ status: 200, body: "" });
        });

        await page.goto("/student/dashboard");
        await page.getByRole("button", { name: /logout/i }).click();

        await expect(page).toHaveURL(/\/$/);

        const storageState = await page.evaluate(() => ({
            role: window.localStorage.getItem("userRole"),
            language: window.localStorage.getItem("platformLanguage"),
        }));

        await expect(storageState.role).toBeNull();
        await expect(storageState.language).toBeNull();
    });
});
