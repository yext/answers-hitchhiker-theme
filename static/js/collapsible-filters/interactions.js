/**
 * Interactions manages page interactions for collapsible filters.
 */
export default class Interactions {
  constructor(domElements) {
    const { filterEls, resultEls } = domElements;
    this.filterEls = filterEls || [];
    this.resultEls = resultEls || [];
    this.viewResultsButton = document.getElementById('js-answersViewResultsButton');
    this.searchBarContainer = document.getElementById('js-answersSearchBar');
    this.resultsColumn = document.querySelector('.js-answersResultsColumn');
    this.inactiveCssClass = 'CollapsibleFilters-inactive';
    this.resultsWrapper = document.querySelector('.js-answersResultsWrapper');
    this.stickyButton = document.getElementById('js-answersViewResultsButton');
    this.parentIFrame = ('parentIFrame' in window) && parentIFrame;
    this.stickifyViewResultsButton();
  }

  _registerIFrameResizeStickyListener() {
    this.parentIFrame.getPageInfo(parentPageInfo => {
      const { offsetTop, windowHeight, scrollTop } = parentPageInfo;
      const windowTopToIFrameTop = offsetTop - scrollTop;
      const stickyButtonBottom = this.resultsWrapper.getBoundingClientRect().bottom;
      const stickyButtonBottomInParent = windowTopToIFrameTop + stickyButtonBottom;
      const hasScrolledPastResults = stickyButtonBottomInParent > windowHeight;
      if (hasScrolledPastResults) {
        const iFrameTopToButton = windowHeight - windowTopToIFrameTop - this.stickyButton.offsetHeight - 10;
        this.stickyButton.style.top = `${iFrameTopToButton}px`;
        this.stickyButton.style.bottom = 'auto';
      } else {
        this.stickyButton.style.top = '';
        this.stickyButton.style.bottom = '';
      }
      this._updateStickyButtonClassName(hasScrolledPastResults);
    })
  }


  /**
   * This gives "position: sticky"-like behavior to the view results button.
   * It does so by toggling on/off the CollapsibleFilters-unstuck css class.
   * If within an iframe, will use iframe-resizer to observe scrolling/resizing,
   * otherwise will register its own listeners.
   */
  stickifyViewResultsButton() {
    if (this.parentIFrame) {
      this._registerIFrameResizeStickyListener();
    } else {
      window.addEventListener('scroll', () => {
        this._updateStickyButton();
      });
      window.addEventListener('resize', () => {
        this._onResize();
      });
    }
  }

  /**
   * On window resize, update the given sticky element. 
   */
  _onResize() {
    if (this.stickyResizeTimer) {
      clearTimeout(this.stickyResizeTimer);
    }
    const DEBOUNCE_TIMER = 200;
    this.stickyResizeTimer = setTimeout(() => {
      this._updateStickyButton();
      this.stickyResizeTimer = undefined;
    }, DEBOUNCE_TIMER);
  }

  /**
   * If the user has scrolled past the results, give the sticky element
   * the CollapsibleFilters-unstuck css class. Otherwise remove it.
   */
  _updateStickyButton() {
    const stickyButtonBottom = this.resultsWrapper.getBoundingClientRect().bottom;
    const windowBottom = window.innerHeight;
    const hasScrolledPastResults = stickyButtonBottom > windowBottom;
    this._updateStickyButtonClassName(hasScrolledPastResults);
  }

  _updateStickyButtonClassName(hasScrolledPastResults) {
    if (hasScrolledPastResults) {
      this.stickyButton.classList.remove('CollapsibleFilters-unstuck');
    } else {
      this.stickyButton.classList.add('CollapsibleFilters-unstuck');
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
  collapseFilters() {
    console.log('collapse');
    this._toggleCollapsibleFilters(true);
  }

  /**
   * Hide the results view, and display the filters view.
   */
  expandFilters() {
    console.log('expand');
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
    if (!this._parentIFrame) {
      this._updateStickyButton();
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
  scrollToTop() {
    window.scroll({
      top: 0
    });
    if (this.resultsColumn) {
      this.resultsColumn.scrollTop = 0;
    }
  }
}
