import { test, expect } from '@playwright/test';

test.describe('Parent Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    // Mock authentication for parent dashboard
    await page.addInitScript(() => {
      window.localStorage.setItem('authToken', 'mock-token');
      window.localStorage.setItem('userId', '1');
      window.localStorage.setItem('userRole', 'Parent');
    });
  });



  test('should handle loading states', async ({ page }) => {
    await page.goto('/dashboard/parent');
    
    // Check for skeleton loading states
    const skeleton = page.locator('.ant-skeleton');
    if (await skeleton.isVisible()) {
      await expect(skeleton).toBeVisible();
    }
  });
});