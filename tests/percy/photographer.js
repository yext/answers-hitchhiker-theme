/**
 * Responsible for navigating pages and capturing snapshots
 */
class Photographer {
  constructor() {}

  /**
   * Navigate to a universal page
   * 
   * @param {Object} obj
   * @param {string} obj.queryParams params to be put on the page. A leading '?' or '&' should
   *                                    not be supplied.
   */
  async gotoUniversalPage({ queryParams = '' } = {}) {}

  /**
   * Navigate to a vertiacl page
   * 
   * @param {Object} obj
   * @param {string} obj.vertical The vertical to navigate to.
   * @param {string} obj.queryParams params to be put on the page. A leading '?' or '&' should
   *                                    not be supplied.
   */
  async gotoVerticalPage({ vertical, queryParams = '' } = {}) {}

  /**
   * Take a mobile and desktop snapshot of the current page
   * 
   * @param {string} snapshotName The name of the snapshot to capture.
   */
  async snapshot(snapshotName) {}

  /**
   * Take a desktop snapshot of the current page
   * 
   * @param {string} snapshotName The name of the snapshot to capture.
   */
  async snapshotDesktopOnly(snapshotName) {}

  /**
   * Take a mobile snapshot of the current page
   * 
   * @param {string} snapshotName The name of the snapshot to capture.
   */
  async snapshotMobileOnly(snapshotName) {}

  /**
   * Click on an element of the current page
   * 
   * @param {string} selector The CSS selector to click on
   */
  async click(selector) {}
}

module.exports = Photographer;