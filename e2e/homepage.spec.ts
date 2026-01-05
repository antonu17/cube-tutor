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
    
    // Check for navigation links
    await expect(page.getByRole('link', { name: /home/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /methods/i })).toBeVisible();
  });

  test('should navigate to methods page', async ({ page }) => {
    await page.goto('/');
    
    // Click on methods link
    await page.getByRole('link', { name: /methods/i }).click();
    
    // Should navigate to methods page
    await expect(page).toHaveURL('/methods');
  });
});
