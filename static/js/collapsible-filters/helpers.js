/**
 * Some helper methods concerning Collapsible Filters.
 */
export default class Helpers {
  static clearSearch() {
    ANSWERS.search('');
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
    const verticalKey = ANSWERS.core.storage.get('search-config').verticalKey;
    ANSWERS.core.verticalSearch(verticalKey, options);
  }
}