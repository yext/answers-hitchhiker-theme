/**
 * This class is responsible for injecting any styling or text from the Overlay config
 * into the button.
 */
class ButtonInjector {
  /**
   * Injects the button into the DOM.
   */
  inject() {
    this._injectLabelText();
    this._applyConfigStyling();
    this._attachEventListeners();
  }

  /**
   * Injects label text into the existing button label element if label text is present
   * in the config.
   */
  _injectLabelText() {
    // TODO (agrow) implement in a later PR
  }

  /**
   * Injects styling for the button colors from the config
   */
  _applyConfigStyling() {
    // TODO (agrow) implement in a later PR
  }

  /**
   * Attaches the Overlay event listeners to the button
   */
  _attachEventListeners() {
    // TODO (agrow) implement in a later PR
  }
}