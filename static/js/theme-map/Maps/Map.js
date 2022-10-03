import { Unit, Projection } from '../Geo/constants.js';
import { Coordinate } from '../Geo/Coordinate.js';
import { GeoBounds } from '../Geo/GeoBounds.js';
import { Type, assertType, assertInstance } from '../Util/Assertions.js';
import { MapPinOptions } from './MapPin.js';
import { MapProvider } from './MapProvider.js';
import { ProviderMapOptions } from './ProviderMap.js';
import ZoomTriggers from './ZoomTriggers.js';
import PanTriggers from './PanTriggers.js';

/**
 * The maximum percent of the map height or width that can be taken up by padding.
 * It's a number arbitrarily close to 1, because if total padding is >= 1 there's no space for pins.
 * This shouldn't need to be changed. To set a Map's padding use {@link Map#setPadding}.
 * @memberof Map
 * @inner
 * @constant {number}
 * @default
 */
const MAX_PADDING = 0.98;

/**
 * Padding values are given in pixels as a number or a function that returns a number.
 * They need to be converted to a non-negative fraction of the map's current height or width.
 * @param {number|Map~paddingFunction} value Minimum number of pixels between the map's edge and a pin
 * @param {number} basis The measurement that the padding will be a fraction of
 * @returns {number} The padding value as a fraction of basis
 */
function normalizePadding(value, basis) {
  return Math.max(typeof value == Type.FUNCTION ? value() : value || 0, 0) / basis;
}

/**
 * {@link Map} options class
 */
