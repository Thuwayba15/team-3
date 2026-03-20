import { test, expect } from '@playwright/test';

test.describe('Tutor Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    // Mock authentication for tutor dashboard
    await page.addInitScript(() => {
      window.localStorage.setItem('authToken', 'mock-token');
      window.localStorage.setItem('userId', '1');
      window.localStorage.setItem('userRole', 'Tutor');
    });
  });

  test('should display tutor dashboard page', async ({ page }) => {
    await page.goto('/dashboard/tutor');
    
    // Check if page header is visible
    await expect(page.locator('h1, h2, h3').first()).toContainText('Tutor Dashboard');
    
    // Check for page header component
    await expect(page.locator('.pageHeader')).toBeVisible();
  });

  test('should display dashboard title and subtitle', async ({ page }) => {
    await page.goto('/dashboard/tutor');
    
    // Check for title
    await expect(page.locator('h1, h2, h3').first()).toBeVisible();
    
    // Check for subtitle
    await expect(page.locator('text=Tutor Dashboard')).toBeVisible();
  });

  test('should handle loading state', async ({ page }) => {
    await page.goto('/dashboard/tutor');
    
    // Check for loading states (if any)
    const loadingState = page.locator('.ant-skeleton');
    if (await loadingState.isVisible()) {
      await expect(loadingState).toBeVisible();
    }
  });

  test('should handle error state', async ({ page }) => {
    // Mock API error
    await page.route('**/api/tutor/dashboard', route => {
      route.fulfill({
        status: 500,
        body: JSON.stringify({ error: 'Server error' })
      });
    });
    
    await page.goto('/dashboard/tutor');
    
    // Check for error messages
    await expect(page.locator('.ant-alert-error')).toBeVisible();
  });

  test('should be accessible', async ({ page }) => {
    await page.goto('/dashboard/tutor');
    
    // Check for proper heading structure
    const headings = page.locator('h1, h2, h3, h4, h5, h6');
    await expect(headings).toHaveCount.greaterThan(0);
    
    // Check for proper ARIA labels
    await expect(page.locator('[aria-label]')).toHaveCount.greaterThan(0);
    
    // Check for proper semantic structure
    await expect(page.locator('main')).toBeVisible();
  });

  test('should be responsive', async ({ page }) => {
    // Test desktop view
    await page.setViewportSize({ width: 1200, height: 800 });
    await page.goto('/dashboard/tutor');
    await expect(page.locator('.pageHeader')).toBeVisible();
    
    // Test tablet view
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(page.locator('.pageHeader')).toBeVisible();
    
    // Test mobile view
    await page.setViewportSize({ width: 375, height: 812 });
    await expect(page.locator('.pageHeader')).toBeVisible();
  });

  test('should handle empty state', async ({ page }) => {
    // Mock empty response
    await page.route('**/api/tutor/dashboard', route => {
      route.fulfill({
        status: 200,
        body: JSON.stringify({})
      });
    });
    
    await page.goto('/dashboard/tutor');
    
    // Check for empty state
    await expect(page.locator('text=Tutor Dashboard')).toBeVisible();
  });
});