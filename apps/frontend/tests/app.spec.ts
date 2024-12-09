import { expect, test } from '@playwright/test';

test('has correct title', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveTitle(/SCHBody💪/);
});

test('has correct header elements', async ({ page }) => {
  await page.goto('/');

  // Expect the header to have all the required links and the login button
  await expect(page.getByRole('link', { name: 'Szabályzat' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Körtagok' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'GYIK' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Bejelentkezés' })).toBeVisible();
});

test('can navigate to every page from the header', async ({ page }) => {
  await page.goto('/');

  // Click on the links in the header and expect to be navigated to the correct page
  await page.click('text=Szabályzat');
  await expect(page.getByText('Konditerem használati rendje')).toBeVisible();

  // Clicking on the logo should navigate back to the home page
  await page.click('text=SCHBody');

  // If the backend is not running, there are no users to display, so the page will show a message
  // await page.click('text=Körtagok');
  // await expect(page).toHaveTitle(/Körtagok/);

  await page.click('text=GYIK');
  await expect(page.getByText('Gyakran ismételt kérdések')).toBeVisible();
});
