/**
 * Some helper methods concerning Collapsible Filters.
 */
export default class Helpers {
  static clearSearch() {
    ANSWERS.core.setQuery('');
    ANSWERS.core.persistentStorage.set('query', '');
  }

  /**
   * Resets all filters in the SDK.
   */
  static resetAllFilters() {
    const filterNodes = ANSWERS.core.filterRegistry
      .getAllFilterNodes()
      .filter(fn => fn.getFilter().getFilterKey());
    filterNodes.forEach(node => {
      node.remove();
    });
  }

  /**
   * Conduct a vertical search using the SDK.
   * @param {Object} options 
   */
  static verticalSearch(options) {
    const verticalKey = ANSWERS.core.globalStorage.getState('search-config').verticalKey;
    ANSWERS.core.verticalSearch(verticalKey, options);
  }

  /**
   * The SDK does not support Facets on load, however the Facets
   * component interacts with persistent storage in a way that suggests
   * that it does. This is a temporary fix until the SDK is patched.
   * @param {string} prefix 
   */
  static clearFacetsPersistentStorage(prefix = 'Facets') {
    for (const urlParamKey in ANSWERS.core.persistentStorage.getAll()) {
      if (urlParamKey.startsWith(prefix)) {
        ANSWERS.core.persistentStorage.delete(urlParamKey, true)
      }
    }
  }
}