import { Coordinate } from './Geo/Coordinate.js';
import { PinImages } from './PinImages.js';
import { ClusterPinImages } from './ClusterPinImages.js';
import { getLanguageForProvider } from './Util/helpers.js';

/**
 * The configuration for the NewMap component.
 */
export default class NewMapConfig {
  /**
   * @param {Object} rawConfig Configuration to parse
   */
  constructor (rawConfig) {
    /**
     * The provider for the map, normalized to lowercase
     * @type {string}
     */
    this.mapProvider = rawConfig.mapProvider && rawConfig.mapProvider.toLowerCase();

    /**
     * The API key for the map provider (if applicable)
     * @type {string}
     */
    this.apiKey = rawConfig.apiKey;

    /**
     * The client id for the map provider (if applicable)
     * @type {string}
     */
    this.clientId = rawConfig.clientId;

    /**
     * The language locale for the map. This is different from
     * the specified locale because some map providers do not support
     * certain locales and we want to fallback in a specific pattern
     * when we come across a locale we do not support
     * @type {string}
     */
    this.language = getLanguageForProvider(rawConfig.locale, this.mapProvider);

    /**
     * The content wrapper for the floating content above the map
     * @type {HTMLElement}
     */
    this.contentWrapperEl = rawConfig.contentWrapperEl;

    /**
     * Map options to be passed directly to the Map Provider
     * @type {Object}
     */
    this.providerOptions = rawConfig.providerOptions || {};

    const defaultCenter = rawConfig.defaultCenter 
      || this.providerOptions.center 
      || { lat: 37.0902, lng: -95.7129 };

    /**
     * The default center coordinate for the map, an object with {lat, lng}
     * @type {Coordinate}
     */
    this.defaultCenter = new Coordinate(defaultCenter);

    /**
     * The default zoom level for the map
     * @type {number}
     */
    this.defaultZoom = rawConfig.defaultZoom 
      || this.providerOptions.zoom 
      || 14;

    /**
     * The mobile breakpoint (inclusive max) in px
     * @type {Number}
     */
    this.mobileBreakpointMax = rawConfig.mobileBreakpointMax || 991;

    /**
     * The padding for the map within the viewable area
     * @type {Object}
     */
    this.mapPadding = {
      top: () => window.innerWidth <= this.mobileBreakpointMax ? 150 : 50,
      bottom: () => 50,
      right: () => 50,
      left: () => this.getLeftVisibleBoundary(),
    };

    /**
     * The pin options for the map, with information for each pin state (e.g. default, hovered)
     * @type {Object}
     */
    this.pinOptions = rawConfig.pinOptions || {};

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
    this.pinClusterOptions = rawConfig.pinClusterOptions || rawConfig.pinOptions;

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
    this.enablePinClustering = rawConfig.enablePinClustering;

    const noResultsConfig = rawConfig.noResults || {};

    /**
     * Whether the map should display all results on no results
     * @type {boolean}
     */
    this.displayAllResultsOnNoResults = noResultsConfig.displayAllResultsOnNoResults;

    /**
     * Callback for when a non-cluster pin is selected
     * @type {Function}
     */
    this.onPinSelect = rawConfig.onPinSelect || function () {};

    /**
     * Callback for when the map is rendered
     * @type {Function}
     */
    this.onPostMapRender = rawConfig.onPostMapRender || function () {};

    /**
     * Callback for when a non-cluster pin is clicked
     * @type {Function}
     */
    this.pinClickListener = rawConfig.pinClickListener || function () {};

    /**
     * Callback for when a cluster pin is clicked
     * @type {Function}
     */
    this.pinClusterClickListener = rawConfig.pinClusterClickListener || function () {};

    /**
     * Callback for when a map drag event has finished
     */
    this.dragEndListener = rawConfig.dragEndListener || function () {};

    /**
     * Callback for when a map zoom event has fired
     */
    this.zoomChangedListener = rawConfig.zoomChangedListener || function () {};

    /**
     * Callback for when a map zoom event has finished
     */
    this.zoomEndListener = rawConfig.zoomEndListener || function () {};
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
