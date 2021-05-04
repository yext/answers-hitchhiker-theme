import { Selector } from 'testcafe';

/**
 * Models the user interaction with a {import('@yext/answers-search-ui').VerticalResultsComponent}.
 */
class VerticalResults {
  constructor () {
    this._selector = Selector('.yxt-Results')
    this._focusedCard = Selector('.yxt-Card--pinFocused');
    this._noResults = Selector('.yxt-AlternativeVerticals-noResultsInfo');
    this._resultsCount = Selector('.yxt-VerticalResultsCount-total');
  }

  /**
   * Returns the number of results.
   * @returns {Promise<number>}
   */
  async getNumResults () {
    if (await this._noResults.exists) {
      return 0;
    }
    return await this.getResultsCountTotal();
  }

  /**
   * Returns the number of results from the VerticalResultsCount.
   * @returns {Promise<number>}
   */
  async getResultsCountTotal () {
    const countText = await this._resultsCount.innerText;
    return Number.parseInt(countText);
  }

  /**
   * Gets a selector for the card associated with the currently focused map pin.
   * @returns {Selector}
   */
  getFocusedCard () {
    return this._focusedCard;
  }

  /**
   * Gets a selector for the results div.
   * @returns {Selector}
   */
  getResults () {
    return this._selector;
  }
}

export default new VerticalResults();