import { ActionTypes, AnimationStyling, Selectors } from '../constants';

/**
 * Expando is responsible for handling the resizing of the Overlay.
 */
export default class Expando {
  constructor() {
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
    this._isExpanded = true;

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
  showButton(size) {
    this._buttonWidth = size.width;
    this._buttonHeight = size.height;
    this._shorterHeight = `${size.totalHeight}px`;

    this.shrink();
    this.collapse();

    setTimeout(() => {
      this._iframeWrapperEl.classList.remove('initial');
    }, 100);
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
    this._iframeEl.style['background-color'] = 'transparent';
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
    this._iframeEl.style['background-color'] = AnimationStyling.BACKGROUND_COLOR_NORMAL;

    this._iframeWrapperEl.style['transition'] = `box-shadow ${AnimationStyling.SIZE_TIMING}`;
    this._iframeWrapperEl.style['transition-delay'] = AnimationStyling.SIZE_TIMING;
    this._iframeWrapperEl.style['box-shadow'] = AnimationStyling.BOX_SHADOW_NORMAL;
    this._iframeWrapperEl.style['width'] = AnimationStyling.WIDTH_DESKTOP;
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
    this._iframeWrapperEl.style['width'] = AnimationStyling.WIDTH_DESKTOP;
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
    this._iframeWrapperEl.style['width'] = AnimationStyling.WIDTH_DESKTOP;
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
}