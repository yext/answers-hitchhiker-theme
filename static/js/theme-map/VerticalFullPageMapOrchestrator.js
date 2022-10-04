import { Coordinate } from './Geo/Coordinate.js';
import { smoothScroll } from './Util/SmoothScroll.js';
import { isViewableWithinContainer, removeElement, debounce } from './Util/helpers.js';
import { SearchPreventer } from './SearchPreventer';
import { defaultCenterCoordinate } from './constants.js';

import ZoomTriggers from './Maps/ZoomTriggers.js';
import PanTriggers from './Maps/PanTriggers.js';
import MobileStates from './MobileStates';

import StorageKeys from '../constants/storage-keys.js';

/**
 * The component to control the interactions for an interative map.
 * Interactions like clicking on a pin or dragging the map and
 * searching an area is controlled here
 */
class VerticalFullPageMapOrchestrator extends ANSWERS.Component {
  constructor(config, systemConfig) {
    super(config, systemConfig);

    /**
     * Name of a location card type
     * 
     * @type {string}
     */
    this.cardType = config.cardType;

    /**
     * The container in the DOM for the interactive map
     * @type {HTMLElement}
     */
    this._mapContainerSelector = '#js-answersMap';

    /**
     * The page wrapper DOM element
     * @type {HTMLElement}
     */
    this._pageWrapperEl = document.querySelector('.YxtPage-wrapper');

    /**
     * The results wrapper DOM element
     * @type {HTMLElement}
     */
    this._resultsWrapperEl = this._container.querySelector('.js-locator-resultsWrapper');

    /**
     * The current Answers API vertical key
     * @type {string}
     */
    this.verticalKey = config.verticalKey; 

    /**
     * The vertical configuration
     * @type {Object}
     */
    this.verticalsConfig = config.verticalPages || [];

    /**
     * Map options to be passed directly to the Map Provider
     * @type {Object}
     */
    this.providerOptions = config.providerOptions || {};

    /**
     * The default center coordinate for the map, an object with {lat, lng}
     * @type {Coordinate}
     */
    this.defaultCenter = this.providerOptions.center
      ? new Coordinate(this.providerOptions.center)
      : defaultCenterCoordinate;

    /**
     * The default zoom level for the map
     * @type {number}
     */
    this.defaultZoom = this.providerOptions.zoom || 4;

    /**
     * The current zoom level of the map
     * @type {number}
     */
    this.currentZoom = this.defaultZoom;

    /**
     * The zoom level of the map during the most recent search
     * @type {number}
     */
    this.mostRecentSearchZoom = this.defaultZoom;

    /**
     * The center of the map during the most recent search
     * @type {Coordinate}
     */
    this.mostRecentSearchLocation = this.defaultCenter;

    /**
     * Whether the map should search on a map movement action like map drag
     * @type {boolean}
     */
    this.searchOnMapMove = !config.disableSearchOnMapMove;

    /**
     * The configuration for the no results state
     * @type {Object}
     */
    this.noResultsConfig = config.noResults || {};

    /**
     * Whether the map should display all results on no results
     * @type {boolean}
     */
    this.displayAllResultsOnNoResults = this.noResultsConfig.displayAllResults;

    /**
     * The mobile breakpoint (inclusive max) in px
     * @type {Number}
     */
    this.mobileBreakpointMax = 991;

    /**
     * Provides information about whether or not the window is within the mobile breakpoint
     * @type {MediaQueryList}
     */
    this.mobileBreakpointMediaQuery = window.matchMedia(`(max-width: ${this.mobileBreakpointMax}px)`);

    /**
     * The current view for mobile.
     * 
     * Either MobileStates.LIST_VIEW or MobileStates.MAP_VIEW
     */
    this._mobileView = MobileStates.LIST_VIEW;

    /**
     * Determines whether or not another search should be ran
     * @type {SearchPreventer}
     */
    this.searchPreventer = new SearchPreventer();

    /**
     * A search this area function with a debounce applied
     */
    this.debouncedSearchThisArea = debounce(this.searchThisArea.bind(this), 250);

    /**
     * The detail card which apears on mobile after clicking a pin
     * @type {Element}
     */
    this._detailCard = null;

    /**
     * The passthrough config for the Alternative Verticals component
     * NOTE This component is added as a child to this component because Alternative Verticals
     * in the SDK is not designed to be a standalone component. In this layout, it cannot be
     * a child of the Vertical Results because we want it to show on the map view. So we make it
     * a child of the larger component.
     * @type {Object}
     */
    this.alternativeVerticalsConfig = config.alternativeVerticalsConfig;

    /**
     * Indicates whether or not the handleMapCenterChangefunction has been invoked
     */
    this.isFirstMapCenterChangeInvocation = true;
  }

