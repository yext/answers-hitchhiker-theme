import ColorManipulator from './colormanipulator';

/**
 * This class is responsible adding properties to the Header Panel as specified in
 * the Overlay config.
 */
export default class HeaderPanelInfuser {
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
   * Adds properties dynamically into the Header Panel
   */
  infuse() {
    this._setHeadingText();
    this._setSubtitleText();
    this._injectImage();
    this._applyConfigStyling();
  }

  /**
   * Sets heading text of the existing panel heading element if heading text and title element
   * exist
   */
  _setHeadingText() {
    this.heading && this._setText(this.heading, '.js-OverlayHeader-title');
  }

  /**
   * Sets subtitle text of the existing panel subtitle element if subtitle text and subtitle element
   * exist
   */
  _setSubtitleText() {
    this.subtitle && this._setText(this.subtitle, '.js-OverlayHeader-subtitle');
  }

  /**
   * Injects an image into the existing the image wrapper element if an imageUrl is present in
   * the panel config.
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
   * Applies styling for the header from the config
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
   * Sets inner text of the first element matching the selector found in the header element
   *
   * @param {string} text
   * @param {string} selector
   */
  _setText(text, selector) {
    const el = this.headerEl.querySelector(selector);
    el && (el.innerText = text);
  }
}
