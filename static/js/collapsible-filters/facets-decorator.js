/**
 * FacetsDecorator is a wrapper around a facets component, and provides
 * life cycle methods required for collapsible-filters functionality.
 */
export default class FacetsDecorator {
  constructor() {
    this.state = {
      previousTop: 0,
      previousFacetLabel: ''
    };
  }

  /**
   * The decoration given to the FacetsComponent's onMount.
   * @param {FacetsComponent} component 
   */
  onMount(component) {
    this.recordFacetsStateOnClick(component);
    this.scrollToPreviousFacetGroup(component);
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
      this.scrollDown(downwardScrollNeeded);
      this.state.previousFacetLabel = null;
    }
  }


  /**
   * Scroll the screen down a certain distance.
   * @param {number} distance 
   */
  scrollDown (distance) {
    window.scroll({
      top: window.pageYOffset + distance
    });
  }
}