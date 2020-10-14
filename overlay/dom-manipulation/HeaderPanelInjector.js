/**
 * This class is responsible for injecting any styling or text from the Overlay config
 * into the header panel.
 */
class HeaderPanelInjector {
  /**
   * Injects the Header Panel HTML and styling from the config into the DOM.
   */
  inject() {
    this._injectHeadingText();
    this._injectSubtitleText();
    this._injectImage();
    this._addStyling();
  }

  /**
   * Injects heading text into the existing panel heading element if heading text is
   * present in the config.
   */
  _injectHeadingText() {
    // TODO (agrow) implement in a later PR
  }

  /**
   * Injects subtitle text into the existing panel subtitle element if subtitle text is
   * present in the config.
   */
  _injectSubtitleText() {
    // TODO (agrow) implement in a later PR
  }

  /**
   * Injects an image into the existing image wrapper element in the panel if an imageUrl
   * is present in the panel config.
   */
  _injectImage() {
    // TODO (agrow) implement in a later PR
  }

  /**
   * Injects styling for the header from the config
   */
  _applyConfigStyling() {
    // TODO (agrow) implement in a later PR
  }
}