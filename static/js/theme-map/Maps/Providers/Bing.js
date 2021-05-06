/** @module Maps/Providers/Bing */

import { Coordinate } from '../../Geo/Coordinate.js';
import { LoadScript } from '../../Performance/LoadContent.js';
import { MapProviderOptions } from '../MapProvider.js';
import { ProviderMap } from '../ProviderMap.js';
import { ProviderPin } from '../ProviderPin.js';

// Map Class

// CustomOverlay for HTML Pins
let PinOverlay;

function initPinOverlayClass() {
  class PinOverlayClass extends Microsoft.Maps.CustomOverlay {
    constructor() {
      super({ beneathLabels: false });

      this._container = document.createElement('div');
      this._map = null;
      this._pins = new Set();
      this._viewChangeEventHandler = null;

      this._container.style.position = 'absolute';
      this._container.style.left = '0';
      this._container.style.top = '0';
    }

    addPin(pin) {
      this._pins.add(pin);
      this._container.appendChild(pin._wrapper);

      if (this._map) {
        this.updatePinPosition(pin);
      }
    }

    onAdd() {
      this._map = this.getMap();
      this.setHtmlElement(this._container);
    }

    onLoad() {
      this._viewChangeEventHandler = Microsoft.Maps.Events.addHandler(this._map, 'viewchange', () => this.updatePinPositions());
      this.updatePinPositions();
    }

    onRemove() {
      Microsoft.Maps.Events.removeHandler(this._viewChangeEventHandler);
      this._map = null;
    }

    removePin(pin) {
      this._pins.delete(pin);
      this._container.removeChild(pin._wrapper);
    }

    updatePinPosition(pin) {
      if (!this._map) {
        return;
      }

      const topLeft = this._map.tryLocationToPixel(pin._location, Microsoft.Maps.PixelReference.control);
      pin._wrapper.style.left = topLeft.x + 'px';
      pin._wrapper.style.top = topLeft.y + 'px';
    }

    updatePinPositions() {
      this._pins.forEach(pin => this.updatePinPosition(pin));
    }
  }

  PinOverlay = PinOverlayClass;
}

/**
 * @implements {ProviderMap}
 */
class BingMap extends ProviderMap {
  /**
   * @param {ProviderMapOptions} options
   */
  constructor(options) {
    super(options);

    this.wrapper = options.wrapper;
    this.map = new Microsoft.Maps.Map(this.wrapper, {
      disablePanning: !options.controlEnabled,
      disableZooming: !options.controlEnabled,
      showLocateMeButton: false,
      showMapTypeSelector: false,
      showScalebar: false,
      showTrafficButton: false,
      ...options.providerOptions
    });

    this.pinOverlay = new PinOverlay(this.map);
    this.map.layers.insert(this.pinOverlay);

    Microsoft.Maps.Events.addHandler(this.map, 'viewchangestart', () => this._panStartHandler());
    Microsoft.Maps.Events.addHandler(this.map, 'viewchangeend', () => this._panHandler());
  }

  getCenter() {
    return new Coordinate(this.map.getCenter());
  }

  getZoom() {
    return this.map.getZoom();
  }

  setCenter(coordinate, animated) {
    const center = new Microsoft.Maps.Location(coordinate.latitude, coordinate.longitude);
    this.map.setView({ center });
    this.pinOverlay.updatePinPositions();
  }

  setZoom(zoom, animated) {
    // Bing only allows integer zoom
    this.map.setView({ zoom: Math.floor(zoom) });
    this.pinOverlay.updatePinPositions();
  }
}

// Pin Class

/**
 * @implements {ProviderPin}
 */
class BingPin extends ProviderPin {
  /**
   * Bing pins need global callbacks to complete initialization.
   * This function provides a unique ID to include in the name of the callback.
   * @returns {number} An ID for the pin unique across all instances of BingPin
   */
  static getId() {
    this._pinId = (this._pinId || 0) + 1;
    return this._pinId;
  }

