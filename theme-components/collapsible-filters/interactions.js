/**
 * CollapsibleFiltersInteractions manages page interactions for collapsible filters.
 */
class CollapsibleFiltersInteractions {
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
  registerHideFiltersOnSearchbarSearch() {
    let pendingQueryUpdate = false;

    ANSWERS.core.globalStorage.on('update', 'query', () => {
      pendingQueryUpdate = true;
    });

    ANSWERS.core.globalStorage.on('update', 'vertical-results', verticalResults => {
      if (verticalResults.searchState !== 'search-complete' || !pendingQueryUpdate) {
        return;
      }
      pageInteractions.hideFilters();
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
  hideFilters () {
    this._toggleFilters(true);
  }

  /**
   * Hide the results view, and display the filters view.
   */
  showFilters() {
    this._toggleFilters(false);
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

  _toggleFilters(hideFilters) {
    for (const el of this.filterEls) {
      this.toggleInactiveClass(el, hideFilters);
    }
    for (const el of this.resultEls) {
      this.toggleInactiveClass(el, !hideFilters);
    }
    this.toggleInactiveClass(this.viewResultsButton, hideFilters);
    JsHelpers.scrollToTop();
    ANSWERS.core.globalStorage.set('hh-filter-panel', {
      panelIsDisplayed: !hideFilters
    });
  }
}
