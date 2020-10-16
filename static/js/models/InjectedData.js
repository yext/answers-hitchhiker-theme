import { isStaging } from '../is-staging';
import { DomainTypes } from './domaintypes';

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
   * @returns {boolean}
   */
  getStagingDomain() {
    return this._getDomain(DomainTypes.STAGING)
  }

  /**
   * Returns the injected prod domain
   *
   * @returns {boolean}
   */
  getProdDomain() {
    return this._getDomain(DomainTypes.PROD)
  }

  /**
   * Returns the injected domain based on the given type
   *
   * @param {string} domainType
   * @returns {string}
   */
  _getDomain(domainType) {
    const injectedDomains = this._getInjectedPagesDomains() || {};
    if (!injectedDomains[domainType] || !injectedDomains[domainType].domain) {
      return '';
    }
    const isHttps = injectedDomains[domainType].isHttps;
    const protocol = isHttps ? 'https://' : 'http://';
    return protocol + injectedDomains[domainType].domain;
  }

  /**
   * Returns the injected pages domains object if present
   *
   * @returns {Object}
   */
  _getInjectedPagesDomains() {
    return this.injectedData.pages && this.injectedData.pages.domains;
  }
}
