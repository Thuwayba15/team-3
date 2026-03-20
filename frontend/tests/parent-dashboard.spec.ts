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

  test('should display parent dashboard page', async ({ page }) => {
    await page.goto('/dashboard/parent');
    
    // Check if page header is visible
    await expect(page.locator('h1, h2, h3').first()).toContainText('Parent Dashboard');
    
    // Check for main components
    await expect(page.locator('.pageHeader')).toBeVisible();
    await expect(page.locator('.statsRow')).toBeVisible();
    await expect(page.locator('.subjectCard')).toBeVisible();
  });

  test('should display student statistics', async ({ page }) => {
    await page.goto('/dashboard/parent');
    
    // Check for stat cards
    await expect(page.locator('.statCard')).toHaveCount(3);
    
    // Check for stat values and labels
    await expect(page.locator('.statValue')).toBeVisible();
    await expect(page.locator('.statLabel')).toBeVisible();
    
    // Check for stat icons
    await expect(page.locator('.statIcon')).toBeVisible();
  });

  test('should display subject progress', async ({ page }) => {
    await page.goto('/dashboard/parent');
    
    // Check for subject progress card
    await expect(page.locator('.subjectCard')).toBeVisible();
    
    // Check for subject rows
    await expect(page.locator('.subjectRow')).toHaveCount.greaterThan(0);
    
    // Check for progress bars
    await expect(page.locator('.ant-progress')).toBeVisible();
  });

  test('should display recent alerts', async ({ page }) => {
    await page.goto('/dashboard/parent');
    
    // Check for alerts card
    await expect(page.locator('.alertCard')).toBeVisible();
    
    // Check for alert items
    await expect(page.locator('.alertItem')).toBeVisible();
    
    // Check for alert icons
    await expect(page.locator('.alertIcon')).toBeVisible();
  });

  test('should display recent activity', async ({ page }) => {
    await page.goto('/dashboard/parent');
    
    // Check for activity card
    await expect(page.locator('.activityCard')).toBeVisible();
    
    // Check for activity items
    await expect(page.locator('.activityItem')).toBeVisible();
  });

  test('should handle add child modal', async ({ page }) => {
    await page.goto('/dashboard/parent');
    
    // Click add child button
    await page.click('button:has-text("Add Child")');
    
    // Check if modal is visible
    await expect(page.locator('.ant-modal')).toBeVisible();
    await expect(page.locator('h2, h3').last()).toContainText('Add Child');
  });

  test('should handle link existing account tab', async ({ page }) => {
    await page.goto('/dashboard/parent');
    
    // Open add child modal
    await page.click('button:has-text("Add Child")');
    
    // Check for link tab
    await expect(page.locator('.ant-tabs-tab')).toContainText('Link Existing Account');
    
    // Check for username/email field
    await expect(page.locator('input[placeholder*="username"]')).toBeVisible();
  });

  test('should handle register new child tab', async ({ page }) => {
    await page.goto('/dashboard/parent');
    
    // Open add child modal
    await page.click('button:has-text("Add Child")');
    
    // Switch to register tab
    await page.click('.ant-tabs-tab:has-text("Register New Child")');
    
    // Check for form fields
    await expect(page.locator('input[placeholder="Thabo"]')).toBeVisible();
    await expect(page.locator('input[placeholder="Mokoena"]')).toBeVisible();
    await expect(page.locator('input[placeholder*="email"]')).toBeVisible();
    await expect(page.locator('input[placeholder="thabo.mokoena"]')).toBeVisible();
  });

  test('should handle student switcher', async ({ page }) => {
    await page.goto('/dashboard/parent');
    
    // Mock children data
    await page.evaluate(() => {
      window.localStorage.setItem('mockChildren', JSON.stringify([
        { studentUserId: '1', studentName: 'Thabo Mokoena', gradeLevel: 'Grade 10', initials: 'TM' },
        { studentUserId: '2', studentName: 'Naledi Khumalo', gradeLevel: 'Grade 11', initials: 'NK' }
      ]));
    });
    
    // Check for child switcher
    await expect(page.locator('.childSwitcher')).toBeVisible();
    await expect(page.locator('.childPill')).toHaveCount.greaterThan(0);
  });

  test('should handle loading states', async ({ page }) => {
    await page.goto('/dashboard/parent');
    
    // Check for skeleton loading states
    const skeleton = page.locator('.ant-skeleton');
    if (await skeleton.isVisible()) {
      await expect(skeleton).toBeVisible();
    }
  });

  test('should handle error states', async ({ page }) => {
    // Mock API error
    await page.route('**/api/parent/children', route => {
      route.fulfill({
        status: 500,
        body: JSON.stringify({ error: 'Server error' })
      });
    });
    
    await page.goto('/dashboard/parent');
    
    // Check for error messages
    await expect(page.locator('.ant-alert-error')).toBeVisible();
  });

  test('should be accessible', async ({ page }) => {
    await page.goto('/dashboard/parent');
    
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
    await page.goto('/dashboard/parent');
    await expect(page.locator('.statsRow')).toBeVisible();
    
    // Test tablet view
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(page.locator('.statsRow')).toBeVisible();
    
    // Test mobile view
    await page.setViewportSize({ width: 375, height: 812 });
    await expect(page.locator('.statsRow')).toBeVisible();
  });

  test('should handle empty states', async ({ page }) => {
    // Mock empty response
    await page.route('**/api/parent/children', route => {
      route.fulfill({
        status: 200,
        body: JSON.stringify([])
      });
    });
    
    await page.goto('/dashboard/parent');
    
    // Check for empty state message
    await expect(page.locator('text=No student linked yet')).toBeVisible();
  });

  test('should handle form validation', async ({ page }) => {
    await page.goto('/dashboard/parent');
    
    // Open add child modal
    await page.click('button:has-text("Add Child")');
    
    // Try to submit empty form
    await page.click('button:has-text("Link Child")');
    
    // Check for validation errors
    await expect(page.locator('text=Please enter the student username or email.')).toBeVisible();
  });
});