class MapOptions {
  /**
   * Initialize with default options
   */
  constructor() {
    this.controlEnabled = true;
    this.defaultCenter = new Coordinate(39.83, -98.58); // Center of the USA
    this.defaultZoom = 4;
    this.legendPins = [];
    this.padding = { bottom: () => 50, left: () => 50, right: () => 50, top: () => 50 };
    this.panHandler = (previousBounds, currentBounds) => {};
    this.panStartHandler = currentBounds => {};
    this.dragEndHandler = () => {};
    this.zoomChangedHandler = () => {};
    this.zoomEndHandler = () => {};
    this.canvasClickHandler = () => {};
    this.loadHandler = () => {};
    this.provider = null;
    this.providerOptions = {};
    this.singlePinZoom = 14;
    this.wrapper = null;
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
   * @param {boolean} controlEnabled Whether the user can move and zoom the map
   * @returns {MapOptions}
   */
  withControlEnabled(controlEnabled) {
    this.controlEnabled = controlEnabled;
    return this;
  }

  /**
   * @param {Coordinate} defaultCenter The center on initial load and when calling {@link Map#fitCoordinates} with an empty array
   * @returns {MapOptions}
   */
   withDefaultCenter(defaultCenter) {
    this.defaultCenter = new Coordinate(defaultCenter);
    return this;
  }

  /**
   * @param {number} defaultZoom The zoom on initial load and when calling {@link Map#fitCoordinates} with an empty array
   * @returns {MapOptions}
   */
   withDefaultZoom(defaultZoom) {
    this.defaultZoom = defaultZoom;
    return this;
  }

  /**
   * @todo GENERATOR TODO Map legend not yet implemented
   * @param {MapPin[]} legendPins Pins used to construct the map legend
   * @returns {MapOptions}
   */
  withLegendPins(legendPins) {
    this.legendPins = Array.from(legendPins);
    return this;
  }

  /**
   * Padding is used by {@link Map#fitCoordinates}.
   * Padding can either be constant values or funtions that return a padding value.
   * See {@link Map#setPadding} for more information.
   * @param {Object} padding
   * @param {number|Map~paddingFunction} padding.bottom Minimum number of pixels between the map's bottom edge and a pin
   * @param {number|Map~paddingFunction} padding.left Minimum number of pixels between the map's left edge and a pin
   * @param {number|Map~paddingFunction} padding.right Minimum number of pixels between the map's right edge and a pin
   * @param {number|Map~paddingFunction} padding.top Minimum number of pixels between the map's top edge and a pin
   * @returns {MapOptions}
   * @see {@link Map#setPadding}
   */
  withPadding(padding) {
    this.padding = padding;
    return this;
  }

  /**
   * @typedef Map~panHandler
   * @function
   * @param {GeoBounds} previousBounds The map bounds before the move
   * @param {GeoBounds} currentBounds The map bounds after the move
   */

  /**
   * @param {Map~panHandler} panHandler
   * @returns {MapOptions}
   */
  withPanHandler(panHandler) {
    assertType(panHandler, Type.FUNCTION);

    this.panHandler = panHandler;
    return this;
  }

  /**
   * @typedef Map~handler
   * @function
   */

  /**
   * @param {Map~handler} handler
   * @returns {MapOptions}
   */
  withLoadHandler(handler) {
    assertType(handler, Type.FUNCTION);

    this.handler = handler;
    return this;
  }

  /**
   * @typedef Map~panStartHandler
   * @function
   * @param {GeoBounds} currentBounds The map bounds before the move
   */

  /**
   * @param {Map~panStartHandler} panStartHandler
   * @returns {MapOptions}
   */
  withPanStartHandler(panStartHandler) {
    assertType(panStartHandler, Type.FUNCTION);

    this.panStartHandler = panStartHandler;
    return this;
  }

  /**
   * @typedef Map~dragEndHandler
   * @function
   */

  /**
   * @param {Map~dragEndHandler} dragEndHandler
   * @returns {MapOptions}
   */
  withDragEndHandler (dragEndHandler) {
    assertType(dragEndHandler, Type.FUNCTION);

    this.dragEndHandler = dragEndHandler;
    return this;
  }

  /**
   * @typedef Map~zoomChangedHandler
   * @function
   */

  /**
   * @param {Map~zoomChangedHandler} zoomChangedHandler
   * @returns {MapOptions}
   */
  withZoomChangedHandler (zoomChangedHandler) {
    assertType(zoomChangedHandler, Type.FUNCTION);

    this.zoomChangedHandler = zoomChangedHandler;
    return this;
  }

  /**
   * @typedef Map~zoomEndHandler
   * @function
   */

  /**
   * @param {Map~zoomEndHandler} zoomEndHandler
   * @returns {MapOptions}
   */
  withZoomEndHandler (zoomEndHandler) {
    assertType(zoomEndHandler, Type.FUNCTION);

    this.zoomEndHandler = zoomEndHandler;
    return this;
  }

  /**
   * @typedef Map~canvasClickHandler
   * @function
   */

  /**
   * @param {Map~canvasClickHandler} canvasClickHandler
   * @returns {MapOptions}
   */
  withCanvasClickHandler (mapCanvasClickHandler) {
    assertType(canvasClickHandler, Type.FUNCTION);

    this.canvasClickHandler = canvasClickHandler;
    return this;
  }

  /**
   * The MapProvider must be loaded before constructing a Map with it.
   * @param {MapProvider} provider
   * @returns {MapOptions}
   */
  withProvider(provider) {
    assertInstance(provider, MapProvider);

    this.provider = provider;
    return this;
  }

  /**
   * @param {Object} providerOptions A free-form object used to set any additional provider-specific options in the {@link ProviderMap}
   * @returns {MapOptions}
   */
  withProviderOptions(providerOptions) {
    this.providerOptions = providerOptions;
    return this;
  }

  /**
   * @param {number} singlePinZoom The zoom when calling {@link Map#fitCoordinates} with an array containing one coordinate
   * @returns {MapOptions}
   */
  withSinglePinZoom(singlePinZoom) {
    this.singlePinZoom = singlePinZoom;
    return this;
  }

  /**
   * @param {HTMLElement} wrapper The wrapper element that the map will be inserted into. The existing contents of the element will be removed.
   * @returns {MapOptions}
   */
  withWrapper(wrapper) {
    assertInstance(wrapper, HTMLElement);

    this.wrapper = wrapper;
    return this;
  }

  /**
   * @returns {Map}
   */
  build() {
    return new Map(this);
  }
}

/**
 * An interactive map that supports various map providers, such as Google Maps and Mapbox, with a
 * single API. Code written using this class functions approximately the same regardless of the map
 * provider used. Any map provider can be supported via a {@link MapProvider} instance.
 */
class Map {
  /**
   * The {@link MapProvider} for the map must be loaded before calling this constructor.
   * @param {MapOptions} options
   */
  constructor(options) {
    assertInstance(options, MapOptions);
    assertInstance(options.provider, MapProvider);
    assertInstance(options.wrapper, HTMLElement);

    if (!options.provider.loaded) {
      throw new Error(`'${options.provider.constructor.name}' is not loaded. The MapProvider must be loaded before calling Map constructor.`);
    }

    this._defaultCenter = options.defaultCenter;
    this._defaultZoom = options.defaultZoom;
    this._legendPins = options.legendPins;
    this._provider = options.provider;
    this._singlePinZoom = options.singlePinZoom;
    this._wrapper = options.wrapper;

    this._padding = {};
    this.setPadding(options.padding);

    this._cachedBounds = null; // Cached map bounds, invalidated on map move

    this._resolveIdle = () => {};
    this._resolveMoving = () => {};
    this._idlePromise = Promise.resolve();
    this._setIdle();
    this._zoomTrigger = ZoomTriggers.UNSET;
    this._panTrigger = PanTriggers.UNSET;

    this.setPanHandler(options.panHandler);
    this.setPanStartHandler(options.panStartHandler);
    this.setDragEndHandler(options.dragEndHandler);
    this.setZoomChangedHandler(options.zoomChangedHandler);
    this.setZoomEndHandler(options.zoomEndHandler);
    this.setCanvasClickHandler(options.canvasClickHandler);
    this.setLoadHandler(options.loadHandler);

    // Remove all child elements of wrapper
    while (this._wrapper.firstChild) {
      this._wrapper.removeChild(this._wrapper.lastChild);
    }

    this._panHandlerRunning = false;
    this._panStartHandlerRunning = false;
    this._map = new ProviderMapOptions(options.provider, this._wrapper)
      .withControlEnabled(options.controlEnabled)
      .withPanHandler(() => this.panHandler())
      .withDragEndHandler(() => this._dragEndHandler())
      .withZoomChangedHandler(() => this.zoomChangedHandler())
      .withZoomEndHandler(() => this.zoomEndHandler())
      .withCanvasClickHandler(() => this._canvasClickHandler())
      .withPanStartHandler(() => this.panStartHandler())
      .withProviderOptions(options.providerOptions)
      .withLocale(options.locale)
      .withLoadHandler(() => this._loadHandler())
      .build();

    this.setZoomCenter(this._defaultZoom, this._defaultCenter);
    this._currentBounds = this.getBounds();
  }

