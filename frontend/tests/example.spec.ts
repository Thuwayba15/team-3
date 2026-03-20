import { test, expect } from "@playwright/test";

test("landing page has expected title", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });

  await expect(page).toHaveTitle(/UbuntuLearn/i);
});

test("login link routes to login page", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });

  await page.getByRole("link", { name: "Login" }).click();

  await expect(page).toHaveURL(/\/login$/);
  await expect(page.getByRole("heading", { name: "Sign In" })).toBeVisible();
});
