/**
 * ConfigValidator is responsible for validating the Overlay config provided by a user.
 */
export default class ConfigValidator {
  constructor(config = {}) {
    /**
     * @type {Object}
     */
    this.config = config;
  }

  /**
   * Throws errors or prints warnings for invalid configuration
   */
  validate () {
    this._validatePanel()
    this._validatePrompts();
    this._validateCustomSelector();
  }

  /**
   * Throws errors or prints warnings if panel config is missing or invalid
   */
  _validatePanel() {
    const hasPanelConfig = this.config.panel && (this.config.panel.icon || this.config.panel.header);
    if (!hasPanelConfig) {
      console.warn('Missing panel header and icon, please specify at least one of them.');
    }
  }

  /**
   * Throws errors or prints warnings if prompt config is missing or invalid
   */
  _validatePrompts() {
    const hasPrompts = this.config.prompts && this.config.prompts.length > 0;
    if (!hasPrompts) {
      console.warn('No prompts specified, we recommend adding three prompts.');
    }
  }

  /**
   * Throws errors or prints warnings if a custom selector is configured and invalid
   */
  _validateCustomSelector() {
    if (this.config.hideDefaultButton && !this.config.customSelector) {
      console.warn('If hideDefaultButton is true, we recommend adding a custom selector.');
    }
  }
}