  /**
   * Set the map bounds so that all the given coordinates are within the [padded]{@link MapOptions#withPadding} view.
   * @param {Coordinate[]} coordinates
   * @param {boolean} [animated=false] Whether to transition smoothly to the new bounds
   * @param {number} [maxZoom=singlePinZoom] The max zoom level after fitting. Uses [singlePinZoom]{@link MapOptions#withSinglePinZoom} by default.
   */
  fitCoordinates(coordinates, animated = false, maxZoom = this._singlePinZoom) {
    if (!coordinates.length) {
      this.setZoomCenter(this._defaultZoom, this._defaultCenter, animated);
    } else if (coordinates.length == 1) {
      this.setZoomCenter(this._singlePinZoom, coordinates[0], animated);
    } else {
      this.setBounds(GeoBounds.fit(coordinates), animated, this._padding, maxZoom);
    }
  }

  /**
   * Get the current visible region of the map. If the map is zoomed out to show multiple copies of the
   * world, the longitude bounds will be outside [-180, 180) but the center will always be within [-180, 180).
   * @returns {GeoBounds}
   */
  getBounds() {
    if (!this._cachedBounds) {
      const pixelHeight = this._wrapper.offsetHeight;
      const pixelWidth = this._wrapper.offsetWidth;
      const zoom = this.getZoom();
      const center = this.getCenter();

      const degreesPerPixel = 360 / Math.pow(2, zoom + 8);
      const width = pixelWidth * degreesPerPixel;
      const height = pixelHeight * degreesPerPixel;

      this._cachedBounds = new GeoBounds(center, center);
      this._cachedBounds.ne.add(height / 2, width / 2, Unit.DEGREE, Projection.MERCATOR);
      this._cachedBounds.sw.add(-height / 2, -width / 2, Unit.DEGREE, Projection.MERCATOR);

      this.moving().then(() => this._cachedBounds = null);
    }

    return new GeoBounds(this._cachedBounds.sw, this._cachedBounds.ne);
  }

