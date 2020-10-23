import { ActionTypes, AnimationStyling, Selectors } from '../constants';

/**
 * Expando is responsible for handling the resizing of the Overlay.
 */
export default class Expando {
  constructor(config) {
    /**
     * The elements that are affected by the resizing in this class. These
     * are of @type {Element}
     */
    this._elements = {
      overlayContainer: document.querySelector(`#${Selectors.OVERLAY_CONTAINER_ID}`),
      iframeWrapper: document.querySelector(`#${Selectors.IFRAME_CONTAINER_ID}`),
      iframe: config.iframeEl,
      buttonFrame: config.buttonFrameEl,
    };

    /**
     * Specific styling in the animation is configurable; this object contains the
     * animation styling properties that are not constant
     */
    this._configurableStyling = {
      /**
       * @type {string}
       */
      iframeBackground: config.iframeBackground,
      /**
       * @type {boolean}
       */
      hideButtonWhenCollapsed: config.hideButtonWhenCollapsed,
      /**
       * @type {string}
       */
      alignment: config.alignment,
    };

    /**
     * Used to track the state of the Overlay shape
     */
    this._shape = {
      /**
       * @type {boolean}
       */
      isExpanded: false,
      /**
       * @type {boolean}
       */
      isTaller: true,
      /**
       * @type {string}
       */
      width: AnimationStyling.WIDTH_DESKTOP,
      /**
       * @type {string}
       */
      minHeight: AnimationStyling.MIN_HEIGHT
    };

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
    this._shape.isExpanded = true;

    const initialHeight = Math.max(AnimationStyling.MIN_HEIGHT, size.totalHeight);
    this._shape.minHeight = `${initialHeight}px`;

    this._addMediaQueryListener();
    this.shrink();
    this.collapse();

    if (!this._configurableStyling.hideButtonWhenCollapsed) {
      this._showButton();
    }
  }

  /**
   * Collapses the Overlay
   */
  collapse() {
    if (!this._shape.isExpanded) {
      return;
    }
    this._shape.isExpanded = false;

    this._elements.iframe.style['transition'] =
      `opacity ${AnimationStyling.TRANSITION_TIMING}`;
    this._elements.iframe.style['background'] = 'transparent';
    this._elements.iframe.style['opacity'] = '0'; // For IE11

    this._elements.iframeWrapper.style['transition'] =
      `opacity ${AnimationStyling.TRANSITION_TIMING}`;
    this._elements.iframeWrapper.style['opacity'] = '0';
    this._elements.iframeWrapper.style['z-index'] = AnimationStyling.ZINDEX_HIDDEN;
    this._elements.iframeWrapper.style['pointer-events'] = 'none';

    this._elements.overlayContainer.style['box-shadow'] = AnimationStyling.BOX_SHADOW_NONE;

    if (this._configurableStyling.hideButtonWhenCollapsed) {
      this._hideButton();
    }
    this._collapseCallback();
  }

  /**
   * Expands the overlay
   */
  expand() {
    if (this._shape.isExpanded) {
      return;
    }
    this._shape.isExpanded = true;

    if (this._configurableStyling.hideButtonWhenCollapsed) {
      this._showButton();
    }

    this._elements.iframe.style['background'] = this._configurableStyling.iframeBackground;
    this._elements.iframe.style['opacity'] = '1'; // For IE11
    this._elements.iframe.style['transition'] = `opacity ${AnimationStyling.TRANSITION_TIMING}`;

    this._elements.iframeWrapper.style['pointer-events'] = 'all';
    this._elements.iframeWrapper.style['z-index'] = AnimationStyling.ZINDEX_ALMOST_FRONTMOST;
    this._elements.iframeWrapper.style['opacity'] = '1';
    this._elements.iframeWrapper.style['transition'] = `opacity ${AnimationStyling.TRANSITION_TIMING}`;
    this._elements.iframeWrapper.style['width'] = this._shape.width;
    this._elements.iframeWrapper.style['height'] = this._shape.isTaller
      ? AnimationStyling.CONTAINER_HEIGHT_TALLER
      : this._shape.minHeight;

    this._elements.overlayContainer.style['transition'] =
      `box-shadow ${AnimationStyling.TRANSITION_TIMING}`;
    this._elements.overlayContainer.style['box-shadow'] = AnimationStyling.BOX_SHADOW_NORMAL;

    this._expandCallback();
  }

  /**
   * Makes the overlay grow to its larger size
   */
  grow() {
    if (this._shape.isTaller) {
      return;
    }
    this._shape.isTaller = true;

    this._elements.iframeWrapper.style['transition'] = `${AnimationStyling.TRANSITION_TIMING} ease all`;
    this._elements.iframeWrapper.style['width'] = this._shape.width;
    this._elements.iframeWrapper.style['height'] = AnimationStyling.CONTAINER_HEIGHT_TALLER;
  }

  /**
   * Shrinks the overlay to its shorter size
   */
  shrink() {
    if (!this._shape.isTaller) {
      return;
    }
    this._shape.isTaller = false;

    this._elements.iframeWrapper.style['transition'] = `${AnimationStyling.TRANSITION_TIMING} ease all`;
    this._elements.iframeWrapper.style['width'] = this._shape.width;
    this._elements.iframeWrapper.style['height'] = this._shape.minHeight;
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
    return this._shape.isExpanded;
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
    this._shape.width = isMobile
      ? AnimationStyling.WIDTH_MOBILE
      : AnimationStyling.WIDTH_DESKTOP;
  }

  /**
   * Adds styling to display the button
   */
  _showButton() {
    this._elements.buttonFrame.style['z-index'] = AnimationStyling.ZINDEX_FRONTMOST;
    this._elements.buttonFrame.style['opacity'] = '1';
    this._elements.buttonFrame.style['pointer-events'] = 'all';
  }

  /**
   * Adds styling to hide the button
   */
  _hideButton() {
    this._elements.buttonFrame.style['opacity'] = '0';
    this._elements.buttonFrame.style['z-index'] = AnimationStyling.ZINDEX_HIDDEN;
    this._elements.buttonFrame.style['pointer-events'] = 'none';
  }
}