  onCreate () {
    this.core.storage.registerListener({
      eventType: 'update', 
      storageKey: StorageKeys.MAP_LOADED,
      callback: () => {
        this.updateMostRecentSearchState()
      }
    })

    this.core.storage.registerListener({
      eventType: 'update',
      storageKey: StorageKeys.VERTICAL_RESULTS,
      callback: (data) => {
        this.setState(data)
      }
    });

    this.core.storage.registerListener({
      eventType: 'update',
      storageKey: StorageKeys.QUERY,
      callback: () => this.updateMostRecentSearchState()
    });

    const searchThisAreaToggleEls = this._container.querySelectorAll('.js-searchThisAreaToggle');
    searchThisAreaToggleEls.forEach((el) => {
      el.addEventListener('click', (e) => {
        this.searchOnMapMove = e.target.checked;
        if (this.searchOnMapMove) {
          this._container.classList.remove('VerticalFullPageMap--showSearchThisArea');
        } else {
          this._container.classList.add('VerticalFullPageMap--showSearchThisArea');
        }
      });
    });

    const searchThisAreaButtonEl = this._container.querySelector('.js-searchThisAreaButton');
    searchThisAreaButtonEl.addEventListener('click', (e) => {
      this.searchThisArea();
    });
    this.setupMobileBreakpointListener();
    this.addMapComponent();
    this.setFixedHeightsOnAndroid();
  }

  /**
   * On Android browsers, opening up the keyboard will shift the contents of the entire page up,
   * moving the map center, and thereby causing a searchOnMapMove to be triggered.
   * The search response would then cause the page to update,
   * and close the keyboard, making it impossible to actually type anything into the searchbar.
   * 
   * Setting a fixed height on elements like .Answers-mapWrapper prevents the keyboard from shifting the content
   * of the page.
   */
   setFixedHeightsOnAndroid() {
    if (!this.isMobile() || !/Android/i.test(navigator.userAgent)) {
      return;
    }

    setFixedHeight('.Answers-mapWrapper')

    function getSingleElement(selector) {
      const els = document.querySelectorAll(selector);
      if (els.length === 0) {
        console.error(`No ${selector} found, unable to set fixed height for the full page map.`);
      } else if (els.length > 1) {
        console.error(
          `Multiple elements for ${selector} found, expected only 1, not setting fixed height for the full page map.`);
      } else {
        return els[0];
      }
    }

    function setFixedHeight(selector) {
      const el = getSingleElement(selector)
      el.style.height = `${el.scrollHeight}px`
    }
  }

  /**
   * Properly set CSS classes for mobile and desktop
   */
   setupMobileBreakpointListener () {
    if (!this.isMobile()) {
      this.updateCssForDesktop();
    }

    const breakpointChangeHandler = () => {
      if (this.isMobile()) {
        this.updateCssForMobile();
      } else {
        this.core.storage.set('DISABLE_RENDER_RESULTS', false);
        this.updateCssForDesktop();
      }
    };
    if (this.mobileBreakpointMediaQuery.addEventListener) {
      this.mobileBreakpointMediaQuery
        .addEventListener('change', breakpointChangeHandler, { passive: true });
    } else {
      this.mobileBreakpointMediaQuery.addListener(breakpointChangeHandler); // For IE11
    }
  }

  /**
   * @returns {boolean}
   */
  isMobile () {
    return this.mobileBreakpointMediaQuery.matches;
  }

