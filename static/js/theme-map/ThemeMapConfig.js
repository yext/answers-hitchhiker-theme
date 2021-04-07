import { Coordinate } from './Geo/Coordinate.js';
import { PinImages } from './PinImages.js';
import { ClusterPinImages } from './ClusterPinImages.js';
import { getLanguageForProvider } from './Util/helpers.js';
import { defaultCenterCoordinate } from './constants.js';

/**
 * The configuration for the ThemeMap component.
 */
export default class ThemeMapConfig {
  /**
   * @param {Object} jsonConfig Configuration to parse
   */
  constructor (jsonConfig) {
    /**
     * The provider for the map, normalized to lowercase
     * @type {string}
     */
    this.mapProvider = jsonConfig.mapProvider && jsonConfig.mapProvider.toLowerCase();

    /**
     * The API key for the map provider (if applicable)
     * @type {string}
     */
    this.apiKey = jsonConfig.apiKey;

    /**
     * Controls the visual offset of each pin.
     * @type {Object}
     */
    this.pinAnchors = {
      anchorX: 0.5,
      anchorY: 0.5
    };

    /**
     * Controls the visual offset of each cluster pin.
     * @type {Object}
     */
    this.pinClusterAnchors = {
      anchorX: 0.5,
      anchorY: 0.5
    };

    /**
     * The client id for the map provider (if applicable)
     * @type {string}
     */
    this.clientId = jsonConfig.clientId;

    /**
     * The language locale for the map. This is different from
     * the specified locale because some map providers do not support
     * certain locales and we want to fallback in a specific pattern
     * when we come across a locale we do not support
     * @type {string}
     */
    this.language = getLanguageForProvider(jsonConfig.locale, this.mapProvider);

    /**
     * The content wrapper for the floating content above the map
     * @type {HTMLElement}
     */
    this.contentWrapperEl = jsonConfig.contentWrapperEl;

    /**
     * Map options to be passed directly to the Map Provider
     * @type {Object}
     */
    this.providerOptions = jsonConfig.providerOptions || {};

    const defaultCenterFromConfig = jsonConfig.defaultCenter || this.providerOptions.center;

    /**
     * The default center coordinate for the map, an object with {lat, lng}
     * @type {Coordinate}
     */
    this.defaultCenter = defaultCenterFromConfig
      ? new Coordinate(defaultCenterFromConfig)
      : defaultCenterCoordinate;

    /**
     * The default zoom level for the map
     * @type {number}
     */
    this.defaultZoom = jsonConfig.defaultZoom
      || this.providerOptions.zoom 
      || 14;

    /**
     * The mobile breakpoint (inclusive max) in px
     * @type {Number}
     */
    this.mobileBreakpointMax = jsonConfig.mobileBreakpointMax || 991;

    /**
     * The padding for the map within the viewable area
     * @type {Object}
     */
    this.padding = {
      top: () => window.innerWidth <= this.mobileBreakpointMax ? 150 : 50,
      bottom: () => 50,
      right: () => 50,
      left: () => this.getLeftVisibleBoundary(),
    };

    /**
     * The pin options for the map, with information for each pin state (e.g. default, hovered)
     * @type {Object}
     */
    this.pinOptions = jsonConfig.pinOptions || {};

    /**
     * The pin images for the default Map Pin
     * @type {PinImages}
     */
    this.pinImages = new PinImages(
      this.pinOptions.default,
      this.pinOptions.hovered,
      this.pinOptions.selected,
    );

    /**
     * The cluster pin options for the map, with information for each pin state
     * @type {Object}
     */
    this.pinClusterOptions = jsonConfig.pinClusterOptions || jsonConfig.pinOptions;

    /**
     * The pin images for the default Map Pin
     * @type {ClusterPinImages}
     */
    this.pinClusterImages = new ClusterPinImages(
      this.pinClusterOptions.default || this.pinOptions.default,
      this.pinClusterOptions.hovered || this.pinOptions.hovered,
      this.pinClusterOptions.selected || this.pinOptions.selected,
    );

    /**
     * Whether the map should cluster pins that are close to each other
     * @type {boolean}
     */
    this.enablePinClustering = jsonConfig.enablePinClustering;

    const noResultsConfig = jsonConfig.noResultsConfig || {};

    /**
     * Whether the map should display all results on no results
     * @type {boolean}
     */
    this.displayAllResultsOnNoResults = noResultsConfig.displayAllResults;

    /**
     * Callback for when a non-cluster pin is selected
     * @type {Function}
     */
    this.onPinSelect = jsonConfig.onPinSelect || function () {};

    /**
     * Callback for when the map is rendered
     * @type {Function}
     */
    this.onPostMapRender = jsonConfig.onPostMapRender || function () {};

    /**
     * Callback for when a non-cluster pin is clicked
     * @type {Function}
     */
    this.pinClickListener = jsonConfig.pinClickListener || function () {};

    /**
     * Callback for when a non-cluster pin gains focus
     * @type {Function}
     */
    this.pinFocusListener = jsonConfig.pinFocusListener || function () {};

    /**
     * Callback for when a cluster pin is clicked
     * @type {Function}
     */
    this.pinClusterClickListener = jsonConfig.pinClusterClickListener || function () {};

    /**
     * Callback for when a map drag event has finished
     * @type {Function}
     */
    this.dragEndListener = jsonConfig.dragEndListener || function () {};

    /**
     * Callback for when a map pan event has finished
     * @type {Function}
     */
    this.panHandler = jsonConfig.panHandler || function () {};

    /**
     * Callback for when a map zoom event has fired
     * @type {Function}
     */
    this.zoomChangedListener = jsonConfig.zoomChangedListener || function () {};

    /**
     * Callback for when a map zoom event has finished
     * @type {Function}
     */
    this.zoomEndListener = jsonConfig.zoomEndListener || function () {};

    /**
     * Callback for when the map canvas is clicked
     * A click does not include clicks to a pin or a map control
     * A click is a mouseup and a mousedown with moving the mouse
     * @type {Function}
     */
    this.canvasClickListener = jsonConfig.canvasClickListener || function () {};

    /**
     * The minimum number of pins to be clustered
     * @type {number}
     */
    this.minClusterSize = 2;

    /**
     * The max pixel distance from the center of a cluster to any pin in the cluster
     * @type {number}
     */
    this.minClusterRadius = 50;

    /**
     * Whether to animate map zoom on cluster click
     * @type {boolean}
     */
    this.clusterZoomAnimated = true;

    /**
     * Max zoom level for the map after clicking a cluster
     * @type {number}
     */
    this.clusterZoomMax = 20;
  }

  /**
   * Get the leftmost point on the map, such that pins will still be visible
   * @return {Number} The boundary (in pixels) for the visible area of the map, from the left
   *                  hand side of the viewport
   */
  getLeftVisibleBoundary () {
    if (window.innerWidth <= this.mobileBreakpointMax) {
      return 50;
    }

    const contentWrapperElWidth = this.contentWrapperEl ? this.contentWrapperEl.offsetWidth : 0;
    return 50 + contentWrapperElWidth;
  };
}
