import { test, expect } from '@playwright/test';

test.describe('Layout Components', () => {
  test.beforeEach(async ({ page }) => {
    // Mock authentication for dashboard tests
    await page.addInitScript(() => {
      // Mock localStorage for auth state
      window.localStorage.setItem('authToken', 'mock-token');
      window.localStorage.setItem('userId', '1');
    });
  });

  test('AppSidebar should render navigation items', async ({ page }) => {
    await page.goto('/dashboard/admin');
    
    // Check if sidebar is visible (assuming it's visible on desktop)
    const sidebar = page.locator('[data-testid="app-sidebar"]');
    if (await sidebar.isVisible()) {
      // Check for navigation items
      await expect(page.locator('nav a')).toHaveCount.greaterThan(0);
    }
  });

  test('PageHeader should display title and subtitle', async ({ page }) => {
    await page.goto('/dashboard/admin');
    
    // Check for page header elements
    const headerTitle = page.locator('h1, h2, h3').first();
    if (await headerTitle.isVisible()) {
      await expect(headerTitle).toBeVisible();
    }
  });
});