  updateCssForMobile () {
    if (this._mobileView === MobileStates.LIST_VIEW) {
      this.addCssClassesForState(MobileStates.LIST_VIEW);
      this.removeCssClassesForState(MobileStates.MAP_VIEW);
      this.removeCssClassesForState(MobileStates.DETAIL_SHOWN); 
    } else if (this._mobileView === MobileStates.MAP_VIEW) {
      this.addCssClassesForState(MobileStates.MAP_VIEW);
      this.removeCssClassesForState(MobileStates.LIST_VIEW);
    }
  }

  updateCssForDesktop () {
    const statesToRemove = [MobileStates.LIST_VIEW, MobileStates.MAP_VIEW, MobileStates.DETAIL_SHOWN];
    statesToRemove.forEach(state => {
      this.removeCssClassesForState(state);
    });
  }

  setMobileMapView () {
    this._mobileView = 'mapView';
    this.updateCssForMobile();
  }

  setMobileListView () {
    this._mobileView = 'listView';
    this.updateCssForMobile();
  }

  /**
   * @param {MobileStates} mobileState
   */
  addCssClassesForState(mobileState) {
    const classModifier = this.getModifierForState(mobileState);
    this._container.classList.add(`VerticalFullPageMap--${classModifier}`);
    this._pageWrapperEl.classList.add(`YxtPage-wrapper--${classModifier}`);
  }

  /**
   * @param {MobileStates} mobileState 
   */
  removeCssClassesForState(mobileState) {
    const classModifier = this.getModifierForState(mobileState);
    this._container.classList.remove(`VerticalFullPageMap--${classModifier}`);
    this._pageWrapperEl.classList.remove(`YxtPage-wrapper--${classModifier}`);
  }

  /**
   * Returns a css class modifier for a given mobile state.
   * 
   * @param {MobileStates} mobileState 
   * @returns {string}
   */
  getModifierForState(mobileState) {
    switch (mobileState) {
      case MobileStates.LIST_VIEW:
        return 'mobileListView'
      case MobileStates.MAP_VIEW:
        return 'mobileMapView'
      case MobileStates.DETAIL_SHOWN:
        return 'mobileDetailShown'
      default:
        throw new Error('Invalid mobile state');
    }
  }
  
  addMapComponent () {
    /**
     * Sets up mobile view toggles and search bar listeners
     *
     * @param {Object} data The data (formatted in the Consulting LiveAPI format) of results
     * @param {Map} map The map object
     * @param {Object} pins Mapping from pin id to the pin object on the map
     */
    const onPostMapRender = (data, map, pins) => {
      this.setupMobileViewToggles(data, map, pins);
      this.setupSearchBarListeners();
    };

    /**
     * Clicking a pin cluster searches the new area, if desired
     */
    const pinClusterClickListener = () => this.searchOnMapMove && this.searchThisArea();

    /**
     * The listener called when the map pans
     */
    const panHandler = (prevousBounds, currentBounds, panTrigger) => {
      if (panTrigger === PanTriggers.API) {
        return;
      }

      this.handleMapCenterChange();
    }

    /**
     * The listener called when the zoom changes
     *
     * @param {number} zoom The zoom during a zoom event
     * @param {ZoomTriggers} zoomTrigger The intitiator of the zoom
     */
    const zoomChangedListener = (zoom, zoomTrigger) => {};

    /**
     * User-initiated changes to the map zoom searches the new area, if desired
     * Clicking on a cluster or fitting the bounds for results is not considered user-initiated
     *
     * @param {number} zoom The zoom after this event
     * @param {ZoomTriggers} zoomTrigger The intitiator of the zoom
     */
    const zoomEndListener = (zoom, zoomTrigger) => {
      this.currentZoom = zoom;

      if (zoomTrigger !== ZoomTriggers.USER) {
        return;
      }

      this.handleMapZoomChange();
    };

    ANSWERS.addComponent('ThemeMap', Object.assign({}, {
      container: this._mapContainerSelector,
      mapProvider: this._config.mapProvider,
      apiKey: this._config.apiKey,
      clientId: this._config.clientId,
      locale: this._config.locale,
      contentWrapperEl: this._container.querySelector('.js-locator-contentWrap'),
      providerOptions: this._config.providerOptions,
      defaultCenter: this.defaultCenter,
      defaultZoom: this.defaultZoom,
      mobileBreakpointMax: this.mobileBreakpointMax,
      pinOptions: this._config.pin,
      pinClusterOptions: this._config.pinCluster,
      enablePinClustering: this._config.enablePinClustering,
      noResultsConfig: this.noResultsConfig,
      onPinSelect: this._config.onPinSelect,
      onPostMapRender: onPostMapRender,
      pinFocusListener: (index, id) => this.pinFocusListener(index, id),
      pinClusterClickListener: pinClusterClickListener,
      zoomChangedListener: zoomChangedListener,
      zoomEndListener: zoomEndListener,
      panHandler: panHandler,
      canvasClickListener: () => this.deselectAllResults()
    }));
  }

