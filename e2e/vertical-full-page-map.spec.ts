import { test, expect } from '@playwright/test';

async function waitForResultsToLoad(page) {
  const result = page.locator('#js-answersVerticalResults div').nth(0);
  await expect(result).toBeAttached();
}

test.describe('full page map test suite', () => {
  test.beforeEach(async ({page}) => {
    await page.goto('http://localhost:5042/locations_full_page_map');
  });

  test('can search and get results', async ({ page }) => {
    await page.waitForResponse(resp =>
      resp.url().includes('https:\/\/prod-cdn\.us\.yextapis\.com\/v2\/accounts\/me\/search\/vertical\/query')
      && resp.url().includes('queryTrigger'));
    const prevResultsCount = await page.locator('.yxt-VerticalResultsCount-total').textContent();

    await page.getByPlaceholder('Search for locations').fill('virginia');
    await page.getByPlaceholder('Search for locations').press('Enter');
    await page.waitForResponse(resp =>
      resp.url().includes('https:\/\/prod-cdn\.us\.yextapis\.com\/v2\/accounts\/me\/search\/vertical\/query')
      && resp.url().includes('input=virginia'));
    const resultsCount = await page.locator('.yxt-VerticalResultsCount-total').textContent();

    expect(prevResultsCount).not.toBe(resultsCount);
  });

  test('clicking on a pin focuses on a result card', async ({ page }) => {
    await expect(page.locator('.yxt-Card--pinFocused')).not.toBeAttached();
    await page.getByRole('button', { name: 'Result number 13' }).click();
    await expect(page.locator('.yxt-Card--pinFocused')).toBeAttached();
  });

  test('search when map moves works', async ({ page }) => {
    await page.getByPlaceholder('Search for locations').fill('virginia');
    await page.getByPlaceholder('Search for locations').press('Enter');
    await waitForResultsToLoad(page);
    const map = page.locator('.mapboxgl-canvas');
    await map.dragTo(map, {
      sourcePosition: { x: 788, y: 345},
      targetPosition: { x: 1011, y: 225},
    })
    const response = await page.waitForResponse(resp =>
      resp.url().includes('https:\/\/prod-cdn\.us\.yextapis\.com\/v2\/accounts\/me\/search\/vertical\/query')
      && resp.url().includes('radius'));
    expect(response.status()).toBe(200);
  });

  test('search this area button works', async ({ page }) => {
    await page.getByLabel('Map controls').getByText('Search When Map Moves').click();
    await page.getByPlaceholder('Search for locations').fill('virginia');
    await page.getByPlaceholder('Search for locations').press('Enter');
    await page.waitForResponse(resp =>
      resp.url().includes('https:\/\/prod-cdn\.us\.yextapis\.com\/v2\/accounts\/me\/search\/vertical\/query')
      && !resp.url().includes('radius'));
    await page.locator('div').filter({ hasText: /^Search This Area$/ }).nth(1).click();
    const response = await page.waitForResponse(resp =>
      resp.url().includes('https:\/\/prod-cdn\.us\.yextapis\.com\/v2\/accounts\/me\/search\/vertical\/query')
      && resp.url().includes('radius'));
    expect(response.status()).toBe(200);
  });

  test('default initial search works and is enabled by default', async ({ page }) => {
    const response = await page.waitForResponse(resp =>
      resp.url().includes('https:\/\/prod-cdn\.us\.yextapis\.com\/v2\/accounts\/me\/search\/vertical\/query')
      && resp.url().includes('queryTrigger'));
    expect(response.status()).toBe(200);
  });

  test('empty search works', async ({ page }) => {
    await page.getByPlaceholder('Search for locations').press('Enter');
    const response = await page.waitForResponse(resp =>
      resp.url().includes('https:\/\/prod-cdn\.us\.yextapis\.com\/v2\/accounts\/me\/search\/vertical\/query')
      && resp.url().includes('input=&'));
    expect(response.status()).toBe(200);
  })

  test('pagination works', async ({ page }) => {
    const resultsCount = page.locator('#js-answersVerticalResultsCount');
    await expect(resultsCount).toHaveText(/20/);
    await page.getByLabel('Go to the next page of results').click();
    await expect(resultsCount).toHaveText(/21/);
  });

  test('pagination scrolls the results to the top', async ({ page }) => {
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));

    const scrollOffsetBeforePagination = await page.evaluate(() => {return window.scrollY}); 
    expect(scrollOffsetBeforePagination).not.toBe(0);

    await page.getByLabel('Go to the next page of results').click();
    await waitForResultsToLoad(page);

    const scrollOffsetAfterPagination = await page.evaluate(() => {return window.scrollY}); 
    expect(scrollOffsetAfterPagination).toBe(0);
  });

});

test.describe('full page map with filters test suite', () => {
  test.beforeEach(async ({page}) => {
    await page.goto('http://localhost:5042/locations_full_page_map_with_filters');
  });

  test('clicking on a pin closes the filter view', async ({ page }) => {
    await page.getByRole('button', { name: 'filter results' }).click();
    const filters = page.locator('#js-answersFacets');
    await expect(filters).toBeVisible();
    await page.getByRole('button', { name: 'Result number 7' }).click();
    await expect(filters).not.toBeVisible();
  });

  test('clicking on a cluster causes the map to zoom in and new search is ran', async ({ page }) => {
    await page.getByPlaceholder('Search for locations').fill('virginia');
    await page.getByPlaceholder('Search for locations').press('Enter');
    await page.waitForResponse(resp => resp.url().includes('https://prod-cdn.us.yextapis.com/v2/accounts/me/search/vertical/query')
      && resp.url().includes('input=virginia') 
      && !resp.url().includes('filters'));

    await waitForResultsToLoad(page);

    const originalCount = await page.locator('.yxt-Card').count();

    await page.getByRole('button', { name: 'Cluster of 2 results' }).click();
    await page.waitForResponse(resp => resp.url().includes('https://prod-cdn.us.yextapis.com/v2/accounts/me/search/vertical/query')
      && resp.url().includes('input=virginia') 
      && resp.url().includes('filters'));

    await waitForResultsToLoad(page);

    const countAfterSelectingCluster = await page.locator('.yxt-Card').count();
    expect(originalCount).toBeGreaterThan(countAfterSelectingCluster);
  });
});