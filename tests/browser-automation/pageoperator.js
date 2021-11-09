const { BrowserPageWidths } = require("./constants");

/**
 * Responsible for determining which snapshots to take
 */
class PageOperator {
  /**
   * @param {PageNavigator} pageNavigator
   */
  constructor(pageNavigator, page, testLocations) {
    this._pageNavigator = pageNavigator;
    this._page = page;
    this._testLocations = testLocations;
    this._testLocationIndex = -1;
  }

  hasNextTestLocation() {
    return this._testLocationIndex < this._testLocations.length - 1;
  }

  async nextTestLocation() {
    this._testLocationIndex++;
    const testConfig = this._testLocations[this._testLocationIndex];
    await this._setPageViewport(testConfig.viewport);
    testConfig.page
      ? await this._pageNavigator.gotoVerticalPage(testConfig.page, testConfig.queryParams)
      : await this._pageNavigator.gotoUniversalPage(testConfig.queryParams);
    await this._executeTestCommands(testConfig.commands);
    return testConfig;
  }

  async _setPageViewport(viewport) {
    viewport === 'mobile'
      ? await this._page.setViewport({ width: BrowserPageWidths.Mobile, height: this._page.viewport().height })
      : await this._page.setViewport({ width: BrowserPageWidths.Desktop, height: this._page.viewport().height });
  }

  async _executeTestCommands(commands) {
    if(!commands) {
      return;
    }
    for (const command of commands ) {
      await this._pageNavigator[command.type].call(this._pageNavigator, command.params);
    }
  }
}

module.exports = PageOperator;