  /**
   * Search the area or show the search the area button according to configurable logic
   */
  handleMapCenterChange () {
    const isIframe = 'parentIFrame' in window;
    const isFirstMapCenterChangeInvocation = this.isFirstMapCenterChangeInvocation;
    this.isFirstMapCenterChangeInvocation = false;
    // Ignore the first invocation of this function within an iframe because it is triggered by the iframe
    // resizer and not by the user
    if (isFirstMapCenterChangeInvocation && isIframe) {
      return;
    }

    if (!this.searchOnMapMove) {
      this._container.classList.add('VerticalFullPageMap--showSearchThisArea');
      return;
    }

    if (!this.shouldSearchBePreventedBasedOnCenter()) {
      this.debouncedSearchThisArea();
    }
  }

  /**
   * Search the area or show the search the area button according to configurable logic
   */
  handleMapZoomChange () {
    if (!this.searchOnMapMove) {
      this._container.classList.add('InteractiveMap--showSearchThisArea');
      return;
    }

    if (!this.shouldSearchBePreventedBasedOnZoom()) {
      this.debouncedSearchThisArea();
    }
  }

  /**
   * Returns true if a search should be prevented based on the center of the current map
   * and the center of the map during the most recent search
   * 
   * @returns {boolean}
   */
  shouldSearchBePreventedBasedOnCenter () {
    return this.searchPreventer.isWithinDistanceThreshold({
      mostRecentSearchMapCenter: this.mostRecentSearchLocation,
      currentMapCenter: this.getCurrentMapCenter(),
      currentZoom: this.currentZoom
    });
  }

  /**
   * Returns true if a search should be prevented based on the previous search zoom level and
   * the current zoom level
   * 
   * @returns {boolean}
   */
  shouldSearchBePreventedBasedOnZoom () {
    return this.searchPreventer.isWithinZoomThreshold({
      mostRecentSearchZoom: this.mostRecentSearchZoom,
      currentZoom: this.currentZoom
    });
  }

  /**
   * Sets the most recent search state to the current map state
   */
  updateMostRecentSearchState () {
    this.mostRecentSearchZoom = this.currentZoom;
    this.mostRecentSearchLocation = this.getCurrentMapCenter();
  }

  /**
   * Returns the current center of the map
   * 
   * @returns {Coordinate}
   */
  getCurrentMapCenter () {
    const mapProperties = this.core.storage.get(StorageKeys.LOCATOR_MAP_PROPERTIES);

    if (!mapProperties) {
      return this.defaultCenter;
    }

    const center = mapProperties.visibleCenter;
    const lat = center.latitude;
    const lng = center.longitude;

    return new Coordinate(lat, lng);
  }

  /**
   * Deselect all results by updating CSS classes, removing the detail card if present, and
   * updating global storage.
   */
  deselectAllResults () {
    this.removeCssClassesForState(MobileStates.DETAIL_SHOWN);

    document.querySelectorAll('.yxt-Card--pinFocused').forEach((el) => {
      el.classList.remove('yxt-Card--pinFocused');
    });

    removeElement(this._detailCard);

    this.core.storage.set(StorageKeys.LOCATOR_SELECTED_RESULT, null);
  }

