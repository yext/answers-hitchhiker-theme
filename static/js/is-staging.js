/**
 * Determines whether the current url is staging or production.
 */
export function isStaging(stagingDomains) {
  const defaultStagingDomains = ['127.0.0.1', 'localhost', 'office.yext.com'];
  const _stagingDomains = defaultStagingDomains.concat(stagingDomains);
  const currentUrl = window.location.href;
  return _stagingDomains.some(domain => currentUrl.includes(domain));
}
