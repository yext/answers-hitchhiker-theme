import { generateIFrame } from './iframe-common';

const injectedData = JSON.parse(process.env.JAMBO_INJECTED_DATA || '{}');

let prodDomain = '';
if (injectedData.pages && injectedData.pages.domains && injectedData.pages.domains.prod && injectedData.pages.domains.prod.domain) {
  const isHttps = injectedData.pages.domains.prod.isHttps;
  prodDomain = isHttps ? 'https://' : 'http://';
  prodDomain += injectedData.pages.domains.prod.domain;
}

generateIFrame(prodDomain);
