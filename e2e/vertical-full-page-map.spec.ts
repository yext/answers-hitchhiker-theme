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
    const locator = await page.locator('#js-answersVerticalResults div').nth(134);
    await expect(locator).toHaveClass(/pinFocused/);
  });

  test('search when map moves works', async ({ page }) => {
    const searchLogo = '#js-yext-submit';
    await page.mouse.move(600, 300);
    await page.mouse.down();
    await page.mouse.move(1200, 450, {steps: 5});
    await page.mouse.up();
    await page.waitForSelector(searchLogo, { state: 'detached' });
    const detachedSearchLogo = await page.$(searchLogo);
    expect(detachedSearchLogo).toBeFalsy();
  });

  test('search this area button works', async ({ page }) => {
    await page.getByPlaceholder('Search for locations').fill('virginia');
    await page.getByPlaceholder('Search for locations').press('Enter');
    const responsePromise = await page.waitForResponse(/https:\/\/prod-cdn\.us\.yextapis\.com\/v2\/accounts\/me\/search\/vertical/i);
    await page.getByLabel('Map controls').getByText('Search When Map Moves').click();
    const response = await responsePromise;
  });

  test('default initial search works and is enabled by default', async ({ page }) => {
    await page.getByPlaceholder('Search for locations').press('Enter');
    const result = await page.locator('#js-answersVerticalResults div').nth(0);
    await expect(result).toBeAttached();
  });

  test('pagination works', async ({ page }) => {
    await page.getByPlaceholder('Search for locations').fill('virginia');
    await page.getByPlaceholder('Search for locations').press('Enter');
    await page.getByLabel('Go to the next page of results').click();
    const secondPage = await page.locator('#js-answersVerticalResultsCount');
    await expect(secondPage).toHaveText(/21/);
  });

  test('pagination scrolls the results to the top', async ({ page }) => {
    await page.getByPlaceholder('Search for locations').fill('virginia');
    await page.getByPlaceholder('Search for locations').press('Enter');
    await page.getByLabel('Go to the next page of results').click();
    const locator = await page.locator('#js-answersVerticalResults div').nth(0);
    await expect(locator).toBeVisible();
  });

});

test.describe('full page map with filters test suite', () => {
  test.beforeEach(async ({page}) => {
    await page.goto('http://localhost:5042/locations_full_page_map_with_filters');
    await page.getByPlaceholder('Search for locations').fill('virginia');
    await page.getByPlaceholder('Search for locations').press('Enter');
  });

  test('clicking on a pin closes the filter view', async ({ page }) => {
    await page.getByRole('button', { name: 'filter results' }).click();
    await page.getByText('Cats (1)').click();
    const filterView = await page.getByLabel('Main location search').locator('div').filter({ hasText: 'Filters Services reset Cats (1) Dogs (1) Sleep (1)' }).first();
    await expect(filterView).toBeVisible();
    await page.getByRole('button', { name: 'Result number 1' }).click();
    await expect(filterView).not.toBeVisible();
  });

  test('clicking on a cluster causes the map to zoom in', async ({ page }) => {
    const mapboxPinCount = await page.locator('#js-answersMap div').count();
    await page.getByRole('button', { name: 'Cluster of 2 results' }).click();
    const mapboxPinCountAfterSelectingCluster = await page.locator('#js-answersMap div').count();
    await expect(mapboxPinCount).not.toBe(mapboxPinCountAfterSelectingCluster);
  });

  test('clicking on a cluster causes a new search to be run', async ({ page }) => {
    const numResults = await page.locator('#js-answersVerticalResults').count();
    await page.getByRole('button', { name: 'Cluster of 4 results' }).click();
    const numResultsAfterSelectingCluster = await page.locator('#js-answersVerticalResults').count();
    await expect(numResults).not.toBe(numResultsAfterSelectingCluster);
  });

});