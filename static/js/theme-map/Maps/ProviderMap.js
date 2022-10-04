import { Type, assertType, assertInstance } from '../Util/Assertions.js';
import { MapProvider } from './MapProvider.js';

/**
 * {@link ProviderMap} options class
 */
class ProviderMapOptions {
  /**
   * @param {MapProvider} provider
   * @param {HTMLElement} wrapper The wrapper element that the map will be inserted into
   */
  constructor(provider, wrapper) {
    assertInstance(provider, MapProvider);
    assertInstance(wrapper, HTMLElement);

    this.providerMapClass = provider.getMapClass();
    this.wrapper = wrapper;

    this.controlEnabled = true;
    this.panHandler = () => {};
    this.panStartHandler = () => {};
    this.dragEndHandler = () => {};
    this.zoomChangedHandler = () => {};
    this.zoomEndHandler = () => {};
    this.canvasClickHandler = () => {};
    this.loadHandler = () => {};
    this.providerOptions = {};
    this.locale = 'en';
  }

  /**
   * @param {string} locale The locale used in map
   */
   withLocale(locale) {
    this.locale = locale;
    return this;
  }

  /**
   * @param {boolean} controlEnabled Whether the user can interact with the map
   * @returns {ProviderMapOptions}
   */
  withControlEnabled(controlEnabled) {
    this.controlEnabled = controlEnabled;
    return this;
  }

  /**
   * @typedef ProviderMap~loadHandler
   * @function
   */

  withLoadHandler(handler) {
    assertType(handler, Type.FUNCTION);
    this.loadHandler = handler;
    return this;
  }

  /**
   * @typedef ProviderMap~panHandler
   * @function
   */

  /**
   * @param {ProviderMap~panHandler} panHandler Function called after the map bounds change
   * @returns {ProviderMapOptions}
   */
  withPanHandler(panHandler) {
    assertType(panHandler, Type.FUNCTION);

    this.panHandler = panHandler;
    return this;
  }

  /**
   * @typedef ProviderMap~panStartHandler
   * @function
   */

  /**
   * @param {ProviderMap~panStartHandler} panStartHandler Function called before the map bounds change
   * @returns {ProviderMapOptions}
   */
  withPanStartHandler(panStartHandler) {
    assertType(panStartHandler, Type.FUNCTION);

    this.panStartHandler = panStartHandler;
    return this;
  }

  /**
   * @typedef ProviderMap~dragEndHandler
   * @function
   */

  /**
   * @param {ProviderMap~dragEndHandler} dragEndHandler Function called after the map is dragged
   * @returns {ProviderMapOptions}
   */
  withDragEndHandler(dragEndHandler) {
    assertType(dragEndHandler, Type.FUNCTION);

    this.dragEndHandler = dragEndHandler;
    return this;
  }

  /**
   * @typedef ProviderMap~zoomChangedHandler
   * @function
   */

  /**
   * @param {ProviderMap~zoomChangedHandler} zoomChangedHandler Function called when the map starts a zoom change
   * @returns {ProviderMapOptions}
   */
  withZoomChangedHandler(zoomChangedHandler) {
    assertType(zoomChangedHandler, Type.FUNCTION);

    this.zoomChangedHandler = zoomChangedHandler;
    return this;
  }

  /**
   * @typedef ProviderMap~zoomEndHandler
   * @function
   */

  /**
   * @param {ProviderMap~zoomEndHandler} zoomEndHandler Function called when the map ends a zoom change
   * @returns {ProviderMapOptions}
   */
  withZoomEndHandler(zoomEndHandler) {
    assertType(zoomEndHandler, Type.FUNCTION);

    this.zoomEndHandler = zoomEndHandler;
    return this;
  }

  /**
   * @typedef ProviderMap~canvasClickHandler
   * @function
   */

  /**
   * @param {ProviderMap~canvasClickHandler} canvasClickHandler Function called when the map ends a zoom change
   * @returns {ProviderMapOptions}
   */
  withCanvasClickHandler(canvasClickHandler) {
    assertType(canvasClickHandler, Type.FUNCTION);

    this.canvasClickHandler = canvasClickHandler;
    return this;
  }

  /**
   * @param {Object} providerOptions A free-form object used to set any additional provider-specific options, usually by passing the object to the map's constructor
   * @returns {ProviderMapOptions}
   */
  withProviderOptions(providerOptions) {
    this.providerOptions = providerOptions;
    return this;
  }

  /**
   * @returns {ProviderMap} An instance of a subclass of {@link ProviderMap} for the given {@link MapProvider}
   */
  build() {
    const providerMapClass = this.providerMapClass;
    return new providerMapClass(this);
  }
}

/**
 * This class is an interface that should be implemented for each map provider, such as Google Maps.
 * It is used as an API for a {@link Map} to control a provider-specific map instance.
 * Ideally, this class should have minimal functionality so that adding a new provider is easy and
 * behavior is as consistent as possible across all providers.
 * @interface
 */
class ProviderMap {
  /**
   * The constructor creates a map instance using the provider's API and initializes it with all the
   * given options. See {@link ProviderMapOptions} for the supported options.
   * @param {ProviderMapOptions} options
   */
  constructor(options) {
    assertInstance(options, ProviderMapOptions);

    // When implementing a new MapProvider, call _panStartHandler when the map viewport starts
    // changing, and call _panHandler when it stops.
    this._panHandler = options.panHandler;
    this._panStartHandler = options.panStartHandler;
    this._dragEndHandler = options.dragEndHandler;
    this._zoomChangedHandler = options.zoomChangedHandler;
    this._zoomEndHandler = options.zoomEndHandler;
    this._canvasClickHandler = options.canvasClickHandler;
    this._loadHandler = options.loadHandler;
  }

  /**
   * @returns {Coordinate} The current center of the map
   */
  getCenter() {
    throw new Error('not implemented');
  }

  /**
   * Zoom level complies with the specifications in {@link Map#getZoom}
   * @returns {number} The current zoom level of the map
   */
  getZoom() {
    throw new Error('not implemented');
  }

  /**
   * @param {Coordinate} coordinate The new center for the map
   * @param {boolean} animated Whether to transition smoothly to the new center
   */
  setCenter(coordinate, animated) {
    throw new Error('not implemented');
  }

  /**
   * Zoom level complies with the specifications in {@link Map#getZoom}
   * @param {number} zoom The new zoom level for the map
   * @param {boolean} animated Whether to transition smoothly to the new zoom
   */
  setZoom(zoom, animated) {
    throw new Error('not implemented');
  }

  /**
   * @param {number} zoom
   * @param {Object} center Must be convertible to {@link Coordinate}
   * @param {boolean} animated Whether to transition smoothly to the new bounds
   * @see {@link ProviderMap#setZoom}
   * @see {@link ProviderMap#setCenter}
   */
  setZoomCenter(zoom, center, animated) {
    // This method doesn't need to be implemented for each provider,
    // but it can be overridden if this default function doesn't work.
    this.setZoom(zoom, animated);
    this.setCenter(center, animated);
  }
}

export {
  ProviderMapOptions,
  ProviderMap
};
