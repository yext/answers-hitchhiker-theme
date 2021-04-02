import { Coordinate } from './Geo/Coordinate.js';
import { smoothScroll } from './Util/SmoothScroll.js';
import { getLanguageForProvider, isViewableWithinContainer } from './Util/helpers.js';
import { SearchDebouncer } from './SearchDebouncer';
import { defaultCenterCoordinate } from './constants.js';

import ZoomTriggers from './Maps/ZoomTriggers.js';
import PanTriggers from './Maps/PanTriggers.js';

import StorageKeys from '../storage-keys.js';

/**
 * The component to control the interactions for an interative map.
 * Interactions like clicking on a pin or dragging the map and
 * searching an area is controlled here
 */
class VerticalFullPageMapOrchestrator extends ANSWERS.Component {
  constructor(config, systemConfig) {
    super(config, systemConfig);

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
    this.defaultZoom = this.providerOptions.zoom || 14;

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

    const noResultsConfig = config.noResults || {};

    /**
     * Whether the map should display all results on no results
     * @type {boolean}
     */
    this.displayAllResultsOnNoResults = noResultsConfig.displayAllResults;

    /**
     * The mobile breakpoint (inclusive max) in px
     * @type {Number}
     */
    this.mobileBreakpointMax = 991;

    /**
     * Determines whether or not another search should be ran
     * @type {SearchDebouncer}
     */
    this.searchDebouncer = new SearchDebouncer();

    /**
     * The detail card which apears on mobile after clicking a pin
     * @type {Element}
     */
    this._detailCard = null;
  }

  onCreate () {
    this.core.storage.registerListener({
      eventType: 'update',
      storageKey: StorageKeys.VERTICAL_RESULTS,
      callback: (data) => this.setState(data)
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
      });
    });

    const searchThisAreaButtonEl = this._container.querySelector('.js-searchThisAreaButton');
    searchThisAreaButtonEl.addEventListener('click', (e) => {
      this.searchThisArea();
    });

    this.addMapComponent();
  }

  addMapComponent () {
    /**
     * Create mobile view toggle buttons when a map is rendered
     *
     * @param {Object} data The data (formatted in the Consulting LiveAPI format) of results
     * @param {Map} map The map object
     * @param {Object} pins Mapping from pin id to the pin object on the map
     */
    const onPostMapRender = (data, map, pins) => {
      this.setupMobileViewToggles(data, map, pins);
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
      canvasClickListener: () => this.removeResultFocusedStates()
    }));
  }

  /**
   * Search the area or show the search the area button according to configurable logic
   */
  handleMapCenterChange () {
    if (!this.searchOnMapMove) {
      this._container.classList.add('VerticalFullPageMap--showSearchThisArea');
      return;
    }

    if (!this.shouldSearchBeDebouncedBasedOnCenter()) {
      this.searchThisArea();
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

    if (!this.shouldSearchBeDebouncedBasedOnZoom()) {
      this.searchThisArea();
    }
  }

  /**
   * Returns true if a search should be debounced based on the center of the current map
   * and the center of the map during the most recent search
   * 
   * @returns {boolean}
   */
  shouldSearchBeDebouncedBasedOnCenter () {
    return this.searchDebouncer.isWithinDistanceThreshold({
      mostRecentSearchMapCenter: this.mostRecentSearchLocation,
      currentMapCenter: this.getCurrentMapCenter(),
      currentZoom: this.currentZoom
    });
  }

  /**
   * Returns true if a search should be debounced based on the previous search zoom level and
   * the current zoom level
   * 
   * @returns {boolean}
   */
  shouldSearchBeDebouncedBasedOnZoom () {
    return this.searchDebouncer.isWithinZoomThreshold({
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
   * Remove the result focused state styling from all cards and pins on the page
   */
  removeResultFocusedStates () {
    this._container.classList.remove('VerticalFullPageMap--detailShown');
    this._pageWrapperEl.classList.remove('YxtPage-wrapper--detailShown');

    document.querySelectorAll('.yxt-Card--pinFocused').forEach((el) => {
      el.classList.remove('yxt-Card--pinFocused');
    });

    this._detailCard && this._detailCard.remove();

    this.core.storage.set(StorageKeys.LOCATOR_SELECTED_RESULT, null);
  }

  /**
   * The callback when a result pin on the map is clicked or tabbed onto
   * @param {Number} index The index of the pin in the current result list order
   * @param {string} cardId The unique id for the pin entity, usually of the form `js-yl-${meta.id}`
   */
  pinFocusListener (index, cardId) {
    this.core.storage.set(StorageKeys.LOCATOR_SELECTED_RESULT, cardId);
    const selector = `.yxt-Card[data-opts='{ "_index": ${index - 1} }']`;
    const card = document.querySelector(selector);
    const mediaQuery = window.matchMedia(`(max-width: ${this.mobileBreakpointMax}px)`);
    const isMobile = mediaQuery.matches;

    document.querySelectorAll('.yxt-Card--pinFocused').forEach((el) => {
      el.classList.remove('yxt-Card--pinFocused');
    });

    card.classList.add('yxt-Card--pinFocused');

    if (isMobile) {
      document.querySelectorAll('.yxt-Card--isVisibleOnMobileMap').forEach((el) => el.remove());
      const isDetailCardOpened = document.querySelectorAll('.yxt-Card--isVisibleOnMobileMap').length;

      this._detailCard = card.cloneNode(true);
      this._detailCard.classList.add('yxt-Card--isVisibleOnMobileMap');
      this._container.appendChild(this._detailCard);

      if (!isDetailCardOpened) {
        window.requestAnimationFrame(function(){
          this._detailCard.style = 'height: 0;';
          window.requestAnimationFrame(function(){
            this._detailCard.style = '';
          });
        });
      }

      const buttonSelector = '.js-HitchhikerLocationCard-closeCardButton';

      this._detailCard.querySelectorAll(buttonSelector).forEach((el) => {
        el.addEventListener('click', () => {
          this.removeResultFocusedStates();
        });
      });

      this._container.classList.add('VerticalFullPageMap--detailShown');
      this._pageWrapperEl.classList.add('YxtPage-wrapper--detailShown');
    } else {
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
    this._container.classList.remove('VerticalFullPageMap--detailShown');

    if (showToggles) {
      this._container.classList.add('VerticalFullPageMap--showMobileViewToggles');
      if (!listToggle.dataset.listened) {
        listToggle.dataset.listened = 'true';
        listToggle.addEventListener('click', () => {
          window.scrollTo(0, 0);
          this._container.classList.toggle('VerticalFullPageMap--listShown');
          this._container.classList.toggle('VerticalFullPageMap--mapShown');
          this._pageWrapperEl.classList.toggle('YxtPage-wrapper--mapShown');
          this._container.classList.remove('VerticalFullPageMap--detailShown');
        });
      }
    } else {
      this._container.classList.remove('VerticalFullPageMap--showMobileViewToggles');
    }
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
        {
          container: '.js-answersNoResults',
          verticalsConfig: this.verticalsConfig,
          baseUniversalUrl: this.getBaseUniversalUrl(),
          isShowingResults: this.displayAllResultsOnNoResults && this._data.results,
          name: 'AlternativeVerticals--resultsHeader',
        }
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
