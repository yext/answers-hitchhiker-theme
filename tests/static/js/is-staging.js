import { isStaging } from 'static/js/is-staging.js';

describe('isStaging', () => {
  // https://stackoverflow.com/questions/49975981/specify-window-location-for-each-test-file-for-jest
  delete global.window.location;
  global.window = Object.create(window);
  global.window.location = {};

  function setHref(href) {
    window.location.href = href;
  }

  const testStagingDomains = ["yextpages.net", "landingpagespreview.com"];
  beforeEach(() => {
    // Reset window.location.href to the default value in a jest test
    setHref('http://localhost/');
  });

  it('works correctly for default staging domains', () => {
    expect(isStaging()).toBeTruthy();
    setHref('http://localhost:3000/my-local/url');
    expect(isStaging()).toBeTruthy();
    setHref('http://127.0.0.1/my-local/url');
    expect(isStaging()).toBeTruthy()
    setHref('http://breed.office.yext.com/my-local/url');
    expect(isStaging()).toBeTruthy();
  });

  it('can check stagingDomains correctly', () => {
    setHref('https://yextpages.net/angelas-adventure-articles');
    expect(isStaging()).toBeFalsy();
    expect(isStaging(testStagingDomains)).toBeTruthy();
    setHref('https://bob.landingpagespreview.com/angelas-adventure-articles');
    expect(isStaging()).toBeFalsy();
    expect(isStaging(testStagingDomains)).toBeTruthy();
  });
});
