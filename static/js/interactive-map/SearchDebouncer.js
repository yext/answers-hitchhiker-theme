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
    this.relativeDistanceThreshold = 40;

    /**
     * The threshold for allowing a new search based on a change in zoom.
     * 
     * With a zoom threshold of 1, a new search will be ran every time the zoom changes by 1 or greater.
     * 
     * @type {number}
     */
    this.zoomThreshold = 1;

    /**
     * The location of the most recent search
     * @type {Coordinate}
     */
    this.mostRecentSearchLocation = new Coordinate(37.0902, -95.7129);

    /**
     * The zoom level of the map during the most recent search.
     * 
     * See {@link Map.getZoom} for more information on the unit.
     * 
     * @type {number}
     */
    this.mostRecentSearchZoomLevel = 14;
  }

  /**
   * Set the location of the most recent search
   * 
   * @param {Coordinate} coordinate
   */
  updateMostRecentSearchLocation (coordinate) {
    this.mostRecentSearchLocation = coordinate;
  }

  /**
   * Set the zoom level of the most recent search
   * 
   * @param {number} num
   */
  updateMostRecentSearchZoomLevel (num) {
    this.mostRecentSearchZoomLevel = num;
  }

  /**
   * Determines whether or not a search should be allowed or debounced
   * 
   * @param {Coordinate} currentMapCenter 
   * @param {number} currentMapZoom 
   */
  isSearchAllowed (currentMapCenter, currentMapZoom) {
    const distanceToLastSearch = this.mostRecentSearchLocation.distanceTo(currentMapCenter);

    const relativeDistance = this._calculateRelativeDistance(distanceToLastSearch, currentMapZoom);
    const zoomDifference = Math.abs(currentMapZoom - this.mostRecentSearchZoomLevel)

    const isOutsideDistanceThreshold = relativeDistance >= this.relativeDistanceThreshold;
    const isOutsideZoomThreshold = zoomDifference >= this.zoomThreshold;

    return isOutsideDistanceThreshold || isOutsideZoomThreshold;
  }

  /**
   * Calculates a distance relative to the map zoom level.
   * 
   * A relative distance of 100 is approximately equal to the width of the entire map.
   * 
   * Each change in the zoom level changes the total map width by an order of 2, which is why this formula
   * uses `Math.pow()`. The zoom is offet by 8 because the zoom formula defined by {@link Map.getZoom} is
   * offset by 8
   * 
   * @param {number} distance in miles
   * @param {number} zoom 
   */
  _calculateRelativeDistance (distance, zoom) {
    return distance * Math.pow(2, zoom - 8);
  }
}

export { SearchDebouncer };