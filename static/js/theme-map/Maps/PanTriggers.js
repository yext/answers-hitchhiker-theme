/**
 * Describes the possible triggers for a map pan
 *
 * @enum {string}
 */
export default {
  /**
   * Indicates that the panTrigger is not set.
   */
  UNSET: '',
  /**
   * Indicates that the pan occured as a result of user interaction.
   * 
   * This includes moving the map or clicking on a pin cluster.
   */
  USER: 'user',
  /** 
   * Indicates that the map is panning due to programatic reason, and therefore a new
   * search should not be ran if the panHandler is called while this PanTrigger is set
   * on the Map.
   * 
   * This includes the automatic centering of the map after a new search is ran, or the
   * automatic centering of the map over a focused pin near the edge of the screen after
   * clicking or tabbing onto it.
   */
  API: 'api',
};