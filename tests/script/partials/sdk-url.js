const hbs = require('../../test-utils/hbs');

it('creates an sdk asset url correctly', () => {
  const partialUsage =
    '{{> script/partials/sdk-url sdkVersion=1.8 sdkAsset="answers.js" locale="it"}}';
  const expectedOutput = 'https://assets.sitescdn.net/answers/v1.8/it-answers.js';
  expect(hbs.compile(partialUsage)()).toEqual(expectedOutput);
});

it('does not include a locale prefix when no locale specified', () => {
  const partialUsage = '{{> script/partials/sdk-url sdkVersion=1.8 sdkAsset="answers.js"}}';
  const expectedOutput = 'https://assets.sitescdn.net/answers/v1.8/answers.js';
  expect(hbs.compile(partialUsage)()).toEqual(expectedOutput);
});

it('does not include a locale prefix when locale is set to "en"', () => {
  const partialUsage =
    '{{> script/partials/sdk-url sdkVersion=1.8 sdkAsset="answers.js" locale="en"}}';
  const expectedOutput = 'https://assets.sitescdn.net/answers/v1.8/answers.js';
  expect(hbs.compile(partialUsage)()).toEqual(expectedOutput);
});

