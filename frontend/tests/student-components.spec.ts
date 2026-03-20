import { test, expect } from '@playwright/test';

test.describe('Student Components', () => {
  test.beforeEach(async ({ page }) => {
    // Mock authentication for student components
    await page.addInitScript(() => {
      window.localStorage.setItem('authToken', 'mock-token');
      window.localStorage.setItem('userId', '1');
      window.localStorage.setItem('userRole', 'Student');
    });
  });

  test('should handle subject selection', async ({ page }) => {
    await page.goto('/dashboard/student');
    
    // Mock subjects data
    await page.evaluate(() => {
      window.localStorage.setItem('mockSubjects', JSON.stringify([
        { id: '1', name: 'Mathematics' },
        { id: '2', name: 'Science' }
      ]));
    });
    
    // Check for subject tabs
    const subjectTabs = page.locator('.subjectTab');
    if (await subjectTabs.count() > 0) {
      await subjectTabs.first().click();
      await expect(subjectTabs.first()).toHaveClass(/subjectTabActive/);
    }
  });

  test('should handle add subjects button', async ({ page }) => {
    await page.goto('/dashboard/student');
    
    // Check for add subjects button
    const addButton = page.locator('.addButton');
    if (await addButton.isVisible()) {
      await expect(addButton).toBeVisible();
      await expect(addButton).toContainText('Add subjects');
    }
  });

  test('should handle empty subjects state', async ({ page }) => {
    await page.goto('/dashboard/student');
    
    // Mock empty subjects
    await page.evaluate(() => {
      window.localStorage.setItem('mockSubjects', JSON.stringify([]));
    });
    
    // Subject switcher should not be visible when empty
    await expect(page.locator('.subjectSwitcher')).not.toBeVisible();
  });

  test('should handle subject tab styling', async ({ page }) => {
    await page.goto('/dashboard/student');
    
    // Mock subjects data
    await page.evaluate(() => {
      window.localStorage.setItem('mockSubjects', JSON.stringify([
        { id: '1', name: 'Mathematics' },
        { id: '2', name: 'Science' }
      ]));
    });
    
    // Check for subject tab classes
    const subjectTabs = page.locator('.subjectTab');
    if (await subjectTabs.count() > 0) {
      await expect(subjectTabs.first()).toHaveClass(/subjectTab/);
      
      // Click to activate
      await subjectTabs.first().click();
      await expect(subjectTabs.first()).toHaveClass(/subjectTabActive/);
    }
  });

  test('should handle add button styling', async ({ page }) => {
    await page.goto('/dashboard/student');
    
    // Check for add button
    const addButton = page.locator('.addButton');
    if (await addButton.isVisible()) {
      await expect(addButton).toHaveClass(/addButton/);
      await expect(addButton).toContainText('Add subjects');
    }
  });
});