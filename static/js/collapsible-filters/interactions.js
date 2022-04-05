import QueryTriggers from '../constants/query-triggers';
import StorageKeys from '../constants/storage-keys';
import SearchStates from '../constants/search-states';
import ScssVariables from '../../scss/answers/_default.scss';

/**
 * Interactions manages page interactions for collapsible filters.
 */
export default class Interactions {
  constructor(config) {
    const { filterEls, resultEls, disableScrollToTopOnToggle, templateName } = config;
    this.collapsibleFiltersParentEl = document.querySelector('.CollapsibleFilters');
    this.filterEls = filterEls || [];
    this.resultEls = resultEls || [];
    this.templateName = templateName;
    this.viewResultsButton = document.getElementById('js-answersViewResultsButton');
    this.searchBarContainer = document.getElementById('js-answersSearchBar');
    this.resultsColumn = document.querySelector('.js-answersResultsColumn');
    this.inactiveCssClass = 'CollapsibleFilters-inactive';
    this.collapsedcCssClass = 'CollapsibleFilters--collapsed';
    this.expandedCssClass = 'CollapsibleFilters--expanded';
    this.resultsWrapper = document.querySelector('.js-answersResultsWrapper')
      || document.querySelector('.Answers-resultsWrapper');
    this._updateStickyButton = this._updateStickyButton.bind(this);
    this._debouncedStickyUpdate = this._debouncedStickyUpdate.bind(this);
    this._disableScrollToTopOnToggle = disableScrollToTopOnToggle;
  }

  /**
   * This gives "position: sticky"-like behavior to the view results button.
   * It does so by toggling on/off the CollapsibleFilters-unstuck css class.
   * If within an iframe, will use iframe-resizer to observe scrolling/resizing,
   * outside of the iframe, otherwise it will register its own listeners.
   * 
   * Setting iframeOnly to true will only register the listeners needed for iframed
   * experiences, and skip the listeners needed for non-iframe pages.
   * This is an optimization for cases when additional sticky support is not needed
   * for non-iframe experiences, since scroll/resize listeners are fairly expensive.
   */
  stickifyViewResultsButton(iframeOnly=false) {
    this.stickyButton = document.getElementById('js-answersViewResultsButton');
    if (!iframeOnly) {
      window.addEventListener('scroll', this._updateStickyButton);
      window.addEventListener('resize', this._debouncedStickyUpdate);
    }
    window.iframeLoaded.then(() => {
      this.parentIFrame = window.parentIFrame;
      this.parentIFrame.getPageInfo(parentPageInfo => {
        this.parentPageInfo = parentPageInfo;
        this._updateStickyButtonInIFrame();
      });
      if (!iframeOnly) {
        window.removeEventListener('scroll', this._updateStickyButton);
        window.removeEventListener('resize', this._debouncedStickyUpdate);
      }
    });
  }

  /**
   * Recalculate the sticky position again after a timeout. Additional updates
   * made before the timout will only extend the timeout rather than queuing
   * additional updates. Handles both iframe and non-iframe cases.
   */
  _debouncedStickyUpdate() {
    const DEBOUNCE_TIMER = 200;
    if (this.stickyResizeTimer) {
      clearTimeout(this.stickyResizeTimer);
    }
    this.stickyResizeTimer = setTimeout(() => {
      if (this.parentIFrame) {
        this._updateStickyButtonInIFrame();
      } else {
        this._updateStickyButton();
      }
      this.stickyResizeTimer = undefined;
    }, DEBOUNCE_TIMER);
  }

  /**
   * If the page is in an IFrame, will update the view results button to be sticky
   * with regards to the parent frame instead of the IFrame.
   */
  _updateStickyButtonInIFrame() {
    const { offsetTop, windowHeight, scrollTop } = this.parentPageInfo;
    const windowTopToIFrameTop = offsetTop - scrollTop;
    const stickyButtonBottom = this.resultsWrapper.getBoundingClientRect().bottom;
    const stickyButtonBottomInParent = windowTopToIFrameTop + stickyButtonBottom;
    const hasScrolledPastResultsButton = stickyButtonBottomInParent > windowHeight;
    if (hasScrolledPastResultsButton) {
      const iFrameTopToButton = windowHeight - windowTopToIFrameTop - this.stickyButton.offsetHeight - 10;
      this.stickyButton.style.top = `${iFrameTopToButton}px`;
      this.stickyButton.style.bottom = 'auto';
    } else {
      this.stickyButton.style.top = '';
      this.stickyButton.style.bottom = '';
    }
    this._updateStickyButtonClassName(hasScrolledPastResultsButton);
  }

