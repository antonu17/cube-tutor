import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('should load the homepage', async ({ page }) => {
    await page.goto('/');
    
    // Check page title
    await expect(page).toHaveTitle(/Cube Tutor/);
    
    // Check main heading
    await expect(page.getByRole('heading', { name: /Cube Tutor/i })).toBeVisible();
  });

  test('should display navigation', async ({ page }) => {
    await page.goto('/');
    
    // Check for navigation links (use exact names to avoid ambiguity)
    await expect(page.getByRole('link', { name: 'Puzzles', exact: true })).toBeVisible();
    await expect(page.getByRole('link', { name: 'About', exact: true })).toBeVisible();
  });

  test('should navigate to puzzles page', async ({ page }) => {
    await page.goto('/');
    
    // Click on "Browse Puzzles" button on homepage (more specific than nav link)
    await page.getByRole('link', { name: 'Browse Puzzles' }).click();
    
    // Should navigate to puzzles page
    await expect(page).toHaveURL('/puzzles');
  });

  test('should navigate through full user flow', async ({ page }) => {
    await page.goto('/');
    
    // Navigate to puzzles using nav link (be specific)
    await page.getByRole('link', { name: 'Puzzles', exact: true }).click();
    await expect(page).toHaveURL('/puzzles');
    
    // Click on 3x3x3 puzzle - the whole card is a link
    await page.getByRole('link').filter({ hasText: '3×3×3' }).click();
    await page.waitForURL('**/puzzles/3x3x3');
    await expect(page.url()).toContain('/puzzles/3x3x3');
    
    // Click on CFOP method
    await page.getByRole('link').filter({ hasText: 'CFOP' }).first().click();
    await page.waitForURL('**/puzzles/3x3x3/cfop');
    await expect(page.url()).toContain('/puzzles/3x3x3/cfop');
  });
});
