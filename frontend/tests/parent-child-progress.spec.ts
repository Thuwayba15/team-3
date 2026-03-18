import { test, expect } from '@playwright/test';

test.describe('Parent Child Progress', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/parent/child-progress');
    });

    test('has correct URL', async ({ page }) => {
        await expect(page).toHaveURL('/parent/child-progress');
    });

    test('renders page heading and subtitle', async ({ page }) => {
        await expect(page.getByRole('heading', { name: 'Child Progress Details' })).toBeVisible();
        await expect(page.getByText('Detailed academic overview for Thabo Mokoena')).toBeVisible();
    });

    test('renders child profile card', async ({ page }) => {
        await expect(page.getByText('Thabo Mokoena')).toBeVisible();
        await expect(page.getByText(/Grade 10/)).toBeVisible();
        await expect(page.getByText('Ubuntu High School')).toBeVisible();
    });

    test('renders all four subject cards', async ({ page }) => {
        await expect(page.getByText('Mathematics')).toBeVisible();
        await expect(page.getByText('Physical Sciences')).toBeVisible();
        await expect(page.getByText('Life Sciences')).toBeVisible();
        await expect(page.getByText('English')).toBeVisible();
    });

    test('renders subject percentages', async ({ page }) => {
        await expect(page.getByText('82%').first()).toBeVisible();
        await expect(page.getByText('75%').first()).toBeVisible();
        await expect(page.getByText('60%').first()).toBeVisible();
        await expect(page.getByText('88%').first()).toBeVisible();
    });

    test('renders topic rows inside subject cards', async ({ page }) => {
        await expect(page.getByText('Algebraic Expressions')).toBeVisible();
        await expect(page.getByText('Cell Structure')).toBeVisible();
        await expect(page.getByText('Comprehension')).toBeVisible();
        await expect(page.getByText('Mechanics')).toBeVisible();
    });

    test('renders View Details buttons', async ({ page }) => {
        const buttons = page.getByRole('button', { name: 'View Details' });
        await expect(buttons).toHaveCount(4);
    });

    test('renders Topic Mastery Overview section', async ({ page }) => {
        await expect(page.getByText('Topic Mastery Overview')).toBeVisible();
        await expect(page.getByText('Color-coded mastery levels across all subjects')).toBeVisible();
        await expect(page.getByText('Algebraic Expr')).toBeVisible();
        await expect(page.getByText('Literature')).toBeVisible();
    });

    test('renders Recent Assessment Results section', async ({ page }) => {
        await expect(page.getByText('Recent Assessment Results')).toBeVisible();
        await expect(page.getByText('Mathematics Quiz')).toBeVisible();
        await expect(page.getByText('Life Sciences Test')).toBeVisible();
        await expect(page.getByText('English Assignment')).toBeVisible();
        await expect(page.getByText('Physical Sciences Quiz')).toBeVisible();
    });

    test('renders Learning Activity section', async ({ page }) => {
        await expect(page.getByText('Learning Activity')).toBeVisible();
        await expect(page.getByText('Completed Quiz: Exponents')).toBeVisible();
        await expect(page.getByText('Used AI Tutor for Life Sciences')).toBeVisible();
        await expect(page.getByText('Started Lesson: Cell Structure')).toBeVisible();
        await expect(page.getByText('Completed Module: Algebraic Expressions')).toBeVisible();
    });
});
