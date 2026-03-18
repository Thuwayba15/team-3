import { expect, test } from "@playwright/test";

test.describe("AdminLanguages", () => {
    test("loads successfully", async ({ page }) => {
        await page.goto("/admin/languages");
        await expect(page.getByRole("heading", { name: "Language Management" })).toBeVisible();
    });

    test("has correct URL", async ({ page }) => {
        await page.goto("/admin/languages");
        await expect(page).toHaveURL(/\/admin\/languages$/);
    });
});
