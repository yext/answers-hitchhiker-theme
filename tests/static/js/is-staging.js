import { isStaging } from 'static/js/is-staging.js';

describe('isStaging', () => {
  // https://stackoverflow.com/questions/49975981/specify-window-location-for-each-test-file-for-jest
  delete global.window.location;
  global.window = Object.create(window);
  global.window.location = {};

  function setDomain(url) {
    const domainRegex = /:\/\/([^:\/]+)[:\/]?/;
    window.location.hostname = url.match(domainRegex)[1];
  }

  const testStagingDomains = ["yextpages.net", "landingpagespreview.com"];

  it('handles locally hosted sites properly', () => {
    setDomain('http://localhost:3000/my-local/url');
    expect(isStaging()).toBeTruthy();
    setDomain('http://127.0.0.1/my-local/url');
    expect(isStaging()).toBeTruthy()
  });

  it('handles Office-hosted sites properly', () => {
    setDomain('http://breed.office.yext.com/my-local/url');
    expect(isStaging()).toBeTruthy();
  })

  it('handles a page of a Staging site properly', () => {
    setDomain('https://yextpages.net/angelas-adventure-articles');
    expect(isStaging(testStagingDomains)).toBeTruthy();
  })

  it('handles a subdomain of a Staging site properly', () => {
    setDomain('https://bob.landingpagespreview.com/angelas-adventure-articles');
    expect(isStaging(testStagingDomains)).toBeTruthy();
  });

  it('handles a port of a Staging site properly', () => {
    setDomain('https://yextpages.net/angelas-adventure-articles:9000');
    expect(isStaging(testStagingDomains)).toBeTruthy();
  });

  it('handles redirect from a Staging site to a Production site correctly', () => {
    setDomain('https://production-url.com/page?referrerPageUrl=https://yextpages.net/');
    expect(isStaging(testStagingDomains)).toBeFalsy();
  })
});
