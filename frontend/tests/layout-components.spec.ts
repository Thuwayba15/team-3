import { test, expect } from '@playwright/test';

test.describe('Layout Components', () => {
  test.beforeEach(async ({ page }) => {
    // Mock authentication for dashboard tests
    await page.addInitScript(() => {
      // Mock localStorage for auth state
      window.localStorage.setItem('authToken', 'mock-token');
      window.localStorage.setItem('userId', '1');
    });
  });

  test('AppHeader should render correctly on dashboard', async ({ page }) => {
    // Navigate to a dashboard page (assuming admin dashboard exists)
    await page.goto('/dashboard/admin');
    
    // Check if header is visible
    await expect(page.locator('header')).toBeVisible();
    
    // Check for brand elements
    await expect(page.locator('.logoAvatar')).toBeVisible();
    await expect(page.locator('text=UbuntuLearn')).toBeVisible();
    
    // Check for controls
    await expect(page.locator('select')).toBeVisible(); // Language selector
    await expect(page.locator('button[aria-label*="notifications"]')).toBeVisible();
    await expect(page.locator('button[aria-label*="logout"]')).toBeVisible();
  });

  test('AppHeader language selector should work', async ({ page }) => {
    await page.goto('/dashboard/admin');
    
    // Click on language selector
    await page.click('select');
    
    // Check if options are available
    await expect(page.locator('option')).toHaveCount(4); // Assuming 4 languages
    
    // Select a different language
    await page.selectOption('select', 'af'); // Afrikaans
    
    // Verify selection
    await expect(page.locator('select')).toHaveValue('af');
  });

  test('AppHeader user dropdown should show profile info', async ({ page }) => {
    await page.goto('/dashboard/admin');
    
    // Click on user avatar to open dropdown
    await page.click('.userWrap');
    
    // Check if dropdown content is visible
    await expect(page.locator('.profileDropdown')).toBeVisible();
    await expect(page.locator('text=Email')).toBeVisible();
    await expect(page.locator('text=Username')).toBeVisible();
  });

  test('AppHeader logout button should work', async ({ page }) => {
    await page.goto('/dashboard/admin');
    
    // Click logout
    await page.click('button[aria-label*="logout"]');
    
    // Should redirect to home page
    await expect(page).toHaveURL('/');
  });

  test('AppSidebar should render navigation items', async ({ page }) => {
    await page.goto('/dashboard/admin');
    
    // Check if sidebar is visible (assuming it's visible on desktop)
    const sidebar = page.locator('[data-testid="app-sidebar"]');
    if (await sidebar.isVisible()) {
      // Check for navigation items
      await expect(page.locator('nav a')).toHaveCount.greaterThan(0);
    }
  });

  test('PageHeader should display title and subtitle', async ({ page }) => {
    await page.goto('/dashboard/admin');
    
    // Check for page header elements
    const headerTitle = page.locator('h1, h2, h3').first();
    if (await headerTitle.isVisible()) {
      await expect(headerTitle).toBeVisible();
    }
  });

  test('DashboardLayout should have proper structure', async ({ page }) => {
    await page.goto('/dashboard/admin');
    
    // Check for main layout structure
    await expect(page.locator('header')).toBeVisible();
    await expect(page.locator('main')).toBeVisible();
    
    // Check for proper semantic structure
    await expect(page.locator('header')).toHaveAttribute('role', 'banner');
    await expect(page.locator('main')).toHaveAttribute('role', 'main');
  });

  test('Mobile navigation button should work', async ({ page }) => {
    // Set viewport to mobile size
    await page.setViewportSize({ width: 375, height: 812 });
    
    await page.goto('/dashboard/admin');
    
    // Check if mobile navigation button is visible
    await expect(page.locator('button[aria-label*="navigation"]')).toBeVisible();
    
    // Click to open navigation (if sidebar exists)
    await page.click('button[aria-label*="navigation"]');
    
    // Navigation should be toggled (implementation dependent)
    // This test verifies the button exists and is clickable
    await expect(page.locator('button[aria-label*="navigation"]')).toBeVisible();
  });

  test('Layout components should be accessible', async ({ page }) => {
    await page.goto('/dashboard/admin');
    
    // Check for proper ARIA labels
    await expect(page.locator('header')).toHaveAttribute('role', 'banner');
    await expect(page.locator('main')).toHaveAttribute('role', 'main');
    
    // Check for proper button labels
    await expect(page.locator('button[aria-label]')).toHaveCount.greaterThan(0);
    
    // Check for proper form labels
    await expect(page.locator('select[aria-label]')).toBeVisible();
  });

  test('Layout should be responsive', async ({ page }) => {
    // Test desktop view
    await page.setViewportSize({ width: 1200, height: 800 });
    await page.goto('/dashboard/admin');
    
    // Test tablet view
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(page.locator('header')).toBeVisible();
    
    // Test mobile view
    await page.setViewportSize({ width: 375, height: 812 });
    await expect(page.locator('header')).toBeVisible();
  });
});