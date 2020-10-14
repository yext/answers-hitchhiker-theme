import { ActionTypes, Selectors } from '../constants';

/**
 * Expando is responsible for handling the resizing of the Overlay.
 */
export default class Expando {
  constructor(isRightAligned = true) {
    /**
     * @type {boolean}
     */
    this._isRightAligned = isRightAligned;

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
    // TODO (agrow) inject CSS animations in a later PR

    this.collapse();
    this._iframeWrapperEl.classList.add('AnswersOverlay--visible');
    this._iframeWrapperEl.classList.add('AnswersOverlay--preload');

    setTimeout(() => {
      this._iframeWrapperEl.classList.remove('AnswersOverlay--initial');
      this._iframeWrapperEl.classList.remove('AnswersOverlay--preload');
    }, 800);
  }

  /**
   * Collapses the Overlay
   */
  collapse() {
    if (!this._isExpanded) {
      return;
    }
    this._iframeEl.scrolling = 'no';
    this._isExpanded = false;
    this._iframeWrapperEl.classList.remove('AnswersOverlay--reverse');
    this._iframeWrapperEl.classList.add('AnswersOverlay--collapsed');
    this._iframeWrapperEl.classList.remove('AnswersOverlay--expanded');

    this._collapseCallback();
  }

  /**
   * Expands the overlay
   */
  expand() {
    if (this._isExpanded) {
      return;
    }
    this._iframeEl.scrolling = 'yes';
    this._isExpanded = true;
    this._iframeWrapperEl.classList.remove('AnswersOverlay--reverse');
    this._iframeWrapperEl.classList.remove('AnswersOverlay--collapsed');
    this._iframeWrapperEl.classList.add('AnswersOverlay--expanded');

    this._expandCallback();
  }

  /**
   * Makes the overlay grow to its larger size
   */
  grow() {
    this._iframeWrapperEl.classList.remove('AnswersOverlay--reverse');
    this._iframeWrapperEl.classList.add('AnswersOverlay--isTaller');
  }

  /**
   * Shrinks the overlay to its shorter size
   */
  shrink() {
    this._iframeWrapperEl.classList.add('AnswersOverlay--reverse');
    this._iframeWrapperEl.classList.remove('AnswersOverlay--isTaller');
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