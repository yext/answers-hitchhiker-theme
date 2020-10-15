import { ActionTypes, Selectors } from '../constants';

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
  init(size) {
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
    this._iframeEl.style['transition'] = 'background-color .4s';
    this._iframeEl.style['transition-delay'] = '0s';

    this._iframeWrapperEl.style['transition'] = 'height .15s, width .15s';
    this._iframeWrapperEl.style['transition-delay'] = '.4s';
    this._iframeWrapperEl.style['width'] = this._buttonWidth;
    this._iframeWrapperEl.style['height'] = this._buttonHeight;
    this._iframeWrapperEl.style['box-shadow'] = '0 3px 10px 0 rgba(0,0,0,0)';

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
    this._iframeEl.style['background-color'] = '#eeeff0';
    this._iframeEl.style['transition'] = 'background-color .4s';
    this._iframeEl.style['transition-delay'] = '.15s';

    if (this._isTaller) {
      this._iframeWrapperEl.style['transition'] = '.15s ease all';
      this._iframeWrapperEl.style['width'] = '445px';
      this._iframeWrapperEl.style['height'] = 'calc(100% - 32px)';
      this._iframeWrapperEl.style['box-shadow'] = '0 3px 10px 0 rgba(0,0,0,0.4)';
    } else {
      this._iframeWrapperEl.style['transition'] = 'box-shadow .15s';
      this._iframeWrapperEl.style['width'] = '445px';
      this._iframeWrapperEl.style['height'] = this._shorterHeight;
      this._iframeWrapperEl.style['box-shadow'] = '0 3px 10px 0 rgba(0,0,0,0.4)';
    }

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

    this._iframeWrapperEl.style['transition'] = '.15s ease all';
    this._iframeWrapperEl.style['width'] = '445px';
    this._iframeWrapperEl.style['height'] = 'calc(100% - 32px)';
    this._iframeWrapperEl.style['box-shadow'] = '0 3px 10px 0 rgba(0,0,0,0.4)';
  }

  /**
   * Shrinks the overlay to its shorter size
   */
  shrink() {
    if (!this._isTaller) {
      return;
    }
    this._isTaller = false;
    this._iframeWrapperEl.style['transition'] = '.15s ease all';
    this._iframeWrapperEl.style['width'] = '445px';
    this._iframeWrapperEl.style['height'] = this._shorterHeight;
    this._iframeWrapperEl.style['box-shadow'] = '0 3px 10px 0 rgba(0,0,0,0.4)';
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