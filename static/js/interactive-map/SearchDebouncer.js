import { Coordinate } from './Geo/Coordinate.js';
 
/**
 * Responsible for determining whether or not a new search should be ran based on the
 * location of the most recent search, the current center of the map, and the zoom level.
 */
class SearchDebouncer {
  constructor () {
    /**
     * The threshold for allowing a new search based on the distance to the previous search.
     * 
     * The unit is approximately the map width percentage. For example, if the threshold is 50,
     * a new search will not be allowed unless the currentMapCenter is further than 50% of the map
     * width away from the previous search.
     * 
     * @type {number}
     */
    this.relativeDistanceThreshold = 20;

    /**
     * The threshold for allowing a new search based on a change in zoom.
     * 
     * With a zoom threshold of 1, a new search will be ran every time the zoom changes by 1 or greater.
     * 
     * @type {number}
     */
    this.zoomThreshold = 1;
  }

  /**
   * Determines whether or not a search should be debounced
   * 
   * @param {Object} mostRecentSearchState
   * @param {Coordinate} mostRecentSearchState.mapCenter
   * @param {number} mostRecentSearchState.zoom
   * @param {Object} currentMapState
   * @param {Coordinate} currentMapState.mapCenter
   * @param {number} currentMapState.zoom
   * @retuns {boolean}
   */
  shouldBeDebounced (mostRecentSearchState, currentMapState) {
    this._validateMapStateObject(mostRecentSearchState);
    this._validateMapStateObject(currentMapState);

    const distanceToLastSearch = mostRecentSearchState.mapCenter.distanceTo(currentMapState.mapCenter);

    const relativeDistance = this._calculateRelativeDistance(distanceToLastSearch, currentMapState.zoom);
    const zoomDifference = Math.abs(currentMapState.zoom - mostRecentSearchState.zoom)

    const isOutsideDistanceThreshold = relativeDistance >= this.relativeDistanceThreshold;
    const isOutsideZoomThreshold = zoomDifference >= this.zoomThreshold;

    return !isOutsideDistanceThreshold && !isOutsideZoomThreshold;
  }

  /**
   * Throws an error if the object is missing any of the required params
   * 
   * @param {Object}
   */
  _validateMapStateObject (obj) {
    if (!('mapCenter' in obj)) {
      throw new Error('The search debouncer was passed an object which is missing the "mapCenter" property');
    }
    if (!('zoom' in obj)) {
      throw new Error('The search debouncer was passed an object which is missing the "zoom" property');
    }
  }

  /**
   * Calculates a distance relative to the map zoom level.
   * 
   * A relative distance of 100 is approximately equal to the width of the entire map.
   * 
   * Each change in the zoom level changes the total map width by an order of 2, which is why this formula
   * uses `Math.pow()`.
   * 
   * @param {number} distance in miles
   * @param {number} zoom 
   */
  _calculateRelativeDistance (distance, zoom) {
    return distance * Math.pow(2, zoom - 10);
  }
}

export { SearchDebouncer };