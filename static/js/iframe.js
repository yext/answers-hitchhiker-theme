import { isStaging } from './is-staging';
import { generateIFrame } from './iframe-common';

const injectedData = JSON.parse(process.env.JAMBO_INJECTED_DATA || '{}');
const injectedPagesData = injectedData.pages || {};

let stagingDomain = '';
let prodDomain = '';
if (injectedPagesData.domains) {
  if (injectedPagesData.domains.staging && injectedPagesData.domains.staging.domain) {
    const isHttps = injectedPagesData.domains.staging.isHttps;
    stagingDomain = isHttps ? 'https://' : 'http://';
    stagingDomain += injectedPagesData.domains.staging.domain;
  }
  if (injectedPagesData.domains.prod && injectedPagesData.domains.prod.domain) {
    const isHttps = injectedPagesData.domains.prod.isHttps;
    prodDomain = isHttps ? 'https://' : 'http://';
    prodDomain += injectedPagesData.domains.prod.domain;
  }
}

const domain = isStaging(injectedPagesData.stagingDomains) ? stagingDomain : prodDomain;
generateIFrame(domain);
