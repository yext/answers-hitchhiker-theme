import { isStaging } from '../is-staging';

/**
 * InjectedData represents the data injected by Jambo
 */
export default class InjectedData {
  constructor() {
    /**
     * @type {Object}
     */
    this.injectedData = JSON.parse(process.env.JAMBO_INJECTED_DATA || '{}');
  }

  /**
   * Returns the domain injected by jambo based whether the current site is staging or not
   *
   * @returns {string}
   */
  getDomain() {
    const injectedPagesData = this.injectedData.pages || {};
    return isStaging(injectedPagesData.stagingDomains)
      ? this.getStagingDomain()
      : this.getProdDomain();
  }

  /**
   * Returns the injected staging domain
   *
   * @returns {string}
   */
  getStagingDomain() {
    if (!this.injectedData.pages || !this.injectedData.pages.domains
        || !this.injectedData.pages.domains.staging
        || !this.injectedData.pages.domains.staging.domain) {
      return '';
    }
    const isHttps = this.injectedData.pages.domains.staging.isHttps;
    const protocol = isHttps ? 'https://' : 'http://';
    return protocol + this.injectedData.pages.domains.staging.domain;
  }

  /**
   * Returns the injected prod domain
   *
   * @returns {boolean}
   */
  getProdDomain() {
    if (!this.injectedData.pages || !this.injectedData.pages.domains
        || !this.injectedData.pages.domains.prod
        || !this.injectedData.pages.domains.prod.domain) {
      return '';
    }
    const isHttps = this.injectedData.pages.domains.prod.isHttps;
    const protocol = isHttps ? 'https://' : 'http://';
    return protocol + injectedData.pages.domains.prod.domain;
  }
}
