/**
 * Responsible for navigating pages and capturing snapshots
 */
class Photographer {
  /**
   * Navigate to a universal page
   * 
   * @param {Object} obj
   * @param {string} obj.queryParams params to be put on the page. A leading '?' or '&' should
   *                                 not be supplied.
   */
  async gotoUniversalPage({ queryParams = '' } = {}) {}

  /**
   * Navigate to a vertical page
   * 
   * @param {Object} obj
   * @param {string} obj.vertical The vertical to navigate to.
   * @param {string} obj.queryParams params to be put on the page. A leading '?' or '&' should
   *                                 not be supplied.
   */
  async gotoVerticalPage({ vertical, queryParams = '' } = {}) {}

  /**
   * Click on an element of the current page
   * 
   * @param {string} selector The CSS selector to click on
   */
  async click(selector) {}
}

module.exports = Photographer;