  /**
   * @returns {Coordinate} The center of the current visible region of the map
   */
  getCenter() {
    return this._map.getCenter();
  }

  /**
   * Intended for internal use only
   * @returns {ProviderMap} The map's ProviderMap instance
   */
  getProviderMap() {
    return this._map;
  }

  /**
   * To standardize zoom for all providers, zoom level is calculated with this formula:
   * zoom = log2(pixel width of equator) - 8.
   * At zoom = 0, the entire world is 256 pixels wide.
   * At zoom = 1, the entire world is 512 pixels wide.
   * Zoom 2 → 1024 pixels, zoom 3 → 2056 pixels, etc.
   * Negative and non-integer zoom levels are valid and follow the formula.
   * @returns {number} The current zoom level of the map
   */
  getZoom() {
    return this._map.getZoom();
  }

  /**
   * Returns when the map is not moving.
   * Use map.idle().then(callback) to run callback immediately if the map is currently idle
   * or once the map becomes idle if it's not.
   * @async
   */
  async idle() {
    await this._idlePromise;
  }

  /**
   * Returns when the map is moving.
   * Use map.moving().then(callback) to run callback immediately if the map is currently moving
   * or once the map starts moving if it's not.
   * @async
   */
  async moving() {
    await this._movingPromise;
  }

  /**
   * @returns {MapPinOptions} A MapPinOptions instance with the same provider as this map
   */
  newPinOptions() {
    return new MapPinOptions().withProvider(this._provider);
  }

  /**
   * Called when the map has finished moving, at most once per animation frame.
   * Passes the current and previous bounds to the custom pan handler given by {@link MapOptions#withPanHandler}
   */
  panHandler() {
    // Throttle panHandler to run at most once per frame
    if (this._panHandlerRunning) {
      return;
    }

    this._panHandlerRunning = true;

    requestAnimationFrame(() => {
      const previousBounds = this._currentBounds;
      this._currentBounds = this.getBounds();

      this._panHandler(previousBounds, new GeoBounds(
        new Coordinate(this._currentBounds.sw),
        new Coordinate(this._currentBounds.ne)
      ), this.getPanTrigger());

      this._panHandlerRunning = false;
      this.setPanTrigger(PanTriggers.UNSET);
    });

    this._setIdle();
  }

  /**
   * Called when the map has started moving, at most once per animation frame.
   * Passes the current bounds to the custom pan handler given by {@link MapOptions#withPanStartHandler}
   */
  panStartHandler() {
    // Throttle panStartHandler to run at most once per frame
    if (this._panStartHandlerRunning) {
      return;
    }

    this._panStartHandlerRunning = true;

    // We assume that the pan trigger is the user if it was
    // left unset by our locator code
    if (this.getPanTrigger() === PanTriggers.UNSET) {
      this.setPanTrigger(PanTriggers.USER);
    }

    requestAnimationFrame(() => {
      this._panStartHandler(new GeoBounds(
        new Coordinate(this._currentBounds.sw),
        new Coordinate(this._currentBounds.ne)
      ), this.getPanTrigger());

      this._panStartHandlerRunning = false;
    });

    this._setMoving();
  }

  /**
   * Called when the map starts a zoom change
   */
  zoomChangedHandler() {
    // We assume that the zoom trigger is the user if it was
    // left unset by our locator code
    if (this.getZoomTrigger() === ZoomTriggers.UNSET) {
      this.setZoomTrigger(ZoomTriggers.USER);
    }

    this._zoomChangedHandler(this.getZoomTrigger());
  }

  /**
   * Called when the map ends a zoom change
   */
  zoomEndHandler() {
    this._zoomEndHandler(this.getZoomTrigger());

    if (this.getZoomTrigger() !== ZoomTriggers.UNSET) {
      this.setZoomTrigger(ZoomTriggers.UNSET);
    }
  }

