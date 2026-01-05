import { test, expect } from '@playwright/test';

test.describe('Methods Page', () => {
  test('should display CFOP method', async ({ page }) => {
    await page.goto('/methods');
    
    // Check for CFOP method card
    await expect(page.getByText('CFOP')).toBeVisible();
    await expect(page.getByText(/beginner friendly/i)).toBeVisible();
  });

  test('should navigate to CFOP method page', async ({ page }) => {
    await page.goto('/methods');
    
    // Click on CFOP method
    await page.getByRole('link', { name: /CFOP/i }).click();
    
    // Should navigate to CFOP page
    await expect(page).toHaveURL('/methods/cfop');
  });
});

test.describe('CFOP Method Page', () => {
  test('should display CFOP stages', async ({ page }) => {
    await page.goto('/methods/cfop');
    
    // Check for CFOP stages
    await expect(page.getByText('OLL')).toBeVisible();
    await expect(page.getByText('PLL')).toBeVisible();
  });

  test('should navigate to OLL page', async ({ page }) => {
    await page.goto('/methods/cfop');
    
    // Click on OLL
    await page.getByRole('link', { name: /OLL/i }).first().click();
    
    // Should navigate to OLL page
    await expect(page).toHaveURL('/methods/cfop/oll');
  });
});
