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
    ANSWERS.resetAllFilters();
  }

  /**
   * Conduct a vertical search using the SDK.
   * @param {Object} options 
   */
  static verticalSearch(options) {
    ANSWERS.verticalSearch({
      ...options,
    });
  }
}