  /**
   * The callback when a result pin on the map is clicked or tabbed onto
   * @param {Number} index The index of the pin in the current result list order
   * @param {string} cardId The unique id for the pin entity, usually of the form `js-yl-${uid}`
   */
  pinFocusListener (index, cardId) {
    this.core.storage.set(StorageKeys.LOCATOR_SELECTED_RESULT, cardId);
    document.querySelectorAll('.yxt-Card--pinFocused').forEach((el) => {
      el.classList.remove('yxt-Card--pinFocused');
    });

    if (this.isMobile()) {
      document.querySelectorAll('.yxt-Card--isVisibleOnMobileMap').forEach((el) => removeElement(el));
      const isDetailCardOpened = document.querySelectorAll('.yxt-Card--isVisibleOnMobileMap').length;

      const entityId = cardId.replace('js-yl-', '');
      const verticalResults = this.core.storage.get(StorageKeys.VERTICAL_RESULTS).results;
      const entityData = verticalResults.find(entity => entity._raw.uid.toString() === entityId);
      const opts = {
        parentContainer: this._container, 
        container: `.yxt-Card-${entityId}`,
        data: {
          result: entityData,
          verticalKey: this.verticalKey
        }
      };
      ANSWERS.addComponent(this.cardType, opts);
      this._detailCard = this._container.querySelector(`.yxt-Card-${entityId}`);
      this._detailCard.classList.add('yxt-Card--isVisibleOnMobileMap');
      this._detailCard.classList.add('yxt-Card--pinFocused');

      if (!isDetailCardOpened) {
        window.requestAnimationFrame(() => {
          this._detailCard.setAttribute('style', 'height: 0;');
          window.requestAnimationFrame(() => {
            this._detailCard.removeAttribute('style');
          });
        });
      }

      const buttonSelector = '.js-HitchhikerLocationCard-closeCardButton';

      this._detailCard.querySelectorAll(buttonSelector).forEach((el) => {
        el.addEventListener('click', () => {
          this.deselectAllResults();
        });
      });

      this.addCssClassesForState(MobileStates.DETAIL_SHOWN);
    } else {
      const selector = `.yxt-Card[data-opts='{ "_index": ${index - 1} }']`;
      const card = document.querySelector(selector);
      card.classList.add('yxt-Card--pinFocused');
      this.scrollToResult(card);
    }
  }

  /**
   * Determines whether or not the view toggles on mobile should be shown or not
   * If it is shown, add click listener
   * @param {Object} data The data (formatted in the Consulting LiveAPI format) of results
   * @param {Map} map The map object
   * @param {Object} pins Mapping from pin id to the pin object on the map
   */
  setupMobileViewToggles (data, map, pins) {
    const mobileToggles = this._container.querySelector('.js-locator-mobiletoggles');
    const listToggle = mobileToggles.querySelector('.js-locator-listToggle');

    let showToggles = false;

    if (data.response && data.response.entities && data.response.entities.length) {
      showToggles = true;
    }
    this.removeCssClassesForState(MobileStates.DETAIL_SHOWN);

    if (showToggles) {
      this._container.classList.add('VerticalFullPageMap--showMobileViewToggles');
      if (!listToggle.dataset.listened) {
        listToggle.dataset.listened = 'true';
        listToggle.addEventListener('click', () => {
          this.deselectAllResults();
          window.scrollTo(0, 0);
          if (this._mobileView === MobileStates.LIST_VIEW) {
            this.core.storage.set('DISABLE_RENDER_RESULTS', true);
            this.setMobileMapView();
          } else {
            this.core.storage.set('DISABLE_RENDER_RESULTS', false);
            this.setMobileListView();
          }
        });
      }
    } else {
      this._container.classList.remove('VerticalFullPageMap--showMobileViewToggles');
    }
  }

  /**
   * Register listeners so that any active pins are deselected when a user clicks
   * or focuses on the searchbar.
   */
  setupSearchBarListeners () {
    const searchBarForm = this._container.querySelector('.yxt-SearchBar-form');
    searchBarForm && searchBarForm.addEventListener('click', () => {
      this.deselectAllResults()
    });
    const searchBarInput = this._container.querySelector('.yxt-SearchBar-input');
    searchBarInput && searchBarInput.addEventListener('focus', () => {
      this.deselectAllResults();
    });
    const searchBarButton = this._container.querySelector('.yxt-SearchBar-button');
    searchBarButton && searchBarButton.addEventListener('focus', () => {
      this.deselectAllResults();
    })
  }

