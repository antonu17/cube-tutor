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

test.describe('Method Selection Page', () => {
  test('should display available methods', async ({ page }) => {
    await page.goto('/puzzles/3x3x3');
    
    // Check for CFOP and Beginner methods (use first() for multiple matches)
    await expect(page.getByText(/CFOP/i).first()).toBeVisible();
    await expect(page.getByText(/Beginner/i).first()).toBeVisible();
  });

  test('should navigate to CFOP method page', async ({ page }) => {
    await page.goto('/puzzles/3x3x3');
    
    // Click on CFOP method card
    await page.getByRole('link').filter({ hasText: 'CFOP' }).first().click();
    
    // Should navigate to CFOP page
    await page.waitForURL('**/puzzles/3x3x3/cfop');
    await expect(page).toHaveURL('/puzzles/3x3x3/cfop');
  });
});

test.describe('CFOP Method Page', () => {
  test('should display CFOP stages', async ({ page }) => {
    await page.goto('/puzzles/3x3x3/cfop');
    
    // Check for CFOP stages (use first() for multiple matches)
    await expect(page.getByText(/Cross/i).first()).toBeVisible();
    await expect(page.getByText(/F2L/i).first()).toBeVisible();
    await expect(page.getByText(/OLL/i).first()).toBeVisible();
    await expect(page.getByText(/PLL/i).first()).toBeVisible();
  });

  test('should navigate to OLL stage', async ({ page }) => {
    await page.goto('/puzzles/3x3x3/cfop');
    
    // Click on OLL stage card
    await page.getByRole('link').filter({ hasText: 'OLL' }).first().click();
    
    // Should navigate to OLL page
    await page.waitForURL('**/puzzles/3x3x3/cfop/oll');
    await expect(page).toHaveURL('/puzzles/3x3x3/cfop/oll');
  });

  test('should navigate to PLL stage', async ({ page }) => {
    await page.goto('/puzzles/3x3x3/cfop');
    
    // Click on PLL stage card
    await page.getByRole('link').filter({ hasText: 'PLL' }).first().click();
    
    // Should navigate to PLL page
    await page.waitForURL('**/puzzles/3x3x3/cfop/pll');
    await expect(page).toHaveURL('/puzzles/3x3x3/cfop/pll');
  });
});
