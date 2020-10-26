import { AnimationStyling, Selectors } from '../constants';

/**
 * Stylist is responsible for applying styling to the Overlay to update its shape
 */
export default class Stylist {
  constructor(config) {
    /**
     * @type {Element}
     */
    this._overlayContainerEl = document.querySelector(`#${Selectors.OVERLAY_CONTAINER_ID}`);

    /**
     * @type {Element}
     */
    this._iframeWrapperEl = document.querySelector(`#${Selectors.IFRAME_CONTAINER_ID}`);

    /**
     * @type {Element}
     */
    this._iframeEl = config.iframeEl;

    /**
     * @type {Element}
     */
    this._buttonFrameEl = config.buttonFrameEl;

    /**
     * @type {string}
     */
    this._iframeBackground = config.iframeBackground;

    /**
     * @type {string}
     */
    this._alignment = config.alignment;

    /**
     * @type {string}
     */
    this._currentWidth = AnimationStyling.WIDTH_DESKTOP;

    /**
     * @type {string}
     */
    this._minHeight = AnimationStyling.MIN_HEIGHT;
  }

  /**
   * Sets the minimum height of the Overlay. If the minimum height provided is less than
   * the minimum height lower bound, this function has no effect.
   *
   * @param {string} minHeight
   */
  setMinHeight(minHeight) {
    this._minHeight = Math.max(AnimationStyling.MIN_HEIGHT, minHeight);
  }

  /**
   * Styles the Overlay for its expanded state
   *
   * @param {boolean} isTaller
   */
  applyExpandedStyling(isTaller) {
    this._iframeEl.style['background'] = this._iframeBackground;
    this._iframeEl.style['opacity'] = '1'; // For IE11
    this._iframeEl.style['transition'] = `opacity ${AnimationStyling.TRANSITION_TIMING}`;

    this._iframeWrapperEl.style['pointer-events'] = 'all';
    this._iframeWrapperEl.style['z-index'] = AnimationStyling.ZINDEX_ALMOST_FRONTMOST;
    this._iframeWrapperEl.style['opacity'] = '1';
    this._iframeWrapperEl.style['transition'] = `opacity ${AnimationStyling.TRANSITION_TIMING}`;
    this._iframeWrapperEl.style['width'] = this._currentWidth;
    this._iframeWrapperEl.style['height'] = isTaller
      ? AnimationStyling.CONTAINER_HEIGHT_TALLER
      : this._minHeight;

    this._overlayContainerEl.style['transition'] =
      `box-shadow ${AnimationStyling.TRANSITION_TIMING}`;
    this._overlayContainerEl.style['box-shadow'] = AnimationStyling.BOX_SHADOW_NORMAL;
  }

  /**
   * Styles the Overlay for its collapsed state
   */
  applyCollapsedStyling() {
    this._iframeEl.style['transition'] =
      `opacity ${AnimationStyling.TRANSITION_TIMING}`;
    this._iframeEl.style['background'] = 'transparent';
    this._iframeEl.style['opacity'] = '0'; // For IE11

    this._iframeWrapperEl.style['transition'] =
      `opacity ${AnimationStyling.TRANSITION_TIMING}`;
    this._iframeWrapperEl.style['opacity'] = '0';
    this._iframeWrapperEl.style['z-index'] = AnimationStyling.ZINDEX_HIDDEN;
    this._iframeWrapperEl.style['pointer-events'] = 'none';

    this._overlayContainerEl.style['box-shadow'] = AnimationStyling.BOX_SHADOW_NONE;
  }

  /**
   * Styles the Overlay for its taller state
   */
  applyTallerStyling() {
    this._iframeWrapperEl.style['transition'] = `${AnimationStyling.TRANSITION_TIMING} ease all`;
    this._iframeWrapperEl.style['height'] = AnimationStyling.CONTAINER_HEIGHT_TALLER;
  }

  /**
   * Styles the Overlay for its shorter state
   */
  applyShorterStyling() {
    this._iframeWrapperEl.style['transition'] = `${AnimationStyling.TRANSITION_TIMING} ease all`;
    this._iframeWrapperEl.style['height'] = this._minHeight;
  }

  /**
   * Adds styling to display the button
   */
  showButton() {
    this._buttonFrameEl.style['z-index'] = AnimationStyling.ZINDEX_FRONTMOST;
    this._buttonFrameEl.style['opacity'] = '1';
    this._buttonFrameEl.style['pointer-events'] = 'all';
  }

  /**
   * Adds styling to hide the button
   */
  hideButton() {
    this._buttonFrameEl.style['opacity'] = '0';
    this._buttonFrameEl.style['z-index'] = AnimationStyling.ZINDEX_HIDDEN;
    this._buttonFrameEl.style['pointer-events'] = 'none';
  }

  /**
   * Applies mobile styling to the Overlay
   */
  applyMobileStyling() {
    this._currentWidth = AnimationStyling.WIDTH_MOBILE;

    this._iframeWrapperEl.style['width'] = this._currentWidth;
    this._overlayContainerEl.style[this._alignment] = 0;
    this._overlayContainerEl.style['bottom'] = 0;
    this._overlayContainerEl.style['max-width'] = AnimationStyling.MAX_WIDTH_MOBILE;
    this._overlayContainerEl.style['max-height'] = AnimationStyling.MAX_HEIGHT_MOBILE;
  }

  /**
   * Applies desktop styling to the Overlay
   */
  applyDesktopStyling() {
    this._currentWidth = AnimationStyling.WIDTH_DESKTOP;

    this._iframeWrapperEl.style['width'] = this._currentWidth;
    this._overlayContainerEl.style[this._alignment] = AnimationStyling.BASE_SPACING;
    this._overlayContainerEl.style['bottom'] = AnimationStyling.BASE_SPACING;
    this._overlayContainerEl.style['max-width'] = AnimationStyling.MAX_WIDTH_DESKTOP;
    this._overlayContainerEl.style['max-height'] = AnimationStyling.MAX_HEIGHT_DESKTOP;
  }
}