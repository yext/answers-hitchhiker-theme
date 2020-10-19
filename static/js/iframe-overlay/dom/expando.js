import { ActionTypes, AnimationStyling, Selectors } from '../constants';

/**
 * Expando is responsible for handling the resizing of the Overlay.
 */
export default class Expando {
  constructor(iframeBackground) {
    /**
     * @type {Element}
     */
    this._iframeEl = document.querySelector(`#${Selectors.IFRAME_ID}`);

    /**
     * @type {Element}
     */
    this._iframeWrapperEl = document.querySelector(`#${Selectors.IFRAME_CONTAINER_ID}`);

    /**
     * @type {boolean}
     */
    this._isExpanded = false;

    /**
     * @type {boolean}
     */
    this._isTaller = true;

    /**
     * @type {string}
     */
    this._iframeBackground = iframeBackground;

    /**
     * @type {function}
     */
    this._expandCallback = function() {};

    /**
     * @type {function}
     */
    this._collapseCallback = function() {};
  }

  /**
   * Shows the overlay button using the button size information provided.
   *
   * @param {Object} size
   */
  showButton(size) {
    this._isExpanded = true;
    this._buttonWidth = `${size.width}px`;
    this._buttonHeight = `${size.height}px`;

    const initialHeight = Math.max(AnimationStyling.MIN_HEIGHT, size.totalHeight);
    this._shorterHeight = `${initialHeight}px`;

    this._addMediaQueryListener();
    this.shrink();
    this.collapse();

    setTimeout(() => {
      this._iframeWrapperEl.style['z-index'] = '2147483639';
      this._iframeWrapperEl.style['opacity'] = '1';
    }, 250);
  }

  /**
   * Collapses the Overlay
   */
  collapse() {
    if (!this._isExpanded) {
      return;
    }
    this._isExpanded = false;

    this._iframeEl.scrolling = 'no';
    this._iframeEl.style['background'] = 'transparent';
    this._iframeEl.style['transition'] = `background-color ${AnimationStyling.FADE_TIMING}`;
    this._iframeEl.style['transition-delay'] = '0s';

    this._iframeWrapperEl.style['transition'] =
      `height ${AnimationStyling.SIZE_TIMING}, width ${AnimationStyling.SIZE_TIMING}`;
    this._iframeWrapperEl.style['transition-delay'] = AnimationStyling.FADE_TIMING;
    this._iframeWrapperEl.style['width'] = this._buttonWidth;
    this._iframeWrapperEl.style['height'] = this._buttonHeight;
    this._iframeWrapperEl.style['box-shadow'] = AnimationStyling.BOX_SHADOW_NONE;

    this._collapseCallback();
  }

  /**
   * Expands the overlay
   */
  expand() {
    if (this._isExpanded) {
      return;
    }
    this._isExpanded = true;

    this._iframeEl.scrolling = 'yes';
    this._iframeEl.style['transition'] = `background-color ${AnimationStyling.FADE_TIMING}`;
    this._iframeEl.style['transition-delay'] = AnimationStyling.SIZE_TIMING;
    this._iframeEl.style['background'] = this._iframeBackground;

    this._iframeWrapperEl.style['transition'] = `box-shadow ${AnimationStyling.SIZE_TIMING}`;
    this._iframeWrapperEl.style['transition-delay'] = AnimationStyling.SIZE_TIMING;
    this._iframeWrapperEl.style['box-shadow'] = AnimationStyling.BOX_SHADOW_NORMAL;
    this._iframeWrapperEl.style['width'] = this._overlayWidth;
    this._iframeWrapperEl.style['height'] = this._isTaller
      ? AnimationStyling.HEIGHT_TALLER
      : this._shorterHeight;

    this._expandCallback();
  }

  /**
   * Makes the overlay grow to its larger size
   */
  grow() {
    if (this._isTaller) {
      return;
    }
    this._isTaller = true;

    this._iframeWrapperEl.style['transition'] = `${AnimationStyling.SIZE_TIMING} ease all`;
    this._iframeWrapperEl.style['width'] = this._overlayWidth;
    this._iframeWrapperEl.style['height'] = AnimationStyling.HEIGHT_TALLER;
    this._iframeWrapperEl.style['box-shadow'] = AnimationStyling.BOX_SHADOW_NORMAL;
  }

  /**
   * Shrinks the overlay to its shorter size
   */
  shrink() {
    if (!this._isTaller) {
      return;
    }
    this._isTaller = false;

    this._iframeWrapperEl.style['transition'] = `${AnimationStyling.SIZE_TIMING} ease all`;
    this._iframeWrapperEl.style['width'] = this._overlayWidth;
    this._iframeWrapperEl.style['height'] = this._shorterHeight;
    this._iframeWrapperEl.style['box-shadow'] = AnimationStyling.BOX_SHADOW_NORMAL;
  }

  /**
   * Adds a callback to an action
   *
   * @param {ActionTypes} type
   * @param {function} callback
   */
  addCallback(type, callback) {
    switch (type) {
      case ActionTypes.EXPAND:
        this._expandCallback = callback;
        break;
      case ActionTypes.COLLAPSE:
        this._collapseCallback = callback;
        break;
      default:
        console.warn(`Callback type '${type}' not supported.`);
        break;
    }
  }

  /**
   * Returns a boolean indicating whether the Overlay is expanded
   *
   * @return {boolean}
   */
  isExpanded() {
    return this._isExpanded;
  }

  /**
   * Updates the Overlay sizing values (if necessary) when the viewport size changes.
   */
  _addMediaQueryListener() {
    const mediaQuery = window.matchMedia("(max-width: 767px)");
    this._updateOverlayWidth(mediaQuery.matches);

    mediaQuery.addListener((e) => {
      this._updateOverlayWidth(e.matches);
    });
  }

  /**
   * Updates the Overlay width depending on whether the window size is mobile-sized or
   * not
   *
   * @param {boolean} isMobile
   */
  _updateOverlayWidth(isMobile) {
    this._overlayWidth = isMobile
      ? AnimationStyling.WIDTH_MOBILE
      : AnimationStyling.WIDTH_DESKTOP;
  }
}