  /**
   * Conducts a new search on the locator for the given viewable bounds for the map.
   * Note that the visible area is the viewport of the map, taking into account the map padding.
   * Also note that the radius is from the center of the visible area to the corner of 
   * the visible area.
   */
  searchThisArea() {
    const numConcurrentSearchThisAreaCalls =
      this.core.storage.get(StorageKeys.LOCATOR_NUM_CONCURRENT_SEARCH_THIS_AREA_CALLS);
    const updatedNumSearchThisAreaCalls = numConcurrentSearchThisAreaCalls + 1 || 1;
    this.core.storage.set(
      StorageKeys.LOCATOR_NUM_CONCURRENT_SEARCH_THIS_AREA_CALLS,
      updatedNumSearchThisAreaCalls
    );

    this.deselectAllResults();

    this._container.classList.remove('VerticalFullPageMap--showSearchThisArea');

    const mapProperties = this.core.storage.get(StorageKeys.LOCATOR_MAP_PROPERTIES);
    const center = mapProperties.visibleCenter;
    const radius = mapProperties.visibleRadius;
    const lat = center.latitude;
    const lng = center.longitude;

    const filterNode = ANSWERS.FilterNodeFactory.from({
      filter: {
        'builtin.location': {
          '$near': { lat, lng, radius }
        }
      },
      remove: () => this.core.clearStaticFilterNode('SearchThisArea')
    });
    this.core.setStaticFilterNodes('SearchThisArea', filterNode);
    this.core.verticalSearch(this.verticalKey, {
      setQueryParams: true,
      resetPagination: true,
      useFacets: true
    });
    this.updateMostRecentSearchState();
    this.core.clearStaticFilterNode('SearchThisArea');
  }

  /**
   * Scroll the result list to show the given element
   * @param {HTMLElement} targetEl The result card to scroll to
   */
  scrollToResult(targetEl) {
    const scrollContainer = this._resultsWrapperEl;
    const scrollDistance  = targetEl.offsetTop - scrollContainer.scrollTop;

    if (!isViewableWithinContainer(targetEl, scrollContainer)) {
      smoothScroll(scrollContainer, scrollDistance, 400);
    }
  }

  setState(data) {
    if (data.searchState === 'search-loading') {
      return;
    }

    this._data = data;

    if (data.resultsContext === 'no-results') {
      this._isNoResults = true;
      this._container.classList.add('VerticalFullPageMap--noResults');
    } else {
      this._isNoResults = false;
      this._container.classList.remove('VerticalFullPageMap--noResults');
    }

    this.onMount();
  }

  onMount () {
    this._children.forEach(child => {
      child.unMount();
    });
    this._children.forEach(c => c.remove());
    this._children = [];

    if (this._isNoResults) {
      const altVerticalsData = this.core.storage.get(StorageKeys.ALTERNATIVE_VERTICALS);
      this.addChild(
        altVerticalsData,
        'AlternativeVerticals', 
        Object.assign({},
          {
            container: '.js-answersNoResults',
            verticalsConfig: this.verticalsConfig,
            baseUniversalUrl: this.getBaseUniversalUrl(),
            isShowingResults: this.displayAllResultsOnNoResults && this._data.results,
            name: 'AlternativeVerticals--resultsHeader'
          },
          this.alternativeVerticalsConfig
        )
      );
    }

    this._children.forEach(child => {
      child.mount();
    });
  }

  /**
   * Get the base universal url
   * @return {string} The universal url
   */
  getBaseUniversalUrl () {
    const universalConfig = this.verticalsConfig.find(config => !config.verticalKey) || {};
    return universalConfig.url;
  }

  static defaultTemplateName() {
    return 'theme-components/vertical-full-page-map';
  }

  static areDuplicateNamesAllowed() {
    return false;
  }

  static get type() {
    return 'VerticalFullPageMapOrchestrator';
  }
}

export { VerticalFullPageMapOrchestrator };
