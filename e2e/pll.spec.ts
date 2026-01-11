import { test, expect } from '@playwright/test';

test.describe('PLL Algorithm Page', () => {
  test('should display PLL algorithm set page', async ({ page }) => {
    await page.goto('/puzzles/3x3x3/pll');
    
    // Check page title
    await expect(page.getByRole('heading', { name: /PLL/i }).first()).toBeVisible();
    
    // Check that at least one case is displayed
    await expect(page.getByText(/PLL/i).first()).toBeVisible();
  });

  test('should navigate to PLL case detail', async ({ page }) => {
    await page.goto('/puzzles/3x3x3/pll');
    
    // Click on first PLL case link - be more specific to find actual PLL case
    const firstCase = page.getByRole('link').filter({ hasText: /Ua/ }).or(page.getByRole('link').filter({ hasText: /PLL-/ })).first();
    await firstCase.click();
    
    // Should navigate to case detail page
    await page.waitForURL('**/puzzles/3x3x3/pll/pll-**', { timeout: 10000 });
    await expect(page.url()).toMatch(/\/puzzles\/3x3x3\/pll\/pll-/);
  });
});

test.describe('PLL Case Detail Page', () => {
  test('should display case information for Ua perm', async ({ page }) => {
    await page.goto('/puzzles/3x3x3/pll/pll-ua');
    
    // Check for algorithm notation
    const algorithmCode = page.locator('code');
    await expect(algorithmCode.first()).toBeVisible();
    await expect(algorithmCode.first()).toContainText(/[RUFLDBrufldb]/);
  });

  test('should have copy button', async ({ page }) => {
    await page.goto('/puzzles/3x3x3/pll/pll-ua');
    
    // Look for copy button
    const copyButton = page.getByRole('button', { name: /copy/i });
    await expect(copyButton).toBeVisible();
  });
});
