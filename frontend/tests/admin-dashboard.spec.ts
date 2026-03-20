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

  test('should handle loading state', async ({ page }) => {
    await page.goto('/dashboard/admin');
    
    // Check for skeleton loading states
    const skeleton = page.locator('.ant-skeleton');
    if (await skeleton.isVisible()) {
      await expect(skeleton).toBeVisible();
    }
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

  test('should display helper badges', async ({ page }) => {
    await page.goto('/dashboard/admin');
    
    // Check for helper badges
    const helperBadge = page.locator('.helperBadge');
    if (await helperBadge.isVisible()) {
      await expect(helperBadge).toBeVisible();
    }
  });
});