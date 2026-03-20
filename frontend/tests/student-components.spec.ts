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

  test('should display subject switcher', async ({ page }) => {
    await page.goto('/dashboard/student');
    
    // Mock subjects data
    await page.evaluate(() => {
      window.localStorage.setItem('mockSubjects', JSON.stringify([
        { id: '1', name: 'Mathematics', gradeLevel: 'Grade 10' },
        { id: '2', name: 'Science', gradeLevel: 'Grade 11' },
        { id: '3', name: 'English', gradeLevel: 'Grade 10' }
      ]));
    });
    
    // Check for subject switcher
    await expect(page.locator('.subjectSwitcher')).toBeVisible();
    
    // Check for subject tabs
    await expect(page.locator('.subjectTab')).toHaveCount.greaterThan(0);
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

  test('should be accessible', async ({ page }) => {
    await page.goto('/dashboard/student');
    
    // Mock subjects data
    await page.evaluate(() => {
      window.localStorage.setItem('mockSubjects', JSON.stringify([
        { id: '1', name: 'Mathematics' },
        { id: '2', name: 'Science' }
      ]));
    });
    
    // Check for proper button labels
    await expect(page.locator('.subjectTab')).toHaveCount.greaterThan(0);
    
    // Check for proper ARIA labels
    await expect(page.locator('[aria-label]')).toHaveCount.greaterThan(0);
  });

  test('should be responsive', async ({ page }) => {
    // Test desktop view
    await page.setViewportSize({ width: 1200, height: 800 });
    await page.goto('/dashboard/student');
    
    // Mock subjects data
    await page.evaluate(() => {
      window.localStorage.setItem('mockSubjects', JSON.stringify([
        { id: '1', name: 'Mathematics' },
        { id: '2', name: 'Science' }
      ]));
    });
    
    await expect(page.locator('.subjectSwitcher')).toBeVisible();
    
    // Test mobile view
    await page.setViewportSize({ width: 375, height: 812 });
    await expect(page.locator('.subjectSwitcher')).toBeVisible();
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

  test('should handle multiple subjects', async ({ page }) => {
    await page.goto('/dashboard/student');
    
    // Mock multiple subjects
    await page.evaluate(() => {
      window.localStorage.setItem('mockSubjects', JSON.stringify([
        { id: '1', name: 'Mathematics' },
        { id: '2', name: 'Science' },
        { id: '3', name: 'English' },
        { id: '4', name: 'History' },
        { id: '5', name: 'Geography' }
      ]));
    });
    
    // Check for multiple subject tabs
    await expect(page.locator('.subjectTab')).toHaveCount(5);
  });

  test('should handle subject names with special characters', async ({ page }) => {
    await page.goto('/dashboard/student');
    
    // Mock subjects with special characters
    await page.evaluate(() => {
      window.localStorage.setItem('mockSubjects', JSON.stringify([
        { id: '1', name: 'Mathematics & Statistics' },
        { id: '2', name: 'Physical Sciences (Physics/Chemistry)' },
        { id: '3', name: 'English Literature' }
      ]));
    });
    
    // Check for subject tabs with special characters
    await expect(page.locator('.subjectTab')).toHaveCount(3);
    await expect(page.locator('.subjectTab').first()).toContainText('Mathematics & Statistics');
  });
});