  /**
   * If the user has scrolled past the results, position the sticky button absolutely
   * on the page. Otherwise, fix it to the bottom of the screen. This is for when the
   * page is not using an IFrame.
   */
  _updateStickyButton() {
    const stickyButtonBottom = this.resultsWrapper.getBoundingClientRect().bottom;
    const windowBottom = window.innerHeight;
    const hasScrolledPastResultsButton = stickyButtonBottom > windowBottom;
    this._updateStickyButtonClassName(hasScrolledPastResultsButton);
  }

  _updateStickyButtonClassName(hasScrolledPastResultsButton) {
    if (hasScrolledPastResultsButton) {
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
    ANSWERS.core.storage.registerListener({
      eventType: 'update',
      storageKey: StorageKeys.VERTICAL_RESULTS,
      callback: verticalResults => {
        const searchComplete = verticalResults.searchState === SearchStates.SEARCH_COMPLETE;
        const queryTrigger = ANSWERS.core.storage.get(StorageKeys.QUERY_TRIGGER);
        const isSearchbarSearch = queryTrigger === QueryTriggers.SEARCH_BAR;
        if (searchComplete && isSearchbarSearch) {
          this.collapseFilters();
        };
      }
    })
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
   * If isCollapsed is true, then set the css class for CollapsibleFilters 
   * indicating that the filters are collapsed.
   *
   * @param {boolean} isCollapsed
   */
  toggleCollapsedStatusClass(isCollapsed) {
    if (isCollapsed) {
      this.collapsibleFiltersParentEl.classList.remove(this.expandedCssClass);
      this.collapsibleFiltersParentEl.classList.add(this.collapsedcCssClass)
    } else {
      this.collapsibleFiltersParentEl.classList.add(this.expandedCssClass);
      this.collapsibleFiltersParentEl.classList.remove(this.collapsedcCssClass);
    }
  }

  /**
   * Either collapses or expands the collapsible filters panel.
   * @param {boolean} shouldCollapseFilters 
   */
  _toggleCollapsibleFilters(shouldCollapseFilters) {
    if (this.stickyButton) {
      // After toggling collapsible filters, let the rest of the page render first
      // before recalculating stickiness
      this._debouncedStickyUpdate();
    }
    for (const el of this.filterEls) {
      this.toggleInactiveClass(el, shouldCollapseFilters);
    }
    for (const el of this.resultEls) {
      this.toggleInactiveClass(el, !shouldCollapseFilters);
    }
    this.toggleInactiveClass(this.viewResultsButton, shouldCollapseFilters);
    this.toggleCollapsedStatusClass(shouldCollapseFilters);
    if (!this._disableScrollToTopOnToggle) {
      this.scrollToTop();
    }
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

  /**
   * Set the page template name as a CSS class on the footer so the it can be styled for CFilters
   */
  setupFooter() {
    const yxtFooter = document.querySelector('.js-yxtFooter');
    if (yxtFooter && this.templateName) {
      yxtFooter.classList.add(this.templateName);
    }
  }

  /**
   * Use media query with $breakpoint-expanded-filters to determines if the
   * page is in collapsible filters view.
   * 
   * @returns {boolean} whether the viewport is in collapsible filters view
   */
  isCollapsibleFiltersView() {
    const mediaQuery = window.matchMedia(`(min-width: ${ScssVariables.cssBreakpointExpandedFilters})`);
    return !mediaQuery.matches;
  }

  /**
   * Add a media query event listener when there's a width view port change
   * relative to $breakpoint-expanded-filters.
   *
   * @param {Function} handleViewportChange callback function to invoke when there's a media query event
   */
  addExpandedFiltersListener(handleViewportChange) {
    const mediaQuery = window.matchMedia(`(min-width: ${ScssVariables.cssBreakpointExpandedFilters})`);
    if ('addEventListener' in mediaQuery) {
      mediaQuery.addEventListener('change', e => handleViewportChange(e.matches));
     } else if ('addListener' in mediaQuery) {
      mediaQuery.addListener(e => handleViewportChange(e.matches));
     }
  }

  /**
   * Update FiltersWrapper HTML element's location when switching between expanded
   * and collapsible filters view in page templates that follows the sidebar and
   * mainContent div structure (e.g. VerticalStandard and VerticalGrid).
   */
  setupResposiveFiltersLayout() {
    const moveFiltersWrapper = containerClassName => {
      const containerEl = document.getElementsByClassName(containerClassName)?.[0];
      const filtersWrapperEl = document.getElementsByClassName('js-answersFiltersWrapper')?.[0];
      if (containerEl && filtersWrapperEl) {
        containerEl.appendChild(filtersWrapperEl);
      }
    }
    if (this.isCollapsibleFiltersView()) {
      moveFiltersWrapper('js-answersMainContent');
    }
    this.addExpandedFiltersListener(isExpanded => {
      if (isExpanded) {
        moveFiltersWrapper('js-answersSidebar');
      } else {
        moveFiltersWrapper('js-answersMainContent');
      }
    });
  }
}
