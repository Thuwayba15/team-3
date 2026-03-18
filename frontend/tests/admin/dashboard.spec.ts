import { expect, test } from "@playwright/test";

test.describe.skip("AdminDashboard", () => {
    test("loads successfully", async ({ page }) => {
        await page.goto("/admin/dashboard");
        await expect(page.getByRole("heading", { name: "System Administration" })).toBeVisible();
    });

    test("has correct URL", async ({ page }) => {
        await page.goto("/admin/dashboard");
        await expect(page).toHaveURL(/\/admin\/dashboard$/);
    });
});
