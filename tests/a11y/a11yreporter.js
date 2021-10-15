class A11yReporter {
  /**
   * @param {PageNavigator} pageNavigator
   * @param {AxePuppeteer} analyzer
   */
  constructor(pageNavigator, analyzer) {
    this._pageNavigator = pageNavigator;
    this._analyzer = analyzer;
    this.results = [];
  }

  async analyze() {
    await this._analyzeVerticalSearchPages();
    return this.results;
  }

  async _analyzeVerticalSearchPages() {
    await this._pageNavigator.gotoVerticalPage('menu_items', { query: 'roll' });
    this.results.push(await this._analyzer.analyze());
    await this._pageNavigator.gotoVerticalPage('people', { query: 'vrginia' });
    this.results.push(await this._analyzer.analyze());
  }
}

module.exports = A11yReporter;
