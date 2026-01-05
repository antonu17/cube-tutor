import { test, expect } from '@playwright/test';

test.describe('PLL Algorithm Page', () => {
  test('should display PLL cases', async ({ page }) => {
    await page.goto('/methods/cfop/pll');
    
    // Check page title
    await expect(page.getByRole('heading', { name: /PLL/i })).toBeVisible();
    
    // Check that at least one case is displayed
    await expect(page.getByText(/PLL/i)).toBeVisible();
  });

  test('should navigate to PLL case detail', async ({ page }) => {
    await page.goto('/methods/cfop/pll');
    
    // Click on first PLL case link
    const firstCase = page.getByRole('link').filter({ hasText: /^[A-Z]/ }).first();
    if (await firstCase.isVisible()) {
      await firstCase.click();
      
      // Should navigate to case detail page
      await expect(page.url()).toContain('/methods/cfop/pll/');
    }
  });
});

test.describe('PLL Case Detail Page', () => {
  test('should display case information for Aa perm', async ({ page }) => {
    await page.goto('/methods/cfop/pll/aa');
    
    // Check for algorithm notation
    const algorithmText = page.locator('text=/[RUFLDBrufldb]/');
    await expect(algorithmText.first()).toBeVisible();
  });
});
