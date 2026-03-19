import { test, expect } from '@playwright/test';

test.describe.skip('Parent Dashboard', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/parent/dashboard');
    });

    test('has correct URL', async ({ page }) => {
        await expect(page).toHaveURL('/parent/dashboard');
    });

    test('renders page heading and subtitle', async ({ page }) => {
        await expect(page.getByRole('heading', { name: 'Parent Dashboard' })).toBeVisible();
        await expect(page.getByText('Monitoring progress for Thabo Mokoena')).toBeVisible();
    });

    test('renders child badge', async ({ page }) => {
        await expect(page.getByText('Thabo (Grade 10)')).toBeVisible();
    });

    test('renders all three stat cards', async ({ page }) => {
        await expect(page.getByText('Overall Average')).toBeVisible();
        await expect(page.getByText('Lessons Completed')).toBeVisible();
        await expect(page.getByText('Time Spent (This Week)')).toBeVisible();
    });

    test('renders stat card values', async ({ page }) => {
        await expect(page.getByText('78%')).toBeVisible();
        await expect(page.getByText('24')).toBeVisible();
        await expect(page.getByText('4h 15m')).toBeVisible();
    });

    test('renders good standing badge', async ({ page }) => {
        await expect(page.getByText('Good standing')).toBeVisible();
    });

    test('renders subject progress section with all subjects', async ({ page }) => {
        await expect(page.getByText('Subject Progress')).toBeVisible();
        await expect(page.getByText('Mathematics')).toBeVisible();
        await expect(page.getByText('Physical Sciences')).toBeVisible();
        await expect(page.getByText('Life Sciences')).toBeVisible();
        await expect(page.getByText('English')).toBeVisible();
    });

    test('renders recent alerts section', async ({ page }) => {
        await expect(page.getByText('Recent Alerts')).toBeVisible();
        await expect(page.getByText('Struggling with Life Sciences')).toBeVisible();
        await expect(page.getByRole('button', { name: 'View Details' })).toBeVisible();
    });

    test('renders recent activity section', async ({ page }) => {
        await expect(page.getByText('Recent Activity')).toBeVisible();
        await expect(page.getByText('Completed Math Quiz')).toBeVisible();
        await expect(page.getByText('Chatted with AI Tutor')).toBeVisible();
    });
});
