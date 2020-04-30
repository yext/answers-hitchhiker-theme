import { isStaging, addStagingDomains } from 'static/js/is-staging.js';

describe('detecting whether isStaging', () => {
  it('works correctly for default staging domains', () => {
    expect(isStaging('localhost')).toBeTruthy();
    expect(isStaging('http://localhost:8080/bob/joe')).toBeTruthy();
    expect(isStaging('127.0.0.1')).toBeTruthy();
    expect(isStaging('http://127.0.0.1:3000/joe/bob')).toBeTruthy();
    expect(isStaging('office.yext.com')).toBeTruthy();
    expect(isStaging('breed.office.yext.com')).toBeTruthy();
  });

  it('works correctly with no params', () => {
    expect(window.location.host).toEqual('localhost');
    expect(isStaging()).toBeTruthy();
  });

  it('can set stagingDomains correctly', () => {
    expect(isStaging('https://yextpages.net/angelas-adventure-articles')).toBeFalsy();
    expect(isStaging('https://boringprefix.landingpagespreview.com/angelas-adventure-articles')).toBeFalsy();
    addStagingDomains([ "yextpages.net", "landingpagespreview.com" ]);
    expect(isStaging('https://bob.yextpages.net/angelas-adventure-articles')).toBeTruthy();
    expect(isStaging('https://boringprefix.landingpagespreview.com/angelas-adventure-articles')).toBeTruthy();
    expect(isStaging('yextpages')).toBeFalsy();
    expect(isStaging('landingpagespreview')).toBeFalsy();
  })
});