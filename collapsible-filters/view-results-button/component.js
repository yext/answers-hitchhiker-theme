class ViewResultsButton extends ANSWERS.Component {
  constructor(config = {}, systemConfig = {}) {
    super(config, systemConfig);
    this.core.globalStorage.on('update', 'vertical-results', data => {
      if (data.searchState === 'search-complete') {
        this.setState(data);
      }
    });
  }

  onMount () {
    const buttonEl = this._container.querySelector('.yxt-ViewResultsButton');
    buttonEl && buttonEl.addEventListener('click', () => {
      if (typeof this._config.onClick === 'function') {
        this._config.onClick.bind(this)();
      }
    });
  }

  setState (data = {}) {
    return super.setState({
      ...this.getState(),
      ...data,
      isNoResults: data.resultsContext === 'no-results',
      verticalKey: this.core.globalStorage.getState('search-config').verticalKey
    });
  }

  static get type() {
    return 'ViewResultsButton';
  }

  static defaultTemplateName () {
    return 'collapsibleFilters/ViewResultsButton';
  }
}
ANSWERS.registerTemplate(
  'collapsibleFilters/ViewResultsButton',
  `{{{read 'collapsible-filters/view-results-button/template' }}}`
);
ANSWERS.registerComponentType(ViewResultsButton);
