/** @module Maps/Providers/Google */

import { Coordinate } from '../../Geo/Coordinate.js';
import { LoadScript } from '../../Performance/LoadContent.js';
import { MapProviderOptions } from '../MapProvider.js';
import { ProviderMap } from '../ProviderMap.js';
import { ProviderPin } from '../ProviderPin.js';
import { debounce } from '../../Util/helpers';

/**
 * @static
 * @enum {string}
 */
const Library = {
  PLACES: 'places'
};

// Map Class

/**
 * @implements {ProviderMap}
 */
class GoogleMap extends ProviderMap {
  /**
   * @param {ProviderMapOptions} options
   */
  constructor(options) {
    super(options);

    this.map = new google.maps.Map(options.wrapper, {
      disableDefaultUI: !options.controlEnabled,
      fullscreenControl: false,
      gestureHandling: options.controlEnabled ? 'auto' : 'none',
      mapTypeControl: false,
      rotateControl: false,
      scaleControl: false,
      streetViewControl: false,
      zoomControl: options.controlEnabled,
      zoomControlOptions: {
        position: google.maps.ControlPosition.RIGHT_TOP
      },
      ...options.providerOptions
    });

    // Google getZoom only gives integer zoom, so we have to keep track otherwise.
    this._currentZoom = null;
    this._zoomValid = true;
    this._zoomChangeListener = null;

    this._moving = false;

    const debouncedIdleEvent = debounce(() => {
      this._moving = false;
      this._panHandler();
    }, 100);

    google.maps.event.addListener(this.map, 'bounds_changed', () => {
      if (!this._moving) {
        this._moving = true;
        this._panStartHandler();
      } else {
        debouncedIdleEvent();
      }
    });
    google.maps.event.addListener(this.map, 'idle', debouncedIdleEvent);
    google.maps.event.addListener(this.map, 'dragend', () => {
      this._dragEndHandler();
    });
    google.maps.event.addListener(this.map, 'zoom_changed', () => {
      this._zoomChangedHandler();
      google.maps.event.addListenerOnce(this.map, 'idle', () => {
        this._zoomEndHandler();
      });
    });
    google.maps.event.addListener(this.map, 'click', () => {
      this._canvasClickHandler();
    });
  }

  getCenter() {
    return new Coordinate(this.map.getCenter());
  }

  getZoom() {
    return this._zoomValid ? this.map.getZoom() : this._currentZoom;
  }

  setCenter(coordinate, animated) {
    const latLng = new google.maps.LatLng(coordinate.latitude, coordinate.longitude);

    if (animated) {
      this.map.panTo(latLng)
    } else {
      this.map.setCenter(latLng);
    }
  }

  setZoom(z, animated) {
    const zoom = Math.floor(z); // Floor to avoid snapping
    this.map.setZoom(zoom);
  }

  setZoomCenter(zoom, center, animated = false) {
    this.setCenter(center, animated);
    this.setZoom(zoom, animated);
  }
}

// Pin Class

/**
 * @implements {ProviderPin}
 * @todo GENERATOR TODO Full HTML pin support
 */
class GooglePin extends ProviderPin {
  /**
   * @param {ProviderPinOptions} options
   */
  constructor(options) {
    super(options);

    this.pin = new google.maps.Marker({
      optimized: false  // For IE <= 11 compat
    });

    google.maps.event.addListener(this.pin, 'click', () => this._clickHandler());
    google.maps.event.addListener(this.pin, 'mouseover', () => this._hoverHandler(true));
    google.maps.event.addListener(this.pin, 'mouseout', () => this._hoverHandler(false));
    // GENERATOR TODO focus handler (if possible)
  }

  setCoordinate(coordinate) {
    this.pin.setPosition(new google.maps.LatLng(coordinate.latitude, coordinate.longitude));
  }

  setMap(themeMap, currentMap) {
    this.pin.setMap(themeMap ? themeMap.getProviderMap().map : null);
  }

  setProperties(pinProperties) {
    const anchorX = pinProperties.getAnchorX();
    const anchorY = pinProperties.getAnchorY();
    const height = pinProperties.getHeight();
    const icon = this._icons[pinProperties.getIcon()];
    const width = pinProperties.getWidth();
    const zIndex = pinProperties.getZIndex();

    const options = { zIndex };

    if (icon) {
      options.icon = {
        anchor: new google.maps.Point(anchorX * width, anchorY * height),
        scaledSize: new google.maps.Size(width, height),
        url: this._icons[pinProperties.getIcon()]
      }
    }

    this.pin.setOptions(options);
  }
}

// Load Function

// Random token obtained from `echo GoogleMapsCallbackYext | md5 | cut -c -8`
const globalCallback = 'GoogleMapsCallback_b7d77ff2';
const yextClient = 'gme-yextinc';
const baseUrl = 'https://maps.googleapis.com/maps/api/js';

/**
 * This function is called when calling {@link MapProvider#load} on {@link module:Maps/Providers/Google.GoogleMaps}.
 * @param {function} resolve Callback with no arguments called when the load finishes successfully
 * @param {function} reject Callback with no arguments called when the load fails
 * @param {?string} apiKey Provider API key
 * @param {Object} options Additional provider-specific options
 * @param {boolean} [options.autocomplete=false] Whether to include Google's autocomplete API
 * @param {string} [options.channel=window.location.hostname] API key usage channel
 * @param {string} [options.client] Google API enterprise client
 * @param {string} [options.language] Language of the map
 * @param {module:Maps/Providers/Google.Library[]} [options.libraries=[]] Additional Google libraries to load
 * @param {Object<string,string>} [options.params={}] Additional API params
 * @see {MapProvider~loadFunction}
 */
function load(resolve, reject, apiKey, {
  autocomplete = false,
  channel = window.location.hostname,
  client,
  language,
  libraries = [],
  params = {}
}) {
  window[globalCallback] = resolve;

  if (autocomplete) {
    libraries.push(Library.PLACES);
  }

  const apiParams = {
    callback: globalCallback,
    channel,
    language,
    libraries: libraries.join(','),
    ...params
  };

  if (apiKey) {
    apiParams.key = apiKey;
  }

  if (client) {
    apiParams.client = client;
  } else if (!apiKey) {
    apiParams.client = yextClient;
  }

  LoadScript(baseUrl + '?' + Object.entries(apiParams).map(([key, value]) => key + '=' + value).join('&'));
}

// Exports

/**
 * @static
 * @type {MapProvider}
 */
const GoogleMaps = new MapProviderOptions()
  .withSupportedLocales(['zh-CN', 'zn-HK', 'zh-TW', 'en-AU', 'en-GB', 'fr-CA', 'pt-BR', 'pt-PT', 'es-419'])
  .withLoadFunction(load)
  .withMapClass(GoogleMap)
  .withPinClass(GooglePin)
  .withProviderName('Google')
  .build();

export {
  GoogleMaps,
  Library
};