  getVisibleCenter() {
    const visibleBounds = this.getVisibleBounds();
    const center = visibleBounds.getCenter();
    return center;
  }

  getVisibleRadius() {
    const visibleBounds = this.getVisibleBounds();
    return 1000 * visibleBounds.ne.distanceTo(this.getVisibleCenter(), Unit.KILOMETER);
  }

  getVisibleBounds() {
    const { ne, sw } = this.getBounds();
    const padding = this._padding;

    const pixelHeight = this._wrapper.offsetHeight;
    const pixelWidth = this._wrapper.offsetWidth;

    // Padding is normalized to a fraction of the map height or width
    let paddingBottom = normalizePadding(padding.bottom, pixelHeight);
    let paddingLeft = normalizePadding(padding.left, pixelWidth);
    let paddingRight = normalizePadding(padding.right, pixelWidth);
    let paddingTop = normalizePadding(padding.top, pixelHeight);

    const bounds = new GeoBounds(sw, ne);
    const nw = new Coordinate(bounds.ne.latitude, bounds.sw.longitude);
    const height = bounds.sw.distanceTo(nw, Unit.DEGREE, Projection.MERCATOR);
    const width = (bounds.ne.longitude - nw.longitude + 360) % 360;

    const newNorthEast = new Coordinate(ne);
    const newSouthWest = new Coordinate(sw);
    newNorthEast.add((-1 * paddingTop * height), (-1 * paddingRight * width), Unit.DEGREE, Projection.MERCATOR);
    newSouthWest.add((paddingBottom * height), (paddingLeft * width), Unit.DEGREE, Projection.MERCATOR);

    const paddedBounds = new GeoBounds(newSouthWest, newNorthEast);
    return paddedBounds;
  }

  coordinateIsInVisibleBounds(coordinate) {
    return this.getVisibleBounds().contains(coordinate);
  }

  setCenterWithPadding(coordinate, animated = false) {
    const { ne, sw } = this.getBounds();
    const padding = this._padding;

    const pixelHeight = this._wrapper.offsetHeight;
    const pixelWidth = this._wrapper.offsetWidth;

    // Padding is normalized to a fraction of the map height or width
    let paddingBottom = normalizePadding(padding.bottom, pixelHeight);
    let paddingLeft = normalizePadding(padding.left, pixelWidth);
    let paddingRight = normalizePadding(padding.right, pixelWidth);
    let paddingTop = normalizePadding(padding.top, pixelHeight);

    let horizontalPadding = paddingLeft + paddingRight;
    let verticalPadding = paddingBottom + paddingTop;

    if (horizontalPadding > MAX_PADDING) {
      paddingLeft *= MAX_PADDING / horizontalPadding;
      paddingRight *= MAX_PADDING / horizontalPadding;
      horizontalPadding = MAX_PADDING;
    }

    if (verticalPadding > MAX_PADDING) {
      paddingBottom *= MAX_PADDING / verticalPadding;
      paddingTop *= MAX_PADDING / verticalPadding;
      verticalPadding = MAX_PADDING;
    }

    const paddingInnerHeight = pixelHeight * (1 - verticalPadding);
    const paddingInnerWidth = pixelWidth * (1 - horizontalPadding);

    const bounds = new GeoBounds(sw, ne);
    const nw = new Coordinate(bounds.ne.latitude, bounds.sw.longitude);

    const height = bounds.sw.distanceTo(nw, Unit.DEGREE, Projection.MERCATOR);
    const width = (bounds.ne.longitude - nw.longitude + 360) % 360;

    const center = new Coordinate(coordinate);
    const deltaLat = (paddingTop - paddingBottom) / 2 * height;
    const deltaLon = (paddingRight - paddingLeft) / 2 * width;

    center.add(deltaLat, deltaLon, Unit.DEGREE, Projection.MERCATOR);

    this.setCenter(center, animated);
  }

