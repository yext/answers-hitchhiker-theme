import { ActionTypes, AnimationStyling } from '../constants';
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

    if (!this._hideButtonWhenCollapsed) {
      this._stylist.showButton();
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
    if (this._shape.isExpanded) {
      return;
    }
    this._shape.isExpanded = true;

    if (this._hideButtonWhenCollapsed) {
      this._stylist.showButton();
    }

    const height = this._shape.isTaller
      ? AnimationStyling.CONTAINER_HEIGHT_TALLER
      : this._shape.minHeight;
    this._stylist.applyExpandedStyling(height, this._shape.width);

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
    this._stylist.applyTallerStyling();
  }

  /**
   * Shrinks the overlay to its shorter size
   */
  shrink() {
    if (!this._shape.isTaller) {
      return;
    }
    this._shape.isTaller = false;
    this._stylist.applyShorterStyling(this._shape.minHeight, this._shape.width);
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
    if (mediaQuery.matches) {
      this._stylist.applyMobileStyling();
    } else {
      this._stylist.applyDesktopStyling();
    }

    mediaQuery.addListener((e) => {
      if (e.matches) {
        this._stylist.applyMobileStyling();
      } else {
        this._stylist.applyDesktopStyling();
      }
    });
  }
}