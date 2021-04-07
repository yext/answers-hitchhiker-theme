/**
 * Defines the possible mobile map states
 * 
 * Map view and list view are mutually exclusive, however detail shown can only occur
 * on the map view.
 *
 * @enum {string}
 */
export default {
  MAP_VIEW: 'mapView',
  LIST_VIEW: 'listView',
  DETAIL_SHOWN: 'detailShown'
};
