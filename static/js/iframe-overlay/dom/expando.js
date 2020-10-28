import { ActionTypes, AnimationStyling, Selectors } from '../constants';

/**
 * Expando is responsible for handling the resizing of the Overlay.
 */
export default class Expando {
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
     * @type {boolean}
     */
    this._hideButtonWhenCollapsed = config.hideButtonWhenCollapsed;

    /**
     * @type {string}
     */
    this._alignment = alignment;

    /**
     * @type {boolean}
     */
    this._isExpanded = false;

    /**
     * @type {boolean}
     */
    this._isTaller = true;

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
  showOverlay(size) {
    this._isExpanded = true;

    const initialHeight = Math.max(AnimationStyling.MIN_HEIGHT, size.totalHeight);
    this._shorterHeight = `${initialHeight}px`;

    this._addMediaQueryListener();
    this.shrink();
    this.collapse();

    if (!this._hideButtonWhenCollapsed) {
      this._showButton();
    }
  }

  /**
   * Collapses the Overlay
   */
  collapse() {
    if (!this._isExpanded) {
      return;
    }
    this._isExpanded = false;

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

    if (this._hideButtonWhenCollapsed) {
      this._buttonFrameEl.style['opacity'] = '0';
      this._buttonFrameEl.style['z-index'] = AnimationStyling.ZINDEX_HIDDEN;
      this._buttonFrameEl.style['pointer-events'] = 'none';
    }
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

    if (this._hideButtonWhenCollapsed) {
      this._showButton();
    }

    this._iframeEl.style['background'] = this._iframeBackground;
    this._iframeEl.style['opacity'] = '1'; // For IE11
    this._iframeEl.style['transition'] = `opacity ${AnimationStyling.TRANSITION_TIMING}`;

    this._iframeWrapperEl.style['pointer-events'] = 'all';
    this._iframeWrapperEl.style['z-index'] = AnimationStyling.ZINDEX_ALMOST_FRONTMOST;
    this._iframeWrapperEl.style['opacity'] = '1';
    this._iframeWrapperEl.style['transition'] = `opacity ${AnimationStyling.TRANSITION_TIMING}`;
    this._iframeWrapperEl.style['width'] = this._overlayWidth;
    this._iframeWrapperEl.style['height'] = this._isTaller
      ? AnimationStyling.CONTAINER_HEIGHT_TALLER
      : this._shorterHeight;

    this._overlayContainerEl.style['transition'] =
      `box-shadow ${AnimationStyling.TRANSITION_TIMING}`;
    this._overlayContainerEl.style['box-shadow'] = AnimationStyling.BOX_SHADOW_NORMAL;

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

    this._iframeWrapperEl.style['transition'] = `${AnimationStyling.TRANSITION_TIMING} ease all`;
    this._iframeWrapperEl.style['width'] = this._overlayWidth;
    this._iframeWrapperEl.style['height'] = AnimationStyling.CONTAINER_HEIGHT_TALLER;
  }

  /**
   * Shrinks the overlay to its shorter size
   */
  shrink() {
    if (!this._isTaller) {
      return;
    }
    this._isTaller = false;

    this._iframeWrapperEl.style['transition'] = `${AnimationStyling.TRANSITION_TIMING} ease all`;
    this._iframeWrapperEl.style['width'] = this._overlayWidth;
    this._iframeWrapperEl.style['height'] = this._shorterHeight;
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
    this._updateCalculatedWidth(mediaQuery.matches);
    this._updateOverlayContainerSpacing(mediaQuery.matches);

    mediaQuery.addListener((e) => {
      this._updateCalculatedWidth(e.matches);
      this._updateOverlayContainerSpacing(e.matches);
    });
  }

  /**
   * Updates the Overlay width depending on whether the window size is mobile-sized or
   * not
   *
   * @param {boolean} isMobile
   */
  _updateCalculatedWidth(isMobile) {
    this._overlayWidth = isMobile
      ? AnimationStyling.WIDTH_MOBILE
      : AnimationStyling.WIDTH_DESKTOP;
  }

  /**
   * Updates the Overlay container's width depending on whether the window size is mobile-sized
   * or not
   *
   * @param {boolean} isMobile
   */
  _updateOverlayContainerSpacing(isMobile) {
    if (isMobile) {
      this._overlayContainerEl.style[this._alignment] = 0;
      this._overlayContainerEl.style['bottom'] = 0;
      this._overlayContainerEl.style['max-width'] = AnimationStyling.MAX_WIDTH_MOBILE;
      this._overlayContainerEl.style['max-height'] = AnimationStyling.MAX_HEIGHT_MOBILE;
    } else {
      this._overlayContainerEl.style[this._alignment] = AnimationStyling.BASE_SPACING;
      this._overlayContainerEl.style['bottom'] = AnimationStyling.BASE_SPACING;
      this._overlayContainerEl.style['max-width'] = AnimationStyling.MAX_WIDTH_DESKTOP;
      this._overlayContainerEl.style['max-height'] = AnimationStyling.MAX_HEIGHT_DESKTOP;
    }
  }

  /**
   * Adds styling to display the button
   */
  _showButton() {
    this._buttonFrameEl.style['z-index'] = AnimationStyling.ZINDEX_FRONTMOST;
    this._buttonFrameEl.style['opacity'] = '1';
    this._buttonFrameEl.style['pointer-events'] = 'all';
  }
}