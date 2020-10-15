/**
 * This class is responsible for injecting any styling or text from the Overlay config
 * into the header panel.
 */
class HeaderPanelInjector {
  constructor(config = {}) {
    /**
     * @type {string}
     */
    this.heading = config.heading;

    /**
     * @type {string}
     */
    this.subtitle = config.subtitle;

    /**
     * @type {string}
     */
    this.imageUrl = config.imageUrl;

    /**
     * @type {string}
     */
    this.backgroundColor = config.backgroundColor;

    /**
     * @type {string}
     */
    this.foregroundColor = config.foregroundColor;

    /**
     * @type {Element}
     */
    this.headerEl = document.querySelector('.js-OverlayHeader');
  }

  /**
   * Injects the Header Panel HTML and styling from the config into the DOM.
   */
  inject() {
    this._injectHeadingText();
    this._injectSubtitleText();
    this._injectImage();
    this._applyConfigStyling();
  }

  /**
   * Injects heading text into the existing panel heading element if heading text is
   * present in the config.
   */
  _injectHeadingText() {
    this.heading && this._injectText(this.heading, '.js-OverlayHeader-title');
  }

  /**
   * Injects subtitle text into the existing panel subtitle element if subtitle text is
   * present in the config.
   */
  _injectSubtitleText() {
    this.subtitle && this._injectText(this.subtitle, '.js-OverlayHeader-subtitle');
  }

  /**
   * Injects an image into the existing image wrapper element in the panel if an imageUrl
   * is present in the panel config.
   */
  _injectImage() {
    if (!this.imageUrl) {
      return;
    }

    const imageEl = document.createElement('img');
    imageEl.classList.add('OverlayHeader-image');
    imageEl.src = this.imageUrl;

    const imageWrapperEl = this.headerEl.querySelector('.js-OverlayHeader-imageWrapper');
    imageWrapperEl.appendChild(imageEl);
  }

  /**
   * Injects styling for the header from the config
   */
  _applyConfigStyling() {
    if (this.backgroundColor) {
      const darkerColor = new ColorManipulator().shade(-0.55, this.backgroundColor);
      this.headerEl.style['background-color'] = this.backgroundColor; /* For browsers that do not support gradients */
      this.headerEl.style['background-image'] = `linear-gradient(${this.backgroundColor}, ${darkerColor})`;
    }

    if (this.foregroundColor) {
      this.headerEl.style.color = this.foregroundColor;
    }
  }

  /**
   * Injects text into the first element matching the selector found in the header element
   *
   * @param {string} text
   * @param {string} selector
   */
  _injectText(text, selector) {
    const el = this.headerEl.querySelector(selector);
    el && (el.innerText = text);
  }
}