  /**
   * @param {ProviderPinOptions} options
   */
  constructor(options) {
    super(options);

    this._pinEl = document.createElement('button');
    this._pinEl.style.backgroundSize = 'contain';
    this._pinEl.style.backgroundRepeat = 'no-repeat';
    this._pinEl.style.position = 'absolute';
    this._pinEl.style.top = '0';
    this._pinEl.style.left = '0';

    this._pinAlt = document.createElement('span');
    this._pinAlt.classList.add('sr-only');
    this._pinEl.appendChild(this._pinAlt);

    this._wrapper = document.createElement('div');
    this._wrapper.appendChild(this._pinEl);
    this._wrapper.style.position = 'absolute';

    this._wrapper.addEventListener('click', () => this._clickHandler());
    this._wrapper.addEventListener('focusin', () => this._focusHandler(true));
    this._wrapper.addEventListener('focusout', () => this._focusHandler(false));
    this._wrapper.addEventListener('mouseover', () => this._hoverHandler(true));
    this._wrapper.addEventListener('mouseout', () => this._hoverHandler(false));

    this._map = null;
    this._location = new Microsoft.Maps.Location(0, 0);
  }

  setCoordinate(coordinate) {
    this._location = new Microsoft.Maps.Location(coordinate.latitude, coordinate.longitude);

    if (this._map) {
      this._map.getProviderMap().pinOverlay.updatePinPosition(this);
    }
  }

  setMap(themeMap, currentMap) {
    if (currentMap) {
      currentMap.getProviderMap().pinOverlay.removePin(this);
    }

    if (themeMap) {
      themeMap.getProviderMap().pinOverlay.addPin(this);
    }

    this._map = themeMap;
  }

  setProperties(pinProperties) {
    const anchorX = pinProperties.getAnchorX();
    const anchorY = pinProperties.getAnchorY();
    const className = pinProperties.getClass();
    const element = pinProperties.getElement() || this._pinEl;
    const height = pinProperties.getHeight();
    const icon = this._icons[pinProperties.getIcon()];
    const srText = pinProperties.getSRText();
    const width = pinProperties.getWidth();
    const zIndex = pinProperties.getZIndex();

    this._pinEl.style.backgroundImage = icon ? `url("${icon}")` : '';
    this._pinEl.style.height = height + 'px';
    this._pinEl.style.transform = `translate(${-100 * anchorX}%,${-100 * anchorY}%)`;
    this._pinEl.style.width = width + 'px';

    this._pinAlt.innerText = srText;

    this._wrapper.style.zIndex = zIndex;
    this._wrapper.setAttribute('class', className);

    if (element != this._wrapper.children[0]) {
      this._wrapper.removeChild(this._wrapper.children[0]);
      this._wrapper.appendChild(element);
    }
  }
}

// Load Function

// Random token obtained from `echo BingMapsCallbackYext | md5 | cut -c -8`
const globalCallback = 'BingMapsCallback_593d7d33';
const yextAPIKey = 'ApYPB8G-KZ_b2M0E8gi5PqOJDnJ2a7JXSOIHSzrYtJcX2AfyvQmgwFNSxPkAOhWm';
const baseUrl = 'https://www.bing.com/api/maps/mapcontrol';

/**
 * This function is called when calling {@link MapProvider#load} on {@link module:Maps/Providers/Bing.BingMaps}.
 * @param {function} resolve Callback with no arguments called when the load finishes successfully
 * @param {function} reject Callback with no arguments called when the load fails
 * @param {?string} apiKey Provider API key
 * @param {Object} options Additional provider-specific options
 * @param {Object<string,string>} [options.params={}] Additional API params
 * @see {MapProvider~loadFunction}
 */
function load(resolve, reject, apiKey, {
  params = {}
}) {
  window[globalCallback] = () => {
    initPinOverlayClass();
    resolve();
  };

  const apiParams = {
    callback: globalCallback,
    key: apiKey || yextAPIKey,
    ...params
  };

  LoadScript(baseUrl + '?' + Object.entries(apiParams).map(([key, value]) => key + '=' + value).join('&'));
}

// Exports

/**
 * @static
 * @type {MapProvider}
 */
const BingMaps = new MapProviderOptions()
  .withLoadFunction(load)
  .withMapClass(BingMap)
  .withPinClass(BingPin)
  .withProviderName('Bing')
  .build();

export {
  BingMaps
};
