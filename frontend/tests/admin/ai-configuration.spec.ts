import { expect, test } from "@playwright/test";

test.describe.skip("AiConfiguration", () => {
    test("loads successfully", async ({ page }) => {
        await page.goto("/admin/ai-configuration");
        await expect(page.getByRole("heading", { name: "AI Configuration" })).toBeVisible();
    });

    test("has correct URL", async ({ page }) => {
        await page.goto("/admin/ai-configuration");
        await expect(page).toHaveURL(/\/admin\/ai-configuration$/);
    });
});
