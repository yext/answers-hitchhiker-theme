import { test, expect } from '@playwright/test';

test.describe('full page map test suite', () => {
  test.beforeEach(async ({page}) => {
    await page.goto('http://localhost:5042/locations_full_page_map');
    await page.getByPlaceholder('Search for locations').click();
  });

  test('can search and get results', async ({ page }) => {
    await page.getByPlaceholder('Search for locations').fill('virginia');
    await page.getByPlaceholder('Search for locations').press('Enter');
    const count = await page.locator('#js-answersVerticalResults').count();
    expect(count).toBeGreaterThan(0);
  });

  test('clicking on a pin focuses on a result card', async ({ page }) => {
    await page.getByPlaceholder('Search for locations').fill('virginia');
    await page.getByPlaceholder('Search for locations').press('Enter');
    await page.getByRole('button', { name: 'Result number 5' }).click();
    const results = page.locator('#js-answersVerticalResults div');
    const count = await results.count();
    let hasPinFocused = false;

    for (var i = 0; i < count; i++) {
      const currResult = await results.nth(i);
      const classes = await currResult.evaluate(node => Array.from(node.classList));

      if (classes.includes('yxt-Card--pinFocused')) {
        hasPinFocused = true;
        break;
      }
    }

    expect(hasPinFocused).toBe(true);
  });

  test('search when map moves works', async ({ page }) => {
    await page.getByPlaceholder('Search for locations').fill('virginia');
    await page.getByPlaceholder('Search for locations').press('Enter');
    await page.mouse.wheel(600, 300);
    const response = await page.waitForResponse(resp =>
      resp.url().includes('https:\/\/prod-cdn\.us\.yextapis\.com\/v2\/accounts\/me\/search\/vertical\/query'));
    await expect(response.status()).toBe(200);
  });

  test('search this area button works', async ({ page }) => {
    await page.getByPlaceholder('Search for locations').fill('virginia');
    await page.getByPlaceholder('Search for locations').press('Enter');
    await page.getByLabel('Map controls').getByText('Search When Map Moves').click();
    await page.locator('div').filter({ hasText: /^Search This Area$/ }).nth(1).click();
    await page.mouse.move(1200, 450, {steps: 5});
    const response = await page.waitForResponse(resp =>
      resp.url().includes('https:\/\/prod-cdn\.us\.yextapis\.com\/v2\/accounts\/me\/search\/vertical\/query'));
    await expect(response.status()).toBe(200);
  });

  test('default initial search works and is enabled by default', async ({ page }) => {
    await page.getByPlaceholder('Search for locations').press('Enter');
    const result = page.locator('#js-answersVerticalResults div').nth(0);
    await expect(result).toBeAttached();
  });

  test('pagination works', async ({ page }) => {
    await page.getByPlaceholder('Search for locations').fill('virginia');
    await page.getByPlaceholder('Search for locations').press('Enter');
    await page.getByLabel('Go to the next page of results').click();
    const secondPage = page.locator('#js-answersVerticalResultsCount');
    await expect(secondPage).toHaveText(/21/);
  });

  test('pagination scrolls the results to the top', async ({ page }) => {
    await page.getByPlaceholder('Search for locations').fill('virginia');
    await page.getByPlaceholder('Search for locations').press('Enter');
    await page.getByLabel('Go to the next page of results').click();
    const locator = page.locator('#js-answersVerticalResults div').nth(0);
    await expect(locator).toBeVisible();
  });

});

test.describe('full page map with filters test suite', () => {
  test.beforeEach(async ({page}) => {
    await page.goto('http://localhost:5042/locations_full_page_map_with_filters');
    await page.getByPlaceholder('Search for locations').fill('virginia');
    await page.getByPlaceholder('Search for locations').press('Enter');
    await page.waitForTimeout(2000);
  });

  test('clicking on a pin closes the filter view', async ({ page }) => {
    await page.getByRole('button', { name: 'filter results' }).click();
    await page.getByText('Cats (1)').click();
    const filterView = page.getByLabel('Main location search').locator('div').filter({ hasText: 'Filters Services reset Cats (1) Dogs (1) Sleep (1)' }).first();
    await expect(filterView).toBeVisible();
    await page.getByRole('button', { name: 'Result number 1' }).click();
    await expect(filterView).not.toBeVisible();
  });

  test('clicking on a cluster causes the map to zoom in', async ({ page }) => {
    const originalCount = await page.locator('.yxt-Card').count();
    await page.getByRole('button', { name: 'Cluster of 2 results' }).click();
    await page.waitForTimeout(2000);
    const countAfterSelectingCluster = await page.locator('.yxt-Card').count();
    expect(originalCount).toBeGreaterThan(countAfterSelectingCluster);
  });

  test('clicking on a cluster causes a new search to be run', async ({ page }) => {
    await page.getByRole('button', { name: 'Cluster of 4 results' }).click();
    const response = await page.waitForResponse(resp =>
      resp.url().includes('https:\/\/prod-cdn\.us\.yextapis\.com\/v2\/accounts\/me\/search\/vertical\/query'));
    await expect(response.status()).toBe(200);
  });
});