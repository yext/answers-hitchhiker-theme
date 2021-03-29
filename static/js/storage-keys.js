/**
 * An enum listing SDK storage keys for the theme. Because 
 * the SDK does not expose StorageKeys, non-theme specific 
 * keys may also live in this file.
 *
 * @enum {string}
 */
export default {
  // From SDK
  VERTICAL_RESULTS: 'vertical-results',
  QUERY: 'query',
  ALTERNATIVE_VERTICALS: 'alternative-verticals',

  // Locator
  LOCATOR_HOVERED_RESULT: 'locator-hovered-result',
  LOCATOR_SELECTED_RESULT: 'locator-selected-result',
  NUM_CONCURRENT_SEARCH_THIS_AREA_CALLS: 'num-concurrent-search-this-area-calls',
  LOCATOR_MAP_PROPERTIES: 'locator-map-properties',
  LOCATOR_CARD_FOCUS: 'locator-card-focus'
};

