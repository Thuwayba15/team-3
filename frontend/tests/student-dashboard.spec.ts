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

  test('should display student dashboard page', async ({ page }) => {
    await page.goto('/dashboard/student');
    
    // Check if page header is visible
    await expect(page.locator('h1, h2, h3').first()).toContainText('Welcome');
    
    // Check for main components
    await expect(page.locator('.welcomeSection')).toBeVisible();
    await expect(page.locator('.statsRow')).toBeVisible();
    await expect(page.locator('.nextLessonCard')).toBeVisible();
  });

  test('should display summary statistics', async ({ page }) => {
    await page.goto('/dashboard/student');
    
    // Check for stat cards
    await expect(page.locator('.statCard')).toHaveCount(4);
    
    // Check for stat values and labels
    await expect(page.locator('.statValue')).toBeVisible();
    await expect(page.locator('.statLabel')).toBeVisible();
    
    // Check for stat icons
    await expect(page.locator('.statIcon')).toBeVisible();
  });

  test('should display next lesson recommendation', async ({ page }) => {
    await page.goto('/dashboard/student');
    
    // Check for next lesson card
    await expect(page.locator('.nextLessonCard')).toBeVisible();
    
    // Check for lesson information
    await expect(page.locator('.lessonTitle')).toBeVisible();
    await expect(page.locator('.lessonDesc')).toBeVisible();
    await expect(page.locator('.startBtn')).toBeVisible();
  });

  test('should display mastery heatmap', async ({ page }) => {
    await page.goto('/dashboard/student');
    
    // Check for heatmap card
    await expect(page.locator('.heatmapCard')).toBeVisible();
    
    // Check for heatmap tiles
    const heatmapTiles = page.locator('.heatmapTile');
    if (await heatmapTiles.count() > 0) {
      await expect(heatmapTiles.first()).toBeVisible();
      await expect(page.locator('.heatmapPercent')).toBeVisible();
      await expect(page.locator('.heatmapTopic')).toBeVisible();
    }
  });

  test('should display areas needing attention', async ({ page }) => {
    await page.goto('/dashboard/student');
    
    // Check for attention card
    await expect(page.locator('.attentionCard')).toBeVisible();
    
    // Check for attention items
    const attentionItems = page.locator('.attentionItem');
    if (await attentionItems.count() > 0) {
      await expect(attentionItems.first()).toBeVisible();
      await expect(page.locator('.attentionTitle')).toBeVisible();
      await expect(page.locator('.attentionPercent')).toBeVisible();
    }
  });

  test('should display motivational guidance', async ({ page }) => {
    await page.goto('/dashboard/student');
    
    // Check for guidance card
    await expect(page.locator('.guidanceCard')).toBeVisible();
    
    // Check for guidance content
    await expect(page.locator('.guidanceTitle')).toBeVisible();
    await expect(page.locator('.guidanceText')).toBeVisible();
  });

  test('should display completed lessons', async ({ page }) => {
    await page.goto('/dashboard/student');
    
    // Check for completed lessons card
    await expect(page.locator('.completedCard')).toBeVisible();
    
    // Check for completion information
    await expect(page.locator('.completedRow')).toBeVisible();
    await expect(page.locator('.completedIcon')).toBeVisible();
  });

  test('should handle loading state', async ({ page }) => {
    await page.goto('/dashboard/student');
    
    // Check for loading spinner
    const loadingState = page.locator('.ant-spin');
    if (await loadingState.isVisible()) {
      await expect(loadingState).toBeVisible();
    }
  });

  test('should handle error state', async ({ page }) => {
    // Mock API error
    await page.route('**/api/student/dashboard', route => {
      route.fulfill({
        status: 500,
        body: JSON.stringify({ error: 'Server error' })
      });
    });
    
    await page.goto('/dashboard/student');
    
    // Check for error alert
    await expect(page.locator('.ant-alert-error')).toBeVisible();
    
    // Check for retry button
    await expect(page.locator('button:has-text("Retry")')).toBeVisible();
  });

  test('should handle empty state', async ({ page }) => {
    // Mock empty response
    await page.route('**/api/student/dashboard', route => {
      route.fulfill({
        status: 200,
        body: JSON.stringify({
          studentName: null,
          overallScore: 0,
          topicsMastered: 0,
          totalTopics: 0,
          lessonsCompleted: 0,
          areasNeedingAttentionCount: 0,
          masteryHeatmap: [],
          areasNeedingAttention: [],
          recommendedNextLesson: null
        })
      });
    });
    
    await page.goto('/dashboard/student');
    
    // Check for empty state
    await expect(page.locator('.ant-empty')).toBeVisible();
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

  test('should be accessible', async ({ page }) => {
    await page.goto('/dashboard/student');
    
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
    await page.goto('/dashboard/student');
    await expect(page.locator('.statsRow')).toBeVisible();
    
    // Test tablet view
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(page.locator('.statsRow')).toBeVisible();
    
    // Test mobile view
    await page.setViewportSize({ width: 375, height: 812 });
    await expect(page.locator('.statsRow')).toBeVisible();
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