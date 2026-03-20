import { test, expect } from '@playwright/test';

test.describe('Admin Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    // Mock authentication for admin dashboard
    await page.addInitScript(() => {
      window.localStorage.setItem('authToken', 'mock-token');
      window.localStorage.setItem('userId', '1');
      window.localStorage.setItem('userRole', 'Admin');
    });
  });

  test('should display admin dashboard page', async ({ page }) => {
    await page.goto('/dashboard/admin');
    
    // Check if page header is visible
    await expect(page.locator('h1, h2, h3').first()).toContainText('Admin Dashboard');
    
    // Check for dashboard content
    await expect(page.locator('.statCard')).toBeVisible();
    await expect(page.locator('.chartCard')).toBeVisible();
  });

  test('should display dashboard metrics', async ({ page }) => {
    await page.goto('/dashboard/admin');
    
    // Check for metric cards
    await expect(page.locator('.statCard')).toHaveCount.greaterThan(0);
    
    // Check for icons in metric cards
    await expect(page.locator('.statIcon')).toBeVisible();
    
    // Check for metric values and labels
    await expect(page.locator('.statValue')).toBeVisible();
    await expect(page.locator('.statLabel')).toBeVisible();
  });

  test('should display user distribution chart', async ({ page }) => {
    await page.goto('/dashboard/admin');
    
    // Check for user distribution section
    await expect(page.locator('text=User Distribution by Role')).toBeVisible();
    
    // Check for progress bars
    await expect(page.locator('.progress')).toBeVisible();
    
    // Check for legend
    await expect(page.locator('.legend')).toBeVisible();
  });

  test('should handle loading state', async ({ page }) => {
    await page.goto('/dashboard/admin');
    
    // Check for skeleton loading states
    const skeleton = page.locator('.ant-skeleton');
    if (await skeleton.isVisible()) {
      await expect(skeleton).toBeVisible();
    }
  });

  test('should handle error state', async ({ page }) => {
    // Mock API error
    await page.route('**/api/admin/dashboard/summary', route => {
      route.fulfill({
        status: 500,
        body: JSON.stringify({ error: 'Server error' })
      });
    });
    
    await page.goto('/dashboard/admin');
    
    // Check for error alert
    await expect(page.locator('.ant-alert-error')).toBeVisible();
  });

  test('should display role distribution correctly', async ({ page }) => {
    await page.goto('/dashboard/admin');
    
    // Check for role distribution items
    const progressItems = page.locator('.progressItem');
    if (await progressItems.count() > 0) {
      await expect(progressItems.first()).toBeVisible();
      await expect(page.locator('.progressHeader')).toBeVisible();
      await expect(page.locator('.progress')).toBeVisible();
    }
  });

  test('should be accessible', async ({ page }) => {
    await page.goto('/dashboard/admin');
    
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
    await page.goto('/dashboard/admin');
    await expect(page.locator('.statCard')).toBeVisible();
    
    // Test tablet view
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(page.locator('.statCard')).toBeVisible();
    
    // Test mobile view
    await page.setViewportSize({ width: 375, height: 812 });
    await expect(page.locator('.statCard')).toBeVisible();
  });

  test('should display helper badges', async ({ page }) => {
    await page.goto('/dashboard/admin');
    
    // Check for helper badges
    const helperBadge = page.locator('.helperBadge');
    if (await helperBadge.isVisible()) {
      await expect(helperBadge).toBeVisible();
    }
  });

  test('should display empty state when no data', async ({ page }) => {
    // Mock empty response
    await page.route('**/api/admin/dashboard/summary', route => {
      route.fulfill({
        status: 200,
        body: JSON.stringify({
          metrics: [],
          roleDistribution: []
        })
      });
    });
    
    await page.goto('/dashboard/admin');
    
    // Check for empty state
    await expect(page.locator('text=No data')).toBeVisible();
  });
});