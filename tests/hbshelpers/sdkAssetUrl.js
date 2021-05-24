import sdkAssetUrl from '../../hbshelpers/sdkAssetUrl';

describe('URLs are computed properly for released versions', () => {
  it('works correctly when locale is "en"', () => {
    const expectedJSUrl = 'https://assets.sitescdn.net/answers/v1.8/answers.min.js';
    const expectedCSSUrl = 'https://assets.sitescdn.net/answers/v1.8/answers.css'

    expect(sdkAssetUrl('1.8', 'en', 'answers.min.js')).toEqual(expectedJSUrl);
    expect(sdkAssetUrl('1.8', 'en', 'answers.css')).toEqual(expectedCSSUrl);
  });

  it('works correctly when locale is not "en"', () => {
    const expectedJSUrl = 'https://assets.sitescdn.net/answers/v1.8/fr-answers.min.js';
    const expectedCSSUrl = 'https://assets.sitescdn.net/answers/v1.8/answers.css'

    expect(sdkAssetUrl('1.8', 'fr', 'answers.min.js')).toEqual(expectedJSUrl);
    expect(sdkAssetUrl('1.8', 'fr', 'answers.css')).toEqual(expectedCSSUrl);
  });
});

describe('URLs are computed properly for release branches', () => {
  it('works correctly when locale is "en"', () => {
    const expectedJSUrl = 'https://assets.sitescdn.net/answers/dev/release-v1.8/answers.min.js';
    const expectedCSSUrl = 'https://assets.sitescdn.net/answers/dev/release-v1.8/answers.css'

    expect(sdkAssetUrl('release/v1.8', 'en', 'answers.min.js')).toEqual(expectedJSUrl);
    expect(sdkAssetUrl('release/v1.8', 'en', 'answers.css')).toEqual(expectedCSSUrl);
  });

  it('works correctly when locale is not "en"', () => {
    const expectedJSUrl = 'https://assets.sitescdn.net/answers/dev/release-v1.8/fr-answers.min.js';
    const expectedCSSUrl = 'https://assets.sitescdn.net/answers/dev/release-v1.8/answers.css'

    expect(sdkAssetUrl('release/v1.8', 'fr', 'answers.min.js')).toEqual(expectedJSUrl);
    expect(sdkAssetUrl('release/v1.8', 'fr', 'answers.css')).toEqual(expectedCSSUrl);
  });
});

describe('URLs are computed properly for hotfix branches', () => {
  it('works correctly when locale is "en"', () => {
    const expectedJSUrl = 'https://assets.sitescdn.net/answers/dev/hotfix-v1.8.1/answers.min.js';
    const expectedCSSUrl = 'https://assets.sitescdn.net/answers/dev/hotfix-v1.8.1/answers.css'

    expect(sdkAssetUrl('hotfix/v1.8.1', 'en', 'answers.min.js')).toEqual(expectedJSUrl);
    expect(sdkAssetUrl('hotfix/v1.8.1', 'en', 'answers.css')).toEqual(expectedCSSUrl);
  });

  it('works correctly when locale is not "en"', () => {
    const expectedJSUrl = 'https://assets.sitescdn.net/answers/dev/hotfix-v1.8.1/fr-answers.min.js';
    const expectedCSSUrl = 'https://assets.sitescdn.net/answers/dev/hotfix-v1.8.1/answers.css'

    expect(sdkAssetUrl('hotfix/v1.8.1', 'fr', 'answers.min.js')).toEqual(expectedJSUrl);
    expect(sdkAssetUrl('hotfix/v1.8.1', 'fr', 'answers.css')).toEqual(expectedCSSUrl);
  });
});

describe('URLs are computed properly for all other branches', () => {
  it('works correctly when locale is "en"', () => {
    const expectedJSUrl = 'https://assets.sitescdn.net/answers/dev/feature-foo/answers.min.js';
    const expectedCSSUrl = 'https://assets.sitescdn.net/answers/dev/feature-foo/answers.css'

    expect(sdkAssetUrl('feature/foo', 'en', 'answers.min.js')).toEqual(expectedJSUrl);
    expect(sdkAssetUrl('feature/foo', 'en', 'answers.css')).toEqual(expectedCSSUrl);
  });

  it('works correctly when locale is not "en"', () => {
    const expectedJSUrl = 'https://assets.sitescdn.net/answers/dev/feature-foo/answers.min.js';
    const expectedCSSUrl = 'https://assets.sitescdn.net/answers/dev/feature-foo/answers.css'

    expect(sdkAssetUrl('feature/foo', 'fr', 'answers.min.js')).toEqual(expectedJSUrl);
    expect(sdkAssetUrl('feature/foo', 'fr', 'answers.css')).toEqual(expectedCSSUrl);
  });
});