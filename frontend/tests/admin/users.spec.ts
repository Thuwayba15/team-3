import { expect, test } from "@playwright/test";

test.describe.skip("AdminUsers", () => {
    test("loads successfully", async ({ page }) => {
        await page.goto("/admin/users");
        await expect(page.getByRole("heading", { name: "User Management" })).toBeVisible();
    });

    test("has correct URL", async ({ page }) => {
        await page.goto("/admin/users");
        await expect(page).toHaveURL(/\/admin\/users$/);
    });
});
