import { Selector, t } from 'testcafe';

/**
 * Models the user interaction with a {import('@yext/answers-search-ui').VerticalResultsComponent}.
 */
class VerticalResults {
  constructor () {
    this._selector = Selector('.yxt-Results')
    this._resultsWrapper = Selector('.Answers-resultsWrapper');
    this._focusedCard = Selector('.yxt-Card--pinFocused');
    this._getNthCard = index => Selector(`.yxt-Card[data-opts*="${index}"]`);
    this._noResults = Selector('.yxt-AlternativeVerticals-noResultsInfo');
    this._resultsCount = Selector('.yxt-VerticalResultsCount-total');
    this._resultsCountStart = Selector('.yxt-VerticalResultsCount-start');
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
   * Returns the number of results from the VerticalResultsCount-total.
   * @returns {Promise<number>}
   */
  async getResultsCountTotal () {
    const countText = await this._resultsCount.innerText;
    return Number.parseInt(countText);
  }

  /**
   * Returns the number of results from the VerticalResultsCount-start.
   * @returns {Promise<number>}
   */
   async getResultsCountStart () {
    const countText = await this._resultsCountStart.innerText;
    return Number.parseInt(countText);
  }

  /**
   * Returns true if a card from the vertical results is focused
   * @returns {Promise<boolean>}
   */
  async isCardFocused () {
    return this._focusedCard.exists;
  }

  /**
   * Clicks the card specified by the card index
   */
  async clickCard (cardIndex) {
    await t.click(this._getNthCard(cardIndex));
    await t.wait(1000); // Added to allow the tests to pass in IE11
  }

  /**
   * Returns true if results are present
   * @returns {Promise<boolean>}
   */
  async isResultsPresent () {
    return this._selector.exists;
  }

  /**
   * Gets the number of pixels that the element's content is scrolled upward
   * @returns {Promise<number>}
   */
  async getScrollTop () {
    return this._resultsWrapper.scrollTop
  }

  async scrollToBottom () {
    await t.scroll(this._resultsWrapper, 'bottom');
  }
}

export default new VerticalResults();