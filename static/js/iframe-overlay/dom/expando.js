import { ActionTypes } from '../constants';
import Stylist from './stylist';

/**
 * Expando is responsible for handling the resizing of the Overlay.
 */
export default class Expando {
  constructor(config) {
    /**
     * @type {Stylist}
     */
    this._stylist = new Stylist({
      iframeEl: config.iframeEl,
      buttonFrameEl: config.buttonFrameEl,
      iframeBackground: config.iframeBackground,
      alignment: config.alignment
    });

    /**
     * @type {boolean}
     */
    this._hideButtonWhenCollapsed = config.hideButtonWhenCollapsed;

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
   * Begins showing the Overlay button and sets up the styling using the button
   * size information provided.
   *
   * @param {Object} size
   */
  start(size) {
    this._stylist.setMinHeight(size.totalHeight);
    this._addMediaQueryListener();

    this.shrink();
    this.collapse();

    if (!this._hideButtonWhenCollapsed) {
      this._stylist.showButton();
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
    this._stylist.applyCollapsedStyling();

    if (this._hideButtonWhenCollapsed) {
      this._stylist.hideButton();
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
      this._stylist.showButton();
    }
    this._stylist.applyExpandedStyling(this._isTaller);

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
    this._stylist.applyTallerStyling();
  }

  /**
   * Shrinks the overlay to its shorter size
   */
  shrink() {
    if (!this._isTaller) {
      return;
    }
    this._isTaller = false;
    this._stylist.applyShorterStyling();
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
    this._updateStyling(mediaQuery.matches);

    mediaQuery.addListener((e) => {
      this._updateStyling(e.matches);
    });
  }

  /**
   * Updates the styling depending on whether the Overlay is mobile or not
   */
  _updateStyling(isMobile) {
    if (isMobile) {
      this._stylist.applyMobileStyling();
    } else {
      this._stylist.applyDesktopStyling();
    }
  }
}