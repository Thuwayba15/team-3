import { test, expect } from "@playwright/test";

/** Generates a unique suffix from the current timestamp to isolate test users from one another. */
function uniqueSuffix(): string {
    return Date.now().toString();
}

test.describe("RegistrationFlow", () => {
    test("landing page loads successfully", async ({ page }) => {
        await page.goto("/");
        await expect(page.getByRole("heading", { name: "Ubuntu Learn" })).toBeVisible();
    });

    test("landing page has correct URL", async ({ page }) => {
        await page.goto("/");
        await expect(page).toHaveURL("/");
    });

    test("Login link on landing page navigates to the login page", async ({ page }) => {
        await page.goto("/");
        await page.getByRole("link", { name: "Login" }).click();
        await expect(page).toHaveURL("/login");
    });

    test("login page loads successfully", async ({ page }) => {
        await page.goto("/login");
        await expect(page.getByRole("heading", { name: "Sign In" })).toBeVisible();
    });

    test("login page has correct URL", async ({ page }) => {
        await page.goto("/login");
        await expect(page).toHaveURL("/login");
    });

    test("Create an account link navigates from login to the register page", async ({ page }) => {
        await page.goto("/login");
        await page.getByRole("link", { name: "Create an account" }).click();
        await expect(page).toHaveURL("/register");
    });

    test("register page loads successfully", async ({ page }) => {
        await page.goto("/register");
        await expect(page.getByRole("heading", { name: "Create Account" })).toBeVisible();
    });

    test("register page has correct URL", async ({ page }) => {
        await page.goto("/register");
        await expect(page).toHaveURL("/register");
    });

    test("Sign In link navigates from register page to the login page", async ({ page }) => {
        await page.goto("/register");
        await page.getByRole("link", { name: "Sign In" }).click();
        await expect(page).toHaveURL("/login");
    });

    test("registers a new Parent account and is redirected to the parent dashboard", async ({ page }) => {
        const suffix = uniqueSuffix();
        const userName = `TestParent${suffix}`;
        const email = `testparent${suffix}@example.com`;
        const password = `Parent${suffix.slice(-6)}Pw1`;

        // Navigate to the register page via the landing page and login page
        await page.goto("/");
        await page.getByRole("link", { name: "Login" }).click();
        await page.getByRole("link", { name: "Create an account" }).click();
        await expect(page).toHaveURL("/register");

        // Fill in the registration form
        await page.getByPlaceholder("First Name").fill("Test");
        await page.getByPlaceholder("Last Name").fill("Parent");
        await page.getByPlaceholder("Username").fill(userName);
        await page.getByPlaceholder("Email Address").fill(email);

        // Open the role dropdown and select Parent
        await page.getByRole("combobox").click();
        await page.getByRole("option", { name: "Parent" }).click();

        await page.getByPlaceholder("Password").fill(password);
        await page.getByRole("button", { name: "Sign Up" }).click();

        // Successful registration auto-logs in and redirects to the role dashboard
        await expect(page).toHaveURL(/\/parent\/dashboard$/, { timeout: 10000 });
    });

    test("signs in with valid credentials and is redirected to the correct dashboard", async ({ page }) => {
        const suffix = uniqueSuffix();
        const userName = `TestLogin${suffix}`;
        const email = `testlogin${suffix}@example.com`;
        const password = `Login${suffix.slice(-6)}Pw1`;

        // Create a new user via the register form first
        await page.goto("/register");
        await page.getByPlaceholder("First Name").fill("Test");
        await page.getByPlaceholder("Last Name").fill("Login");
        await page.getByPlaceholder("Username").fill(userName);
        await page.getByPlaceholder("Email Address").fill(email);
        await page.getByRole("combobox").click();
        await page.getByRole("option", { name: "Parent" }).click();
        await page.getByPlaceholder("Password").fill(password);
        await page.getByRole("button", { name: "Sign Up" }).click();
        await expect(page).toHaveURL(/\/parent\/dashboard$/, { timeout: 10000 });

        // Clear the session to simulate returning as an unauthenticated visitor
        await page.context().clearCookies();
        await page.evaluate(() => localStorage.clear());

        // Sign in via the login page using the credentials just registered
        await page.goto("/login");
        await expect(page.getByRole("heading", { name: "Sign In" })).toBeVisible();
        await page.getByLabel("Username or Email").fill(userName);
        await page.getByLabel("Password").fill(password);
        await page.getByRole("button", { name: "Sign in" }).click();

        // Should be redirected to the correct role dashboard
        await expect(page).toHaveURL(/\/parent\/dashboard$/, { timeout: 10000 });
    });
});
