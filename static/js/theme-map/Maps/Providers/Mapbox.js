/** @module Maps/Providers/Mapbox */

import DeferredPromise from '../../../deferred-promise.js';
import { Coordinate } from '../../Geo/Coordinate.js';
import { MapProviderOptions } from '../MapProvider.js';
import { ProviderMap } from '../ProviderMap.js';
import { ProviderPin } from '../ProviderPin.js';
import isRTL from '../../../../common/rtl';
import { parseLocale } from '../../../utils.js';

// TODO (jronkin) call map resize method when hidden/shown (CoreBev, used to be done in Core.js)

// Map Class

/**
 * @implements {ProviderMap}
 */
class MapboxMap extends ProviderMap {
  /**
   * @param {ProviderMapOptions} options
   */
  constructor(options) {
    super(options);

    this.map = new mapboxgl.Map({
      container: options.wrapper,
      interactive: options.controlEnabled,
      style: 'mapbox://styles/mapbox/streets-v9',
      ...options.providerOptions
    });

    this.map.addControl(new MapboxLanguage({
      defaultLanguage: options.locale
    }));

    // Add the zoom control
    if (options.controlEnabled) {
      const zoomControl = new mapboxgl.NavigationControl({showCompass: false})
      isRTL(options.locale)
        ? this.map.addControl(zoomControl, 'top-left') 
        : this.map.addControl(zoomControl);
    }

    this.map.on('movestart', () => this._panStartHandler());
    this.map.on('moveend', () => this._panHandler());
    this.map.on('dragend', () => this._dragEndHandler());
    this.map.on('zoomstart', () => this._zoomChangedHandler());
    this.map.on('zoomend', () => this._zoomEndHandler());
    this.map.on('click', (e) => {
      if (e.originalEvent.target.nodeName === 'CANVAS') {
        this._canvasClickHandler();
      }
    });
  }

  getCenter() {
    return new Coordinate(this.map.getCenter());
  }

  getZoom() {
    // Our standard zoom: at level 0, the world is 256 pixels wide and doubles each level
    // Mapbox zoom: at level 0, the world is 512 pixels wide and doubles each level
    return this.map.getZoom() + 1;
  }

  setCenter(coordinate, animated) {
    const center = new mapboxgl.LngLat(coordinate.longitude, coordinate.latitude);

    if (animated) {
      this.map.panTo(center);
    } else {
      this.map.setCenter(center);
    }
  }

  setZoom(zoom, animated) {
    // Our standard zoom: at level 0, the world is 256 pixels wide and doubles each level
    // Mapbox zoom: at level 0, the world is 512 pixels wide and doubles each level
    if (animated) {
      this.map.zoomTo(zoom - 1);
    } else {
      this.map.setZoom(zoom - 1);
    }
  }

  setZoomCenter(zoom, coordinate, animated) {
    const center = new mapboxgl.LngLat(coordinate.longitude, coordinate.latitude);

    // Our standard zoom: at level 0, the world is 256 pixels wide and doubles each level
    // Mapbox zoom: at level 0, the world is 512 pixels wide and doubles each level
    this.map[animated ? 'easeTo' : 'jumpTo']({ center, zoom: zoom - 1 });
  }
}

// Pin Class

/**
 * @implements {ProviderPin}
 */
class MapboxPin extends ProviderPin {
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

    this.pin = new mapboxgl.Marker({
      element: this._wrapper
    });

    this._wrapper.addEventListener('click', () => this._clickHandler());
    this._wrapper.addEventListener('focusin', () => this._focusHandler(true));
    this._wrapper.addEventListener('focusout', () => this._focusHandler(false));
    this._wrapper.addEventListener('mouseover', () => this._hoverHandler(true));
    this._wrapper.addEventListener('mouseout', () => this._hoverHandler(false));
  }

  setCoordinate(coordinate) {
    this.pin.setLngLat(new mapboxgl.LngLat(coordinate.longitude, coordinate.latitude));
  }

  setMap(themeMap, currentMap) {
    if (themeMap) {
      this.pin.addTo(themeMap.getProviderMap().map);
    } else {
      this.pin.remove();
    }
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

const yextAPIKey = 'pk.eyJ1IjoieWV4dCIsImEiOiJqNzVybUhnIn0.hTOO5A1yqfpN42-_z_GuLw';

/**
 * This function is called when calling {@link MapProvider#load} on {@link module:Maps/Providers/Mapbox.MapboxMaps}.
 * @param {function} resolve Callback with no arguments called when the load finishes successfully
 * @param {function} reject Callback with no arguments called when the load fails
 * @param {?string} apiKey Provider API key
 * @param {Object} options Additional provider-specific options
 * @param {string} [options.version='v1.6.1'] API version
 * @see {MapProvider~loadFunction}
 */
function load(resolve, reject, apiKey, {
  version = 'v1.13.1'
}) {
  const baseUrl = `https://api.mapbox.com/mapbox-gl-js/${version}/mapbox-gl`;

  const mapStyle = document.createElement('link');
  mapStyle.rel = 'stylesheet';
  mapStyle.href = baseUrl + '.css';

  const mapLanguageScript = document.createElement('script');
  mapLanguageScript.src = 'https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-language/v0.10.1/mapbox-gl-language.js';
  const mapLanguageScriptPromise = new DeferredPromise();
  mapLanguageScript.onload = () => {
    mapLanguageScriptPromise.resolve();
  };

  const mapScript = document.createElement('script');
  mapScript.src = baseUrl + '.js';
  const mapScriptPromise = new DeferredPromise();
  mapScript.onload = () => {
    mapboxgl.accessToken = apiKey || yextAPIKey;
    mapboxgl.setRTLTextPlugin(
      'https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-rtl-text/v0.2.3/mapbox-gl-rtl-text.js',
      null,
      true // Lazy load the plugin
    );      
    mapScriptPromise.resolve();
  };

  Promise.all([mapScriptPromise, mapLanguageScriptPromise]).then(() => resolve());

  document.head.appendChild(mapStyle);
  document.head.appendChild(mapLanguageScript);
  document.head.appendChild(mapScript);
}

function formatLocale(locale) {
  const { language, modifier } = parseLocale(locale);
  return modifier ? `${language}-${modifier}` : language;
}

// Exports

/**
 * @static
 * @type {MapProvider}
 */
const MapboxMaps = new MapProviderOptions()
  .withSupportedLocales(['zh-Hans', 'zh-Hant'])
  .withLoadFunction(load)
  .withFormatLocaleFunction(formatLocale)
  .withMapClass(MapboxMap)
  .withPinClass(MapboxPin)
  .withProviderName('Mapbox')
  .build();

export {
  MapboxMaps
};
