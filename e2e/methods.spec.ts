import { test, expect } from '@playwright/test';

test.describe('Puzzle Selection Page', () => {
  test('should display puzzles', async ({ page }) => {
    await page.goto('/puzzles');
    
    // Check for 3x3x3 puzzle (use first() since text appears in multiple places)
    await expect(page.getByText(/3×3×3/i).first()).toBeVisible();
  });

  test('should navigate to puzzle page', async ({ page }) => {
    await page.goto('/puzzles');
    
    // Click on 3x3x3 puzzle card
    await page.getByRole('link').filter({ hasText: '3×3×3' }).click();
    
    // Should navigate to puzzle page
    await page.waitForURL('**/puzzles/3x3x3');
    await expect(page).toHaveURL('/puzzles/3x3x3');
  });
});

test.describe('Algorithm Set Page', () => {
  test('should display algorithm sets grouped by origin', async ({ page }) => {
    await page.goto('/puzzles/3x3x3');
    
    // Check for CFOP and Beginner groups (use first() for multiple matches)
    await expect(page.getByText(/CFOP/i).first()).toBeVisible();
    await expect(page.getByText(/Beginner/i).first()).toBeVisible();
  });

  test('should display algorithm sets', async ({ page }) => {
    await page.goto('/puzzles/3x3x3');
    
    // Check for algorithm sets (use first() for multiple matches)
    await expect(page.getByText(/Cross/i).first()).toBeVisible();
    await expect(page.getByText(/F2L/i).first()).toBeVisible();
    await expect(page.getByText(/OLL/i).first()).toBeVisible();
    await expect(page.getByText(/PLL/i).first()).toBeVisible();
  });

  test('should navigate to OLL algorithm set', async ({ page }) => {
    await page.goto('/puzzles/3x3x3');
    
    // Click on OLL algorithm set card
    await page.getByRole('link').filter({ hasText: 'OLL' }).first().click();
    
    // Should navigate to OLL page
    await page.waitForURL('**/puzzles/3x3x3/oll');
    await expect(page).toHaveURL('/puzzles/3x3x3/oll');
  });

  test('should navigate to PLL algorithm set', async ({ page }) => {
    await page.goto('/puzzles/3x3x3');
    
    // Click on PLL algorithm set card
    await page.getByRole('link').filter({ hasText: 'PLL' }).first().click();
    
    // Should navigate to PLL page
    await page.waitForURL('**/puzzles/3x3x3/pll');
    await expect(page).toHaveURL('/puzzles/3x3x3/pll');
  });
});
