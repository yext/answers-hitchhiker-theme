/** @module Maps/Providers/MapQuest */

import { Coordinate } from '../../Geo/Coordinate.js';
import { MapProviderOptions } from '../MapProvider.js';
import { ProviderMap } from '../ProviderMap.js';
import { LeafletMaps } from './Leaflet.js';

const LeafletPin = LeafletMaps.getPinClass();

// Map Class

/**
 * @implements {ProviderMap}
 */
class MapQuestMap extends ProviderMap {
  constructor(options) {
    super(options);

    this.map = L.mapquest.map(options.wrapper, {
      boxZoom: options.controlEnabled,
      center: new L.latLng(0, 0),
      doubleClickZoom: options.controlEnabled,
      dragging: options.controlEnabled,
      layers: L.mapquest.tileLayer('map'),
      zoom: 0,
      zoomControl: options.controlEnabled,
      zoomSnap: 0,
      ...options.providerOptions
    });

    if (options.controlEnabled) {
      this.map.zoomControl.setPosition('topright');
    }

    this.map.on('movestart', () => this._panStartHandler());
    this.map.on('moveend', () => this._panHandler());
  }

  getCenter() {
    return new Coordinate(this.map.getCenter());
  }

  getZoom() {
    return this.map.getZoom();
  }

  setCenter(coordinate, animated) {
    const latLng = new L.latLng(coordinate.latitude, coordinate.longitude);
    this.map.panTo(latLng, { animate: animated });
  }

  setZoom(zoom, animated) {
    this.map.setZoom(zoom, { animate: animated });
  }
}

// Pin Class

/**
 * @extends {LeafletPin}
 */
class MapQuestPin extends LeafletPin {}

// Load Function

const yextAPIKey = 'Fmjtd%7Cluu829urnh%2Cbn%3Do5-9w1ghy';
const baseUrl = 'https://api.mqcdn.com/sdk/mapquest-js/v1.3.2/mapquest-maps';

/**
 * This function is called when calling {@link MapProvider#load} on {@link module:Maps/Providers/MapQuest.MapQuestMaps}.
 * @param {function} resolve Callback with no arguments called when the load finishes successfully
 * @param {function} reject Callback with no arguments called when the load fails
 * @param {?string} apiKey Provider API key
 * @see {MapProvider~loadFunction}
 */
function load(resolve, reject, apiKey) {
  const mapStyle = document.createElement('link');
  mapStyle.rel = 'stylesheet';
  mapStyle.href = baseUrl + '.css';

  const mapScript = document.createElement('script');
  mapScript.src = baseUrl + '.js';
  mapScript.onload = () => {
    L.mapquest.key = apiKey || yextAPIKey;
    resolve();
  };

  document.head.appendChild(mapStyle);
  document.head.appendChild(mapScript);
}

// Exports

/**
 * @static
 * @type {MapProvider}
 */
const MapQuestMaps = new MapProviderOptions()
  .withLoadFunction(load)
  .withMapClass(MapQuestMap)
  .withPinClass(MapQuestPin)
  .withProviderName('MapQuest')
  .build();

export {
  MapQuestMaps
};
