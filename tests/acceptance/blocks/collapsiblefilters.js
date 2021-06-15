import { Selector, t } from 'testcafe';

/**
 * Models the user interaction with collapsible filters
 */
class CollapsibleFilters {
  constructor () {
    this._viewFiltersButton = Selector('.js-changeFilters');
    this._viewResultsButton = Selector('.Hitchhiker-ViewResultsButton');
    this._collapsibleFiltersExpanded = Selector('.CollapsibleFilters--expanded');
  }

  /**
   * Opens the filter view
   */
  async viewFilters () {
    await t.click(this._viewFiltersButton);
  }

  /**
   * Closes the filter view and opens the list view
   */
  async viewResults () {
    await t.click(this._viewResultsButton);
  }

  /**
   * Returns true if the filter view is open
   * @returns {Promise<boolean>}
   */
  async isFilterViewOpen () {
    return this._collapsibleFiltersExpanded.exists;
  }
}

export default new CollapsibleFilters();