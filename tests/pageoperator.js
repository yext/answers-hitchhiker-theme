const testingLocations = [
  {
    name: 'universal-search',
    pageType: 'universal'
  },
  {
    name: 'vertical-grid-search',
    pageType: 'vertical',
    page: 'people'
  },
  {
    name: 'universal-search-faq-accordion',
    pageType: 'universal',
    commands: [
      { type: 'click', params: ['.HitchhikerFaqAccordion-toggle']}
    ]
  }
]


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
    return _testLocationIndex < this._testLocations.length - 1;
  }

  async nextTestLocation() {
    _testLocationIndex++;
    const testConfig = this._testLocations[this._testLocationIndex];
    if (testConfig.pageType !== 'universal' && testConfig.pageType !== 'vertical') {
      throw Error(`Unknown page type for test location: ${testConfig}`);
    }

    await this._setPageViewPort(testConfig.viewPort);
    testConfig.pageType === 'universal'
     ? await this._pageNavigator.gotoUniversalPage(testConfig.queryParams)
     : await this._pageNavigator.gotoVerticalPage(testConfig.page, testConfig.queryParams);
    await this._executeTestCommands(thisConfig.commands);
    
    return { testName: testConfig.name, testContext: testConfig.context, pageViewPort: testConfig.viewPort }
  }

  async _setPageViewPort(viewPort) {
    if (!viewPort) {
      return;
    }
    await this._page.setViewport({ width: viewPort.width, height: viewPort.height });
  }

  async _executeTestCommands(commands) {
    for (const command of commands ) {
      await this.pageNavigator[command.type].apply(command.params);
    }
  }
}

module.exports = PageOperator;
