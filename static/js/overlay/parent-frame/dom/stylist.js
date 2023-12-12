import { Selectors } from '../constants';
import { AnimationStyling } from '../../shared/constants';

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

    /**
     * @type {string}
     */
    this._buttonHeight = AnimationStyling.DEFAULT_BUTTON_SIZE;

    /**
     * @type {string}
     */
    this._buttonWidth = AnimationStyling.DEFAULT_BUTTON_SIZE;
  }

  /**
   * Initializes the styling
   *
   * @param {number} minHeight
   */
  init(minHeight) {
    this._setMinHeight(minHeight);
    this._addButtonHoverState();
    this._addMediaQueryListener();
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
      : `${this._minHeight}px`;

    this._overlayContainerEl.style['transition'] =
      `box-shadow ${AnimationStyling.TRANSITION_TIMING}`;
    this._overlayContainerEl.style['box-shadow'] = AnimationStyling.BOX_SHADOW_NORMAL;

    this._buttonFrameEl.style['transition'] = `width ${AnimationStyling.TRANSITION_TIMING}`;
    this._buttonFrameEl.style['height'] = `${AnimationStyling.DEFAULT_BUTTON_SIZE}px`;
    this._buttonFrameEl.style['width'] = `${AnimationStyling.DEFAULT_BUTTON_SIZE}px`;
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

    this._buttonFrameEl.style['transition'] = `width ${AnimationStyling.TRANSITION_TIMING}`;
    this._buttonFrameEl.style['height'] = `${this._buttonHeight}px`;
    this._buttonFrameEl.style['width'] = `${this._buttonWidth}px`;
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
    this._iframeWrapperEl.style['height'] = `${this._minHeight}px`;
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
   * Sets the size of the button
   *
   * @param {Object}
   */
  setButtonSize({ height, width }) {
    this._buttonHeight = height;
    this._buttonWidth = Math.min(AnimationStyling.MAX_BUTTON_WIDTH, width);

    this._buttonFrameEl.style['width'] = `${this._buttonWidth}px`;
    this._buttonFrameEl.style['height'] = `${this._buttonHeight}px`;
  }

  /**
   * Adds a button hover state
   */
  _addButtonHoverState() {
    this._buttonFrameEl.addEventListener('mouseover', function () {
      this.style['transition'] = '0.18s box-shadow';
      this.style['box-shadow'] = AnimationStyling.BOX_SHADOW_ACTIVE;
    });

    this._buttonFrameEl.addEventListener('mouseout', function () {
      this.style['transition'] = '0.18s box-shadow';
      this.style['box-shadow'] = AnimationStyling.BOX_SHADOW_NORMAL;
    });
  }

  /**
   * Updates the Overlay sizing values (if necessary) when the viewport size changes.
   */
  _addMediaQueryListener() {
    const mediaQuery = window.matchMedia("(max-width: 767px)");
    this._updateStyling(mediaQuery.matches);

    mediaQuery.addListener((e) => {
      this._updateStyling(e.matches);
    });
  }

  /**
   * Updates the styling for the current screensize
   *
   * @param {boolean} isMobile
   */
  _updateStyling(isMobile) {
    if (isMobile) {
      this._currentWidth = AnimationStyling.WIDTH_MOBILE;
      this._iframeWrapperEl.style['width'] = this._currentWidth;
      this._overlayContainerEl.style[this._alignment] = 0;
      this._overlayContainerEl.style['bottom'] = 0;
      this._overlayContainerEl.style['max-width'] = AnimationStyling.MAX_WIDTH_MOBILE;
      this._overlayContainerEl.style['max-height'] = AnimationStyling.MAX_HEIGHT_MOBILE;
    } else {
      this._currentWidth = AnimationStyling.WIDTH_DESKTOP;
      this._iframeWrapperEl.style['width'] = this._currentWidth;
      this._overlayContainerEl.style[this._alignment] = AnimationStyling.BASE_SPACING;
      this._overlayContainerEl.style['bottom'] = AnimationStyling.BASE_SPACING;
      this._overlayContainerEl.style['max-width'] = AnimationStyling.MAX_WIDTH_DESKTOP;
      this._overlayContainerEl.style['max-height'] = AnimationStyling.MAX_HEIGHT_DESKTOP;
    }
  }

  /**
   * Sets the minimum height of the Overlay. If the minimum height provided is less than
   * the minimum height lower bound, this function has no effect.
   *
   * @param {string} minHeight
   */
  _setMinHeight(minHeight) {
    this._minHeight = Math.max(AnimationStyling.MIN_HEIGHT, minHeight);
  }
}