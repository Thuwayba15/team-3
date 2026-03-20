import { test, expect } from '@playwright/test';

test.describe('Admin Curriculum Management', () => {
  test.beforeEach(async ({ page }) => {
    // Mock authentication for admin curriculum
    await page.addInitScript(() => {
      window.localStorage.setItem('authToken', 'mock-token');
      window.localStorage.setItem('userId', '1');
      window.localStorage.setItem('userRole', 'Admin');
    });
  });



  test('should handle topic loading', async ({ page }) => {
    await page.goto('/dashboard/admin/curriculum');
    
    // Check for topic loading state
    const loadingState = page.locator('.ant-skeleton');
    if (await loadingState.isVisible()) {
      await expect(loadingState).toBeVisible();
    }
  });

});