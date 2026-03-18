import { expect, test } from "@playwright/test";

test.describe("CurriculumManagement", () => {
    test("loads successfully", async ({ page }) => {
        await page.goto("/admin/curriculum");
        await expect(page.getByRole("heading", { name: "Curriculum Management" })).toBeVisible();
    });

    test("has correct URL", async ({ page }) => {
        await page.goto("/admin/curriculum");
        await expect(page).toHaveURL(/\/admin\/curriculum$/);
    });
});
