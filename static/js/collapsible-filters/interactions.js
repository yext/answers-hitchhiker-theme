/**
 * Interactions manages page interactions for collapsible filters.
 */
export default class Interactions {
  constructor (domElements) {
    const { filterEls, resultEls } = domElements;
    this.filterEls = filterEls || [];
    this.resultEls = resultEls || [];
    this.viewResultsButton = document.getElementById('js-answersViewResultsButton');
    this.searchBarContainer = document.getElementById('js-answersSearchBar');
    this.inactiveCssClass = 'CollapsibleFilters-inactive';
  }

  /**
   * Register event listeners that will hide the filters after a search
   * made by the searchbar is completed.
   */
  registerCollapseFiltersOnSearchbarSearch() {
    let pendingQueryUpdate = false;

    ANSWERS.core.globalStorage.on('update', 'query', () => {
      pendingQueryUpdate = true;
    });

    ANSWERS.core.globalStorage.on('update', 'vertical-results', verticalResults => {
      if (verticalResults.searchState !== 'search-complete' || !pendingQueryUpdate) {
        return;
      }
      this.collapseFilters();
      pendingQueryUpdate = false;
    });
  }

  /**
   * Focus the search bar input, if one exists.
   */
  focusSearchBar() {
    const searchInputEl = this.searchBarContainer && 
      this.searchBarContainer.querySelector('.js-yext-query');
    searchInputEl && searchInputEl.focus();
  }

  /**
   * Marks an DOM element with the inactive css class.
   * @param {HTMLElement} el 
   */
  markAsInactive(el) {
    el.classList.add(this.inactiveCssClass);
  }

  /**
   * Hide the filters view, and display the results view.
   */
  collapseFilters () {
    this._toggleCollapsibleFilters(true);
  }

  /**
   * Hide the results view, and display the filters view.
   */
  expandFilters() {
    this._toggleCollapsibleFilters(false);
  }

  toggleInactiveClass(el, isInactive) {
    if (!el) {
      return;
    }
    if (isInactive) {
      el.classList.add(this.inactiveCssClass)
    } else {
      el.classList.remove(this.inactiveCssClass);
    }
  }

  /**
   * Either collapses or expands the collapsible filters panel.
   * @param {boolean} shouldCollapseFilters 
   */
  _toggleCollapsibleFilters(shouldCollapseFilters) {
    for (const el of this.filterEls) {
      this.toggleInactiveClass(el, shouldCollapseFilters);
    }
    for (const el of this.resultEls) {
      this.toggleInactiveClass(el, !shouldCollapseFilters);
    }
    this.toggleInactiveClass(this.viewResultsButton, shouldCollapseFilters);
    this.scrollToTop();
    ANSWERS.components.getActiveComponent('FilterLink').setState({
      panelIsDisplayed: !shouldCollapseFilters
    });
  }

  /**
   * Scroll the screen to the top.
   */
  scrollToTop () {
    window.scroll({
      top: 0
    });
  }
}
