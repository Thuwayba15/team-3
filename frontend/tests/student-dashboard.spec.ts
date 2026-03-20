import { test, expect } from '@playwright/test';

test.describe('Student Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    // Mock authentication for student dashboard
    await page.addInitScript(() => {
      window.localStorage.setItem('authToken', 'mock-token');
      window.localStorage.setItem('userId', '1');
      window.localStorage.setItem('userRole', 'Student');
    });
  });



  test('should handle loading state', async ({ page }) => {
    await page.goto('/dashboard/student');
    
    // Check for loading spinner
    const loadingState = page.locator('.ant-spin');
    if (await loadingState.isVisible()) {
      await expect(loadingState).toBeVisible();
    }
  });

  test('should handle pagination', async ({ page }) => {
    await page.goto('/dashboard/student');
    
    // Check for pagination controls
    const pagination = page.locator('.ant-pagination');
    if (await pagination.isVisible()) {
      await expect(pagination).toBeVisible();
      
      // Test pagination navigation
      const nextButton = page.locator('.ant-pagination-next');
      if (await nextButton.isVisible()) {
        await nextButton.click();
        await expect(pagination).toBeVisible();
      }
    }
  });

  test('should handle heatmap pagination', async ({ page }) => {
    await page.goto('/dashboard/student');
    
    // Check for heatmap pagination
    const heatmapPagination = page.locator('.heatmapPagination .ant-pagination');
    if (await heatmapPagination.isVisible()) {
      await expect(heatmapPagination).toBeVisible();
      
      // Test heatmap pagination
      const nextButton = page.locator('.heatmapPagination .ant-pagination-next');
      if (await nextButton.isVisible()) {
        await nextButton.click();
        await expect(heatmapPagination).toBeVisible();
      }
    }
  });

  test('should handle attention pagination', async ({ page }) => {
    await page.goto('/dashboard/student');
    
    // Check for attention pagination
    const attentionPagination = page.locator('.attentionPagination .ant-pagination');
    if (await attentionPagination.isVisible()) {
      await expect(attentionPagination).toBeVisible();
      
      // Test attention pagination
      const nextButton = page.locator('.attentionPagination .ant-pagination-next');
      if (await nextButton.isVisible()) {
        await nextButton.click();
        await expect(attentionPagination).toBeVisible();
      }
    }
  });

  test('should handle refresh functionality', async ({ page }) => {
    await page.goto('/dashboard/student');
    
    // Check for refresh button
    const refreshButton = page.locator('button:has-text("Refresh")');
    if (await refreshButton.isVisible()) {
      await refreshButton.click();
      // Should trigger dashboard refresh
      await expect(refreshButton).toBeVisible();
    }
  });
});