  /**
   * @param {Object} bounds
   * @param {Object} bounds.ne The northeast corner of the bounds -- must be convertible to {@link Coordinate}
   * @param {Object} bounds.sw The southwest corner of the bounds -- must be convertible to {@link Coordinate}
   * @param {boolean} [animated=false] Whether to transition smoothly to the new bounds
   * @param {Object} [padding={}]
   * @param {number|Map~paddingFunction} padding.bottom Minimum number of pixels between the map's bottom edge and a pin
   * @param {number|Map~paddingFunction} padding.left Minimum number of pixels between the map's left edge and a pin
   * @param {number|Map~paddingFunction} padding.right Minimum number of pixels between the map's right edge and a pin
   * @param {number|Map~paddingFunction} padding.top Minimum number of pixels between the map's top edge and a pin
   * @param {number} [maxZoom=Infinity]
   */
  setBounds({ ne, sw }, animated = false, padding = {}, maxZoom = Infinity) {
    const pixelHeight = this._wrapper.offsetHeight;
    const pixelWidth = this._wrapper.offsetWidth;

    // Padding is normalized to a fraction of the map height or width
    let paddingBottom = normalizePadding(padding.bottom, pixelHeight);
    let paddingLeft = normalizePadding(padding.left, pixelWidth);
    let paddingRight = normalizePadding(padding.right, pixelWidth);
    let paddingTop = normalizePadding(padding.top, pixelHeight);

    let horizontalPadding = paddingLeft + paddingRight;
    let verticalPadding = paddingBottom + paddingTop;

    if (horizontalPadding > MAX_PADDING) {
      paddingLeft *= MAX_PADDING / horizontalPadding;
      paddingRight *= MAX_PADDING / horizontalPadding;
      horizontalPadding = MAX_PADDING;
    }

    if (verticalPadding > MAX_PADDING) {
      paddingBottom *= MAX_PADDING / verticalPadding;
      paddingTop *= MAX_PADDING / verticalPadding;
      verticalPadding = MAX_PADDING;
    }

    const paddingInnerHeight = pixelHeight * (1 - verticalPadding);
    const paddingInnerWidth = pixelWidth * (1 - horizontalPadding);

    const bounds = new GeoBounds(sw, ne);
    const nw = new Coordinate(bounds.ne.latitude, bounds.sw.longitude);

    const height = bounds.sw.distanceTo(nw, Unit.DEGREE, Projection.MERCATOR);
    const width = (bounds.ne.longitude - nw.longitude + 360) % 360;

    const newHeight = Math.max(height, width * paddingInnerHeight / paddingInnerWidth) / (1 - verticalPadding);
    const newWidth = Math.max(width, height * paddingInnerWidth / paddingInnerHeight) / (1 - horizontalPadding);

    const center = bounds.getCenter(Projection.MERCATOR);
    const deltaLat = (paddingTop - paddingBottom) / 2 * newHeight;
    const deltaLon = (paddingRight - paddingLeft) / 2 * newWidth;

    center.add(deltaLat, deltaLon, Unit.DEGREE, Projection.MERCATOR);

    const zoom = Math.min(Math.log2(pixelWidth * 360 / newWidth) - 8, maxZoom);

    this.setZoomCenter(zoom, center, animated);
  }

  /**
   * @param {Object} coordinate Must be convertible to {@link Coordinate}
   * @param {boolean} [animated=false] Whether to transition smoothly to the new center
   */
  setCenter(coordinate, animated = false) {
    this.setPanTrigger(PanTriggers.API);
    this._map.setCenter(new Coordinate(coordinate), animated);
  }

  /**
   * @typedef Map~paddingFunction
   * @function
   * @returns {number} Minimum number of pixels between the map's edge and a pin
   */

  /**
   * Padding is used by {@link Map#fitCoordinates}.
   * Padding can either be constant values or funtions that return a padding value.
   * Constant values are good if the map should always have the same padding on every breakpoint.
   * Padding functions are useful if the map should have different padding at different breakpoints or layouts.
   * Inside the function, you can check window.innerWidth or any other condition before returning a number.
   * @param {Object} padding
   * @param {number|Map~paddingFunction} padding.bottom Minimum number of pixels between the map's bottom edge and a pin
   * @param {number|Map~paddingFunction} padding.left Minimum number of pixels between the map's left edge and a pin
   * @param {number|Map~paddingFunction} padding.right Minimum number of pixels between the map's right edge and a pin
   * @param {number|Map~paddingFunction} padding.top Minimum number of pixels between the map's top edge and a pin
   * @returns {MapOptions}
   */
  setPadding({
    bottom = this._padding.bottom,
    left = this._padding.left,
    right = this._padding.right,
    top = this._padding.top
  }) {
    this._padding = { bottom, left, right, top };
    return this;
  }

