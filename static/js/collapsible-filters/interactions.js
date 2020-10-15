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
    this.resultsColumn = document.querySelector('.js-answersResultsColumn');
    this.resultsWrapper = document.querySelector('.js-answersResultsWrapper');
    this.inactiveCssClass = 'CollapsibleFilters-inactive';
    this.stickyElements = [];
  }

  /**
   * This gives "position: sticky"-like behavior to CollapsibleFilters elements.
   * It does so by toggling on/off the CollapsibleFilters-unstuck css class.
   * 
   * @param {HTMLElement} stickyElement 
   */
  stickify(stickyElement) {
    this.stickyElements.push(stickyElement);
    window.addEventListener('scroll', () => {
      this._updateStickyElement(stickyElement);
    });
    window.addEventListener('resize', () => {
      this._onResize(stickyElement);
    });
  }

  /**
   * On window resize, update the given sticky element.
   * @param {HTMLElement} stickyElement 
   */
  _onResize(stickyElement) {
    if (this.stickyResizeTimer) {
      clearTimeout(this.stickyResizeTimer);
    }
    const DEBOUNCE_TIMER = 200;
    this.stickyResizeTimer = setTimeout(() => {
      this._updateStickyElement(stickyElement);
      this.stickyResizeTimer = undefined;
    }, DEBOUNCE_TIMER);
  }

  /**
   * If the user has scrolled past the results, give the sticky element
   * the CollapsibleFilters-unstuck css class. Otherwise remove it.
   * @param {HTMLElement} stickyElement 
   */
  _updateStickyElement(stickyElement) {
    const containerBottom = this.resultsWrapper.getBoundingClientRect().bottom;
    const windowBottom = window.innerHeight;
    const hasScrolledPastResults = containerBottom > windowBottom;
    if (hasScrolledPastResults) {
      stickyElement.classList.remove('CollapsibleFilters-unstuck');
    } else {
      stickyElement.classList.add('CollapsibleFilters-unstuck');
    }
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
    for (const el of this.stickyElements) {
      this._updateStickyElement(el);
    }
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
    if (this.resultsColumn) {
      this.resultsColumn.scrollTop = 0;
    }
  }
}
