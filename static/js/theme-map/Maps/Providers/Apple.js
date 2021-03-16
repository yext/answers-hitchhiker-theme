import { Coordinate } from '../../Geo/Coordinate.js';
import { MapProviderOptions } from '../MapProvider.js';
import { ProviderMap } from '../ProviderMap.js';
import { ProviderPin } from '../ProviderPin.js';

// Map Class

class AppleMap extends ProviderMap {
  constructor(options) {
    super(options);
  }

  getCenter() {
    // TODO
  }

  getZoom() {
    // TODO
  }

  setCenter(coordinate, animated) {
    // TODO
  }

  setZoom(zoom, animated) {
    // TODO
  }
}

// Pin Class

class ApplePin extends ProviderPin {
  constructor(options) {
    super(options);
  }

  setCoordinate(coordinate) {
    // TODO
  }

  setMap(themeMap, currentMap) {
    // TODO
  }

  setProperties(pinProperties) {
    // TODO
  }
}

// Load Function

function load(resolve, reject, apiKey, options) {
  // TODO
}

// Exports

const AppleMaps = new MapProviderOptions()
  .withLoadFunction(load)
  .withMapClass(AppleMap)
  .withPinClass(ApplePin)
  .withProviderName('Apple')
  .build();

export {
  AppleMaps
};
