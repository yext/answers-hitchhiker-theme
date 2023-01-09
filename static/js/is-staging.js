import escapeStringRegexp from 'escape-string-regexp';

/**
 * Determines whether the current url is staging or production.
 */
export function isStaging(stagingDomains) {
  const defaultStagingDomains = ['127.0.0.1', 'localhost', 'office.yext.com'];
  const _stagingDomains = stagingDomains
    ? defaultStagingDomains.concat(stagingDomains)
    : defaultStagingDomains;
  const currentDomain = window.location.hostname;

  return _stagingDomains.some(domain => {
    const regexEscapedDomain = escapeStringRegexp(domain);
    const isSubdomainRegex = new RegExp(`[A-Za-z0-9]?[A-Za-z0-9\-]{0,61}[A-Za-z0-9]?\.${regexEscapedDomain}`);

    return domain === currentDomain || isSubdomainRegex.test(currentDomain);
  });
}