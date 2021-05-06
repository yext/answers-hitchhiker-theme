/**
 * Responsible for navigating pages
 */
class PageNavigator {
  /**
   * Navigate to a universal page
   * 
   * @param {Object} queryParams params to be put on the page
   */
  async gotoUniversalPage(queryParams) {}

  /**
   * Navigate to a vertical page
   * 
   * @param {string} vertical The vertical to navigate to.
   * @param {Object} queryParams params to be put on the page
   */
  async gotoVerticalPage(vertical, queryParams) {}

  /**
   * Click on an element of the current page
   * 
   * @param {string} selector The CSS selector to click on
   */
  async click(selector) {}
}

module.exports = PageNavigator;