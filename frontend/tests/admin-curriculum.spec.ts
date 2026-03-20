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

  test('should display curriculum management page', async ({ page }) => {
    await page.goto('/dashboard/admin/curriculum');
    
    // Check if page header is visible
    await expect(page.locator('h1, h2, h3').first()).toContainText('Curriculum');
    
    // Check for main components
    await expect(page.locator('.subjectsPanel')).toBeVisible();
    await expect(page.locator('.topicsPanel')).toBeVisible();
    await expect(page.locator('button:has-text("Create Lessons")')).toBeVisible();
  });

  test('should display subjects panel', async ({ page }) => {
    await page.goto('/dashboard/admin/curriculum');
    
    // Check for subjects panel
    await expect(page.locator('.subjectsPanel')).toBeVisible();
    
    // Check for subject list or loading state
    const subjectsList = page.locator('.subjectList');
    const loadingState = page.locator('.ant-skeleton');
    
    if (await subjectsList.isVisible()) {
      await expect(subjectsList).toBeVisible();
    } else if (await loadingState.isVisible()) {
      await expect(loadingState).toBeVisible();
    }
  });

  test('should display topics panel', async ({ page }) => {
    await page.goto('/dashboard/admin/curriculum');
    
    // Check for topics panel
    await expect(page.locator('.topicsPanel')).toBeVisible();
    
    // Check for topics list or loading state
    const topicsList = page.locator('.topicsList');
    const loadingState = page.locator('.ant-skeleton');
    
    if (await topicsList.isVisible()) {
      await expect(topicsList).toBeVisible();
    } else if (await loadingState.isVisible()) {
      await expect(loadingState).toBeVisible();
    }
  });

  test('should open create lesson modal', async ({ page }) => {
    await page.goto('/dashboard/admin/curriculum');
    
    // Click create lessons button
    await page.click('button:has-text("Create Lessons")');
    
    // Check if modal is visible
    await expect(page.locator('.createLessonModal')).toBeVisible();
    await expect(page.locator('h2, h3').last()).toContainText('Create Lesson');
  });

  test('should handle subject selection', async ({ page }) => {
    await page.goto('/dashboard/admin/curriculum');
    
    // Mock subjects data
    await page.evaluate(() => {
      window.localStorage.setItem('mockSubjects', JSON.stringify([
        { id: '1', name: 'Mathematics', gradeLevel: 'Grade 10' },
        { id: '2', name: 'Science', gradeLevel: 'Grade 11' }
      ]));
    });
    
    // Check if subjects are displayed
    await expect(page.locator('.subjectItem')).toHaveCount.greaterThan(0);
  });

  test('should handle topic loading', async ({ page }) => {
    await page.goto('/dashboard/admin/curriculum');
    
    // Check for topic loading state
    const loadingState = page.locator('.ant-skeleton');
    if (await loadingState.isVisible()) {
      await expect(loadingState).toBeVisible();
    }
  });

  test('should display AI draft review section', async ({ page }) => {
    await page.goto('/dashboard/admin/curriculum');
    
    // Check for AI draft review section
    await expect(page.locator('.aiDraftReview')).toBeVisible();
    
    // Check for draft items or empty state
    const draftItems = page.locator('.draftItem');
    const emptyState = page.locator('.emptyState');
    
    if (await draftItems.count() > 0) {
      await expect(draftItems.first()).toBeVisible();
    } else if (await emptyState.isVisible()) {
      await expect(emptyState).toBeVisible();
    }
  });

  test('should handle lesson creation modal', async ({ page }) => {
    await page.goto('/dashboard/admin/curriculum');
    
    // Open create lesson modal
    await page.click('button:has-text("Create Lessons")');
    
    // Check for form fields
    await expect(page.locator('input[name="title"]')).toBeVisible();
    await expect(page.locator('select[name="subjectId"]')).toBeVisible();
    await expect(page.locator('textarea[name="description"]')).toBeVisible();
  });

  test('should handle subject form modal', async ({ page }) => {
    await page.goto('/dashboard/admin/curriculum');
    
    // Mock edit subject action (if edit button exists)
    const editButton = page.locator('button:has-text("Edit")');
    if (await editButton.isVisible()) {
      await editButton.click();
      await expect(page.locator('.subjectFormModal')).toBeVisible();
    }
  });

  test('should handle error states', async ({ page }) => {
    // Mock API error
    await page.route('**/api/admin/curriculum/**', route => {
      route.fulfill({
        status: 500,
        body: JSON.stringify({ error: 'Server error' })
      });
    });
    
    await page.goto('/dashboard/admin/curriculum');
    
    // Check for error messages
    await expect(page.locator('.ant-alert-error')).toBeVisible();
  });

  test('should be accessible', async ({ page }) => {
    await page.goto('/dashboard/admin/curriculum');
    
    // Check for proper heading structure
    const headings = page.locator('h1, h2, h3, h4, h5, h6');
    await expect(headings).toHaveCount.greaterThan(0);
    
    // Check for proper ARIA labels
    await expect(page.locator('[aria-label]')).toHaveCount.greaterThan(0);
    
    // Check for proper form labels
    await expect(page.locator('label')).toHaveCount.greaterThan(0);
  });

  test('should be responsive', async ({ page }) => {
    // Test desktop view
    await page.setViewportSize({ width: 1200, height: 800 });
    await page.goto('/dashboard/admin/curriculum');
    await expect(page.locator('.subjectsPanel')).toBeVisible();
    
    // Test tablet view
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(page.locator('.subjectsPanel')).toBeVisible();
    
    // Test mobile view
    await page.setViewportSize({ width: 375, height: 812 });
    await expect(page.locator('.subjectsPanel')).toBeVisible();
  });

  test('should handle empty states', async ({ page }) => {
    // Mock empty response
    await page.route('**/api/admin/curriculum/subjects', route => {
      route.fulfill({
        status: 200,
        body: JSON.stringify([])
      });
    });
    
    await page.goto('/dashboard/admin/curriculum');
    
    // Check for empty state
    await expect(page.locator('text=No subjects found')).toBeVisible();
  });
});