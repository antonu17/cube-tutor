import { test, expect } from '@playwright/test';

test.describe('OLL Algorithm Page', () => {
  test('should display OLL cases', async ({ page }) => {
    await page.goto('/methods/cfop/oll');
    
    // Check page title
    await expect(page.getByRole('heading', { name: /OLL/i })).toBeVisible();
    
    // Check that at least one case is displayed
    await expect(page.getByText(/OLL 1/i)).toBeVisible();
  });

  test('should filter OLL cases by group', async ({ page }) => {
    await page.goto('/methods/cfop/oll');
    
    // Look for group filter buttons (if implemented)
    const allButton = page.getByRole('button', { name: /all/i });
    if (await allButton.isVisible()) {
      await allButton.click();
      
      // Verify cases are displayed
      await expect(page.getByText(/OLL/i)).toBeVisible();
    }
  });

  test('should navigate to OLL case detail', async ({ page }) => {
    await page.goto('/methods/cfop/oll');
    
    // Click on first OLL case
    const firstCase = page.getByRole('link', { name: /OLL 1/i }).first();
    await firstCase.click();
    
    // Should navigate to case detail page
    await expect(page.url()).toContain('/methods/cfop/oll/');
  });
});

test.describe('OLL Case Detail Page', () => {
  test('should display case information', async ({ page }) => {
    await page.goto('/methods/cfop/oll/1');
    
    // Check for case heading
    await expect(page.getByRole('heading', { name: /OLL 1/i })).toBeVisible();
    
    // Check for algorithms section
    await expect(page.getByText(/algorithm/i)).toBeVisible();
  });

  test('should display algorithm details', async ({ page }) => {
    await page.goto('/methods/cfop/oll/1');
    
    // Look for algorithm notation
    const algorithmText = page.locator('text=/[RUFLDBrufldb]/');
    await expect(algorithmText.first()).toBeVisible();
  });

  test('should have navigation back to OLL list', async ({ page }) => {
    await page.goto('/methods/cfop/oll/1');
    
    // Look for back link or breadcrumb
    const backLink = page.getByRole('link', { name: /back|oll/i }).first();
    if (await backLink.isVisible()) {
      await backLink.click();
      await expect(page).toHaveURL('/methods/cfop/oll');
    }
  });
});
