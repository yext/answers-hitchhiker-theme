import { Selector, t } from 'testcafe';

/**
 * This class models user interactions with the {import('@yext/answers-search-ui').SearchBarComponent}.
 */
class SearchBar {
  constructor () {
    this._input = Selector('.yxt-SearchBar-input');
    this._clearButton = Selector('.yxt-SearchBar-clear');
    this._submitButton = Selector('.yxt-SearchBar-button');
    this._options = Selector('.yxt-AutoComplete-option');
  }

  /**
   * Enters a query into the search bar without submitting it.
   * 
   * @param {string} query The query to enter in the input
   */
  async enterQuery (query) {
    await t.typeText(this._input, query);
  }

  /**
   * Submits the provided search query.
   * 
   * @param {string} query The query to submit
   */
  async submitQuery (query) {
    if (query) {
      await this.enterQuery(query);
    }
    await t.click(this._submitButton);
  }

  /**
   * Clears whatever query is presently in the search bar.
   */
  async clearQuery () {
    await t.click(this._clearButton);
  }

  /**
   * Finds the autocomplete option with the provided value and
   * clicks it.
   * 
   * @param {string} value The value of the autocomplete option to
   *                       select.
   */
  async selectOption (value) {
    const option = this._options.withExactText(value);
    await t.click(option);
  }
}

export default new SearchBar();