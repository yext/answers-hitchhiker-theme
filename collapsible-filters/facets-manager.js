class FacetsManager {
  constructor() {
    this.state = {
      previousTop: 0,
      previousFacetLabel: ''
    };
  }

  onCreate(component) {
    this.disableFacetsWhileLoading(component);
    this.clearFacetsPersistentStorage();
  }

  onMount(component) {
    this.registerFacetsStateListeners(component);
    this.scrollToPreviousFacetGroup(component);
  }

  sendOnMountUpdate() {
    ANSWERS.core.globalStorage.set('facets-on-mount', 'update');
  }

  disableFacetsWhileLoading(component) {
    ANSWERS.core.globalStorage.on('update', 'vertical-results', data => {
      const inputEls =
        component._container.getElementsByClassName('js-yext-filter-option');
      const disabled = data.searchState === 'search-loading';
      for (const input of inputEls) {
        input.disabled = disabled;
      }
    });
  }

  registerFacetsStateListeners(component) {
    const facetGroupEls = component._container.querySelectorAll('.yxt-FilterOptions-fieldSet') || [];
    for (const facetGroupEl of facetGroupEls) {
      facetGroupEl.addEventListener('click', e => {
        this.state.previousTop = facetGroupEl.getBoundingClientRect().top;
        this.state.previousFacetLabel = facetGroupEl.dataset.label;
      });
    }
  }

  scrollToPreviousFacetGroup(component) {
    const filterOptionsSelectorByLabel =
      `.yxt-FilterOptions-fieldSet[data-label="${this.state.previousFacetLabel}"]`;
    const facetGroupEl =
      this.state.previousFacetLabel && component._container.querySelector(filterOptionsSelectorByLabel);
    if (facetGroupEl) {
      const downwardScrollNeeded =
        facetGroupEl.getBoundingClientRect().top - this.state.previousTop;
      scrollDown(downwardScrollNeeded);
      this.state.previousFacetLabel = null;
    }
  }

  clearFacetsPersistentStorage(prefix='Facets') {
    for (const urlParamKey in ANSWERS.core.persistentStorage.getAll()) {
      if (urlParamKey.startsWith(prefix)) {
        ANSWERS.core.persistentStorage.delete(urlParamKey, true)
      }
    }
  }
}

ComponentManagers.Facets = new FacetsManager();
