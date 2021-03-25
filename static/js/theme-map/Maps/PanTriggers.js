/**
 * Describes the possible of triggers for a map pan
 *
 * @enum {string}
 */
export default {
  /**
   * Indicates that the panTrigger is not set, and therefore there is no specific
   * behavior that should occur if the panHandler is called with this PanTrigger.
   * 
   * This should be set if a user moves the map, or if a user clicks on a cluster.
   */
  UNSET: '',
  /** 
   * Indicates that the map is panning due to programatic reason, and therefore a new
   * search should not be ran if the panHandler is called while this PanTrigger is set
   * on the Map.
   * 
   * This includes panning the map after a new search is ran, or centering the map over
   * a focused pin after clicking or tabbing onto it.
   */
  API: 'api',
};