import { test, expect } from '@playwright/test';

test.describe.skip('Parent Alerts', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/parent/alerts');
    });

    test('has correct URL', async ({ page }) => {
        await expect(page).toHaveURL('/parent/alerts');
    });

    test('renders page heading and subtitle', async ({ page }) => {
        await expect(page.getByRole('heading', { name: 'Alerts & Notifications' })).toBeVisible();
        await expect(page.getByText("Stay updated on Thabo's learning journey")).toBeVisible();
    });

    test('renders filter tabs', async ({ page }) => {
        await expect(page.getByRole('button', { name: 'All' })).toBeVisible();
        await expect(page.getByRole('button', { name: 'Academic' })).toBeVisible();
        await expect(page.getByRole('button', { name: 'Activity' })).toBeVisible();
        await expect(page.getByRole('button', { name: 'System' })).toBeVisible();
    });

    test('renders all alert titles by default', async ({ page }) => {
        await expect(page.getByText('Low Quiz Score')).toBeVisible();
        await expect(page.getByText('Missed Study Session')).toBeVisible();
        await expect(page.getByText('Achievement Unlocked')).toBeVisible();
        await expect(page.getByText('Intervention Recommended')).toBeVisible();
        await expect(page.getByText('New Module Available')).toBeVisible();
        await expect(page.getByText('Quiz Passed')).toBeVisible();
        await expect(page.getByText('Study Reminder')).toBeVisible();
    });

    test('renders alert descriptions', async ({ page }) => {
        await expect(page.getByText(/Thabo scored 38%/)).toBeVisible();
        await expect(page.getByText(/Thabo hasn't logged in/)).toBeVisible();
        await expect(page.getByText('Thabo mastered Algebraic Expressions!')).toBeVisible();
    });

    test('renders View Details and Dismiss action links', async ({ page }) => {
        await expect(page.getByRole('button', { name: 'View Details' }).first()).toBeVisible();
        await expect(page.getByRole('button', { name: 'Dismiss' }).first()).toBeVisible();
    });

    test('filters to Academic tab', async ({ page }) => {
        await page.getByRole('button', { name: 'Academic' }).click();
        await expect(page.getByText('Low Quiz Score')).toBeVisible();
        await expect(page.getByText('Achievement Unlocked')).toBeVisible();
        await expect(page.getByText('Missed Study Session')).not.toBeVisible();
        await expect(page.getByText('New Module Available')).not.toBeVisible();
    });

    test('filters to System tab', async ({ page }) => {
        await page.getByRole('button', { name: 'System' }).click();
        await expect(page.getByText('New Module Available')).toBeVisible();
        await expect(page.getByText('Low Quiz Score')).not.toBeVisible();
    });

    test('dismiss removes an alert', async ({ page }) => {
        await expect(page.getByText('Missed Study Session')).toBeVisible();
        await page.getByRole('button', { name: 'Dismiss' }).first().click();
        await expect(page.getByText('Missed Study Session')).not.toBeVisible();
    });
});
