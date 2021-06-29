import { Coordinate } from './Geo/Coordinate.js';
 
/**
 * Responsible for determining whether or not a new search should be ran based on the
 * location of the most recent search, the current center of the map, and the zoom level.
 */
class SearchPreventer {
  constructor () {
    /**
     * The threshold for allowing a new search based on the distance to the previous search.
     * 
     * The unit is a percentage of the map width. For example, if the threshold is .50,
     * a new search will not be allowed unless the currentMapCenter is further than 50% of the map
     * width away from the previous search.
     * 
     * @type {number}
     */
    this.relativeDistanceThreshold = .125;

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
   * Determines if a search should be prevented based on the relative distance of the current map
   * center to the previous map center.
   * 
   * @param {Coordinate} mostRecentSearchMapCenter
   * @param {Coordinate} currentMapCenter
   * @param {number} currentZoom
   * @returns {boolean}
   */
  isWithinDistanceThreshold ({ mostRecentSearchMapCenter, currentMapCenter, currentZoom }) {
    const distanceToLastSearch = currentMapCenter.distanceTo(mostRecentSearchMapCenter);
    const relativeDistance = this._calculateRelativeDistance(distanceToLastSearch, currentZoom);

    return relativeDistance <= this.relativeDistanceThreshold;
  }

  /**
   * Determines if a search should be prevented based on the difference between the map zoom during
   * the most recent search and the current map zoom.
   * 
   * @param {number} mostRecentSearchZoom
   * @param {number} currentZoom
   * @returns {boolean}
   */
  isWithinZoomThreshold ({ mostRecentSearchZoom, currentZoom }) {
    const zoomDifference = Math.abs(currentZoom - mostRecentSearchZoom);

    return zoomDifference <= this.zoomThreshold;
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
   * @returns {number}
   */
  _calculateRelativeDistance (distance, zoom) {
    const adjustment = 0.835; // The adjustment ensures that distanceInPixels is accurate
    const distanceInPixels = distance * Math.pow(2, zoom - 6) * adjustment;
    const widthOfMap = window.innerWidth || 1;
    return distanceInPixels / widthOfMap;
  }
}

export { SearchPreventer };