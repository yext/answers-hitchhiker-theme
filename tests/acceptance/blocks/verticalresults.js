import { Selector, t } from 'testcafe';

/**
 * Models the user interaction with a {import('@yext/answers-search-ui').VerticalResultsComponent}.
 */
class VerticalResults {
  constructor () {
    this._selector = Selector('.yxt-Results');
    this._searchComplete = Selector('.yxt-Results--searchComplete');
    this._searchLoading = Selector('.yxt-Results--searchLoading');
    this._preSearch = Selector('.yxt-Results--preSearch');
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
    return await this.getResultsCount();
  }

  /**
   * Returns the number of results from the VerticalResultsCount-total.
   * @returns {Promise<number>}
   */
  async getResultsCount () {
    const countText = await this._resultsCount.innerText;
    return Number.parseInt(countText);
  }

  /**
   * Returns the offset between the first result and the first result displayed
   * @returns {Promise<number>}
   */
   async getResultsOffset () {
    const countText = await this._resultsCountStart.innerText;
    return Number.parseInt(countText) - 1;
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
  }

  /**
   * Returns true if results are present
   * @returns {Promise<boolean>}
   */
  async isResultsPresent () {
    return this._selector.exists;
  }

  /**
   * wait for results to return based on search complete state 
   * (default selector timeout of 10 seconds)
   */
   async waitOnSearchComplete () {
    if(!this._preSearch.exists) {
      await this._searchLoading();
      await t.expect(this._searchLoading.exists).ok();
    }
    await this._searchComplete();
    await t.expect(this._searchComplete.exists).ok();
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