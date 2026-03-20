import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Start from the home page
    await page.goto('/');
  });

  test('should display login form on home page', async ({ page }) => {
    // Check if login form is visible
    await expect(page.locator('form')).toBeVisible();
    await expect(page.locator('input[placeholder="Username or email address"]')).toBeVisible();
    await expect(page.locator('input[placeholder="Password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toContainText('Sign in');
  });

  test('should validate required fields', async ({ page }) => {
    // Try to submit empty form
    await page.click('button[type="submit"]');
    
    // Check for validation errors
    await expect(page.locator('text=Please enter your username or email.')).toBeVisible();
    await expect(page.locator('text=Please enter your password.')).toBeVisible();
  });

  test('should validate password requirements on register form', async ({ page }) => {
    // Navigate to register page
    await page.goto('/register');
    
    // Fill in required fields but with invalid password
    await page.fill('input[placeholder="First Name"]', 'John');
    await page.fill('input[placeholder="Last Name"]', 'Doe');
    await page.fill('input[placeholder="Username"]', 'johndoe');
    await page.fill('input[placeholder="Email Address"]', 'john@example.com');
    await page.selectOption('select', 'Student');
    await page.fill('input[placeholder="Password"]', 'weak');
    
    // Try to submit
    await page.click('button[type="submit"]');
    
    // Check for password validation error
    await expect(page.locator('text=Min 8 characters with at least one uppercase letter, lowercase letter, and number')).toBeVisible();
  });

  test('should validate email format on register form', async ({ page }) => {
    // Navigate to register page
    await page.goto('/register');
    
    // Fill in invalid email
    await page.fill('input[placeholder="Email Address"]', 'invalid-email');
    
    // Try to submit
    await page.click('button[type="submit"]');
    
    // Check for email validation error
    await expect(page.locator('text=Valid email required')).toBeVisible();
  });

  test('should show error message for invalid credentials', async ({ page }) => {
    // Try to login with invalid credentials
    await page.fill('input[placeholder="Username or email address"]', 'invaliduser');
    await page.fill('input[placeholder="Password"]', 'wrongpassword');
    await page.click('button[type="submit"]');
    
    // Should show error message (assuming the app shows one)
    // Note: This test might need adjustment based on actual error handling
    await expect(page.locator('[role="alert"]')).toBeVisible();
  });

  test('should have proper form accessibility', async ({ page }) => {
    // Check for proper labels and placeholders
    await expect(page.locator('label')).toContainText('Username or Email');
    await expect(page.locator('label')).toContainText('Password');
    
    // Check for proper input types
    await expect(page.locator('input[type="password"]')).toBeVisible();
    
    // Check for proper autocomplete attributes
    await expect(page.locator('input[autocomplete="username"]')).toBeVisible();
    await expect(page.locator('input[autocomplete="current-password"]')).toBeVisible();
  });

  test('should clear error messages when user starts typing', async ({ page }) => {
    // Trigger an error first
    await page.click('button[type="submit"]');
    await expect(page.locator('text=Please enter your username or email.')).toBeVisible();
    
    // Start typing in username field
    await page.fill('input[placeholder="Username or email address"]', 'testuser');
    
    // Error should be cleared
    await expect(page.locator('text=Please enter your username or email.')).not.toBeVisible();
  });

  test('should have proper form structure', async ({ page }) => {
    // Check form has proper structure
    const form = page.locator('form');
    await expect(form).toBeVisible();
    
    // Check for required attributes
    await expect(form).toHaveAttribute('noValidate'); // Ant Design forms typically have this
    
    // Check input fields have proper names for form submission
    await expect(page.locator('input[name="userNameOrEmailAddress"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
  });
});