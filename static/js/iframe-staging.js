import { generateIFrame } from './iframe-common';

const injectedData = JSON.parse(process.env.JAMBO_INJECTED_DATA || '{}');

let stagingDomain = '';
if (injectedData.pages && injectedData.pages.domains && injectedData.pages.domains.staging && injectedData.pages.domains.staging.domain) {
  const isHttps = injectedData.pages.domains.staging.isHttps;
  stagingDomain = isHttps ? 'https://' : 'http://';
  stagingDomain += injectedData.pages.domains.staging.domain;
}

generateIFrame(stagingDomain);
