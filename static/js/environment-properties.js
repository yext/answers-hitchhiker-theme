/**
 * EnvironmentProperties is a class for handling the environment state.
 */
class EnvironmentProperties {
  constructor() {
    if (!EnvironmentProperties.setInstance(this)) {
      return EnvironmentProperties.getInstance();
    }

    /**
     * _knownHosts categorizes hostnames by their environment.
     */
    this._knownHosts = {
      local: ['127.0.0.1', 'localhost'],
      office: ['office.yext.com'],
      qa: [],
      sandbox: [],
      staging: [],
      production: []
    }
  }

  _isEnvironment(environment) {
    const currentHost = window.location.host;
    return this._knownHosts[environment].some(knownHost => currentHost.includes(knownHost));
  }

  isLocal() {
    return this._isEnvironment('local');
  }

  isOffice() {
    return this._isEnvironment('office');
  }

  isSandbox() {
    return this._isEnvironment('sandbox');
  }

  isStaging() {
    return this._isEnvironment('staging');
  }

  isProduction() {
    return this._isEnvironment('production');
  }

  /**
   * Initialize EnvironmentProperties from env.JAMBO_INJECTED_DATA.
   * @param {Object} JAMBO_INJECTED_DATA
   */
  init(JAMBO_INJECTED_DATA) {
    const injectedData = JAMBO_INJECTED_DATA;
    const pages = injectedData.pages || {};
    this._addKnownHosts('staging', pages.stagingDomains || []);
  }

  /**
   * Register a list of hosts as known to be for a specified environment.
   * @param {string} environment 
   * @param {Array<string>} hosts
   */
  _addKnownHosts(environment, hosts) {
    this._knownHosts[environment] = this._knownHosts[environment].concat(hosts);
  }

  static setInstance(instance) {
    if (!this.instance) {
      this.instance = instance;
      return true;
    }
    return false;
  }

  static getInstance() {
    return this.instance;
  }
}

export default new EnvironmentProperties();
