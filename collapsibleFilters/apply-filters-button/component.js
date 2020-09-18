class ApplyFiltersButton extends ANSWERS.Component {
  constructor(config = {}, systemConfig = {}) {
    super(config, systemConfig);
    this.core.globalStorage.on('update', 'vertical-results', data => {
      if (data.searchState === 'search-complete') {
        this.setState(data);
      }
    });
  }

  onMount () {
    const buttonEl = this._container.querySelector('.yxt-ApplyFiltersButton');
    buttonEl && buttonEl.addEventListener('click', () => {
      if (typeof this._config.onApply === 'function') {
        this._config.onApply.bind(this)();
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
    return 'ApplyFiltersButton';
  }

  static defaultTemplateName () {
    return 'collapsibleFilters/ApplyFiltersButton';
  }
}
ANSWERS.registerTemplate(
  'collapsibleFilters/ApplyFiltersButton',
  `{{{read 'collapsiblefilters/apply-filters-button/template' }}}`
);
ANSWERS.registerComponentType(ApplyFiltersButton);
