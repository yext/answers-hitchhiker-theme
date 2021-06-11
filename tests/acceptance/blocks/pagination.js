import { Selector, t } from 'testcafe';
import Page from './page';

/**
 * Models the user interaction with a {import('@yext/answers-search-ui').PaginationComponent}.
 */
class Pagination {
  constructor () {
    this._nextResultsButton = Selector('.js-yxt-Pagination-next');
  }

  async nextResults () {
    await Page.scrollToBottom(); // We must scroll to the bottom of the page to be able to click the next results page button
    await t.click(this._nextResultsButton);
  }
}

export default new Pagination();