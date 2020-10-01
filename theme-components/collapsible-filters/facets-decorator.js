/**
 * FacetsDecorator is a wrapper around a facets component, and provides
 * life cycle methods required for collapsible-filters functionality.
 */
class FacetsDecorator {
  constructor() {
    this.state = {
      previousTop: 0,
      previousFacetLabel: ''
    };
  }

  onCreate(component) {
    this.disableFacetsWhileLoading(component);
  }

  onMount(component) {
    this.recordFacetsStateOnClick(component);
    this.scrollToPreviousFacetGroup(component);
  }

  /**
   * Registers event listeners that disable facets while vertical results
   * are loading.
   * @param {FacetsComponent} component 
   */
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

  /**
   * Register listeners that, when a click is made within a facet group,
   * store that facet groups label, and also its current distance from the
   * top of the screen, in state.
   * @param {FacetsComponent} component 
   */
  recordFacetsStateOnClick(component) {
    const facetGroupEls = component._container.querySelectorAll('.yxt-FilterOptions-fieldSet') || [];
    for (const facetGroupEl of facetGroupEls) {
      facetGroupEl.addEventListener('click', e => {
        this.state.previousTop = facetGroupEl.getBoundingClientRect().top;
        this.state.previousFacetLabel = facetGroupEl.dataset.label;
      });
    }
  }

  /**
   * Scrolls the users screen to the facet group that matches the label stored in state.
   * Tries to scroll so that it is in the same distance from the top of the screen as
   * was stored in state.
   * @param {FacetsComponent} component 
   */
  scrollToPreviousFacetGroup(component) {
    const filterOptionsSelectorByLabel =
      `.yxt-FilterOptions-fieldSet[data-label="${this.state.previousFacetLabel}"]`;
    const facetGroupEl =
      this.state.previousFacetLabel && component._container.querySelector(filterOptionsSelectorByLabel);
    if (facetGroupEl) {
      const downwardScrollNeeded =
        facetGroupEl.getBoundingClientRect().top - this.state.previousTop;
      JsHelpers.scrollDown(downwardScrollNeeded);
      this.state.previousFacetLabel = null;
    }
  }
}
