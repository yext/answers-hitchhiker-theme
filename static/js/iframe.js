import { isStaging } from './is-staging';
import { generateIFrame } from './iframe-common';

const injectedData = JSON.parse(process.env.JAMBO_INJECTED_DATA || '{}');

let stagingDomain = '';
let prodDomain = '';
if (injectedData.pages && injectedData.pages.domains) {
  if (injectedData.pages.domains.staging && injectedData.pages.domains.staging.domain) {
    const isHttps = injectedData.pages.domains.staging.isHttps;
    stagingDomain = isHttps ? 'https://' : 'http://';
    stagingDomain += injectedData.pages.domains.staging.domain;
  }
  if (injectedData.pages.domains.prod && injectedData.pages.domains.prod.domain) {
    const isHttps = injectedData.pages.domains.prod.isHttps;
    prodDomain = isHttps ? 'https://' : 'http://';
    prodDomain += injectedData.pages.domains.prod.domain;
  }
}

const domain = isStaging() ? stagingDomain : prodDomain;
generateIFrame(domain);