  /**
   * @param {Map~panHandler} panHandler
   */
  setPanHandler(panHandler) {
    assertType(panHandler, Type.FUNCTION);

    this._panHandler = panHandler;
  }

  /**
   * @param {Map~panStartHandler} panStartHandler
   */
  setPanStartHandler(panStartHandler) {
    assertType(panStartHandler, Type.FUNCTION);

    this._panStartHandler = panStartHandler;
  }

  /**
   * @param {Map~dragEndHandler} dragEndHandler
   */
  setDragEndHandler(dragEndHandler) {
    assertType(dragEndHandler, Type.FUNCTION);

    this._dragEndHandler = dragEndHandler;
  }

  /**
   * @param {Map~zoomChangedHandler} zoomChangedHandler
   */
  setZoomChangedHandler(zoomChangedHandler) {
    assertType(zoomChangedHandler, Type.FUNCTION);

    this._zoomChangedHandler = zoomChangedHandler;
  }

  /**
   * @param {Map~zoomEndHandler} zoomEndHandler
   */
  setZoomEndHandler(zoomEndHandler) {
    assertType(zoomEndHandler, Type.FUNCTION);

    this._zoomEndHandler = zoomEndHandler;
  }

  /**
   * @param {Map~canvasClickHandler} canvasClickHandler
   */
  setCanvasClickHandler(canvasClickHandler) {
    assertType(canvasClickHandler, Type.FUNCTION);

    this._canvasClickHandler = canvasClickHandler;
  }

  /**
   * @param {Map~loadHandler} handler
   */
  setLoadHandler(handler) {
    assertType(handler, Type.FUNCTION);

    this._loadHandler = handler;
  }

  /**
   * @param {number} zoom
   * @param {boolean} [animated=false] Whether to transition smoothly to the new zoom
   * @see {@link Map#getZoom}
   */
  setZoom(zoom, animated = false) {
    this.setZoomTrigger(ZoomTriggers.API);
    this._map.setZoom(zoom, animated);
  }

  /**
   * @param {number} zoom
   * @param {Object} center Must be convertible to {@link Coordinate}
   * @param {boolean} [animated=false] Whether to transition smoothly to the new bounds
   * @see {@link Map#setZoom}
   * @see {@link Map#setCenter}
   */
  setZoomCenter(zoom, center, animated = false) {
    this.setZoomTrigger(ZoomTriggers.API);
    this.setPanTrigger(PanTriggers.API);
    this._map.setZoomCenter(zoom, center, animated);
  }

  /**
   * The zoom trigger is the initiator of the zoom, this can be from a user
   * on a double click, for example, or from the api when fitting the map around
   * a cluster or a set of results.
   * @param {ZoomTriggers} zoomTrigger
   */
  setZoomTrigger(zoomTrigger) {
    this._zoomTrigger = zoomTrigger;
  }

  /**
   * @return {ZoomTriggers} The trigger for the last zoom
   */
  getZoomTrigger() {
    return this._zoomTrigger;
  }

  /**
   * Sets the PanTrigger which indicates the reason for the most recent map pan
   * @param {PanTriggers} panTrigger
   */
  setPanTrigger(panTrigger) {
    this._panTrigger = panTrigger;
  }

  /**
   * @return {PanTriggers} The trigger for the last pan
   */
  getPanTrigger() {
    return this._panTrigger;
  }

  /**
   * Set the map state to idle
   */
  _setIdle() {
    this._resolveMoving();
    this._movingPromise = new Promise(resolve => this._resolveMoving = resolve);
    this._resolveIdle();
  }

  /**
   * Set the map state to moving
   */
  _setMoving() {
    this._resolveIdle();
    this._idlePromise = new Promise(resolve => this._resolveIdle = resolve);
    this._resolveMoving();
  }
}

export {
  MapOptions,
  Map
};
