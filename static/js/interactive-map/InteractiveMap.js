import { Coordinate } from './Geo/Coordinate.js';
import { smoothScroll } from './Util/SmoothScroll.js';
import { getLanguageForProvider } from './Util/helpers.js';

import { PinImages } from './PinImages.js';
import { ClusterPinImages } from './ClusterPinImages.js';

const STORAGE_KEY_HOVERED_RESULT = 'HOVERED_RESULT_KEY';
const STORAGE_KEY_SELECTED_RESULT = 'SELECTEDED_RESULT_KEY';
const STORAGE_KEY_FROM_SEARCH_THIS_AREA = 'FROM_SEARCH_THIS_AREA';
const STORAGE_KEY_MAP_PROPERTIES = 'MAP_PROPERTIES';

/**
 * The component to control the interactions for an interative map.
 * Interactions like clicking on a pin or dragging the map and
 * searching an area is controlled here
 */
class InteractiveMap extends ANSWERS.Component {
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
     * The header DOM element
     * @type {HTMLElement}
     */
    this._headerEl = this._pageWrapperEl.querySelector('.js-answersHeader');

    /**
     * The results wrapper DOM element
     * @type {HTMLElement}
     */
    this._resultsWrapperEl = this._container.querySelector('.js-locator-resultsWrapper');

    /**
     * The vertical configuration
     * @type {Object}
     */
    this.verticalsConfig = config.verticalPages || [];

    /**
     * The provider for the map, normalized to lowercase
     * @type {string}
     */
    this.mapProvider = config.mapProvider.toLowerCase();

    /**
     * Map options to be passed directly to the Map Provider
     * @type {Object}
     */
    this.providerOptions = config.providerOptions || {};

    /**
     * The API key for the map provider (if applicable)
     * @type {string}
     */
    this.apiKey = config.apiKey;

    /**
     * The client id for the map provider (if applicable)
     * @type {string}
     */
    this.clientId = undefined;

    /**
     * The language locale for the map
     * @type {string}
     */
    this.language = getLanguageForProvider(config.locale, this.mapProvider);

    /**
     * The default zoom level for the map
     * @type {number}
     */
    this.defaultZoom = this.providerOptions.zoom || 14;

    /**
     * The default center coordinate for the map, an object with {lat, lng}
     * @type {Coordinate}
     */
    this.defaultCenter = this.providerOptions.center || new Coordinate(37.0902, -95.7129);

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
     * The pin options for the map, with information for each pin state (e.g. default, hovered)
     * @type {Object}
     */
    this.pinOptions = config.pin || {};

    /**
     * The pin images for the default Map Pin
     * @type {PinImages}
     */
    this.pinImages = new PinImages(
      this.pinOptions.default,
      this.pinOptions.hovered,
      this.pinOptions.selected,
    );

    /**
     * A custom pin selection callback for the interactive map
     * @type {Function}
     */
    this.onPinSelect = config.onPinSelect;

    /**
     * Whether the map should cluster pins that are close to each other
     * @type {boolean}
     */
    this.enablePinClustering = config.enablePinClustering;

    /**
     * The cluster pin options for the map, with information for each pin state
     * @type {Object}
     */
    this.pinClusterOptions = config.pinCluster || config.pin;

    /**
     * The pin images for the default Map Pin
     * @type {ClusterPinImages}
     */
    this.pinClusterImages = new ClusterPinImages(
      this.pinClusterOptions.default || this.pinOptions.default,
      this.pinClusterOptions.hovered || this.pinOptions.hovered,
      this.pinClusterOptions.selected || this.pinOptions.selected,
    );

    /**
     * The mobile breakpoint (inclusive max) in px
     * @type {Number}
     */
    this.mobileBreakpointMax = 991;

    /**
     * The padding for the map within the viewable area
     * @type {Object}
     */
    this.mapPadding = {
      top: () => window.innerWidth <= this.mobileBreakpointMax ? 150 : 50,
      bottom: () => 50,
      right: () => 50,
      left: () => this.getLeftVisibleBoundaryPadding(),
    };
  }

  /**
   * Get the padding for the left hand side of the map (results bar), in order
   * to keep pins in only the visible part of the map.
   * @return {Number} The padding (in pixels) for the visible area of the map
   */
  getLeftVisibleBoundaryPadding () {
    if (window.innerWidth <= this.mobileBreakpointMax) {
      return 50;
    }

    const resultsListEl = this._container.querySelector('.js-locator-contentWrap');
    const resultsListElWidth = resultsListEl ? resultsListEl.offsetWidth : 0;
    return 50 + resultsListElWidth;
  };

  onCreate () {
    this.core.globalStorage.on('update', 'vertical-results', (data) => {
      this.setState(data);
    });

    const searchThisAreaToggleEls = this._container.querySelectorAll('.js-searchThisAreaToggle');
    searchThisAreaToggleEls.forEach((el) => {
      el.addEventListener('click', (e) => {
        this.searchOnMapMove = e.target.checked;
      });
    });

    const searchThisAreaEl = this._container.querySelector('.js-searchThisArea');
    searchThisAreaEl.addEventListener('click', (e) => {
      this.searchThisArea();
    });

    this.addMapComponent();
  }

  addMapComponent () {
    /**
     * Create mobile toggle button when map is rendered
     *
     * @param {Object} data The data (formatted in the Consulting LiveAPI format) of results
     * @param {Map} map The map object
     * @param {Object} pins Mapping from pin id to the pin object on the map
     */
    const onPostMapRender = (data, map, pins) => {
      this.setupMobileToggles(data, map, pins);
    };

    /**
     * Clicking a pin cluster searches the new area, if desired
     */
    const pinClusterClickListener = () => {
      if (this.searchOnMapMove) {
        this.searchThisArea();
      }
    };

    /**
     * Dragging the map searches the new area, if desired
     *
     * @param {Map} map The map object
     */
    const dragEndListener = (map) => {
      if (this.searchOnMapMove) {
        this.searchThisArea();
      } else {
        this._container.classList.add('InteractiveMap--showSearchThisArea');
      }
    };

    /**
     * Dragging the map searches the new area, if desired
     *
     * @param {Map} map The map object
     */
    const zoomChangeListener = (map) => {
      if (map._zoomTrigger === 'api') {
        return;
      }

      map.idle().then(() => {
        if (this.searchOnMapMove) {
          this.searchThisArea();
        } else {
          this._container.classList.add('InteractiveMap--showSearchThisArea');
        }
      });
    };

    ANSWERS.addComponent('NewMap', Object.assign({}, {
      container: this._mapContainerSelector,
      mapProvider: this.mapProvider,
      apiKey: this.apiKey,
      clientId: this.clientId,
      language: this.language,
      defaultCenter: this.defaultCenter,
      defaultZoom: this.defaultZoom,
      providerOptions: this.providerOptions,
      mapPadding: this.mapPadding,
      pinImages: this.pinImages,
      pinClusterImages: this.pinCluterImages,
      enablePinClustering: this.enablePinClustering,
      onPinSelect: this.onPinSelect,
      onPostMapRender: onPostMapRender,
      pinClickListener: (index, id) => this.pinClickListener(index, id),
      pinClusterClickListener: pinClusterClickListener,
      dragEndListener: dragEndListener,
      zoomChangeListener: zoomChangeListener,
      displayAllResultsOnNoResults: this.displayAllResultsOnNoResults
    }));
  }

  /**
   * The callback when a result pin on the map is clicked
   * @param {Number} index The index of the pin in the current result list order
   * @param {string} cardId The HTML element id of the card that a
   */
  pinClickListener (index, cardId) {
    this.core.globalStorage.set(STORAGE_KEY_SELECTED_RESULT, cardId);
    const selector = `.yxt-Card[data-opts='{ "_index": ${index - 1} }']`;
    const card = document.querySelector(selector);
    const mediaQuery = window.matchMedia(`(max-width: ${this.mobileBreakpointMax}px)`);

    document.querySelectorAll('.yxt-Card--pinClicked').forEach((el) => {
      el.classList.remove('yxt-Card--pinClicked');
    });

    card.classList.add('yxt-Card--pinClicked');

    if (mediaQuery.matches) {
      document.querySelectorAll('.yxt-Card--copy').forEach((el) => el.remove());
      const isDetailCardOpened = document.querySelectorAll('.yxt-Card--copy').length;

      const cardCopy = card.cloneNode(true);
      cardCopy.classList.add('yxt-Card--copy');
      this._container.appendChild(cardCopy);

      if (!isDetailCardOpened) {
        window.requestAnimationFrame(function(){
          cardCopy.style = 'height: 0;';
          window.requestAnimationFrame(function(){
            cardCopy.style = '';
          });
        });
      }

      cardCopy.querySelectorAll('.js-HitchhikerLocationStandard-exit').forEach((el) => {
        el.addEventListener('click', () => {
          card.classList.remove('yxt-Card--pinClicked');
          cardCopy.remove();
          this._container.classList.remove('InteractiveMap--detailShown');
          this._pageWrapperEl.classList.remove('YxtPage-wrapper--detailShown');
        });
      });

      this._container.classList.add('InteractiveMap--detailShown');
      this._pageWrapperEl.classList.add('YxtPage-wrapper--detailShown');
    } else {
      this.scrollToResult(card);
    }
  }

  /**
   * The callback for after any time the map renders
   * @param {Object} data The data (formatted in the Consulting LiveAPI format) of results
   * @param {Map} map The map object
   * @param {Object} pins Mapping from pin id to the pin object on the map
   */
  setupMobileToggles (data, map, pins) {
    const mobileToggles = this._container.querySelector('.js-locator-mobiletoggles');
    const listToggle = mobileToggles.querySelector('.js-locator-listToggle');

    let showToggles = false;

    if (data.response && data.response.entities && data.response.entities.length) {
      showToggles = true;
    }
    this._container.classList.remove('InteractiveMap--detailShown');

    if (showToggles) {
      this._container.classList.add('InteractiveMap--showMobileViewToggles');
      if (!listToggle.dataset.listened) {
        listToggle.dataset.listened = 'true';
        listToggle.addEventListener('click', () => {
          this._container.classList.toggle('InteractiveMap--listShown');
          this._container.classList.toggle('InteractiveMap--mapShown');
          this._container.classList.remove('InteractiveMap--detailShown');
        });
      }
    } else {
      this._container.classList.remove('InteractiveMap--showMobileViewToggles');
    }
  }

  /**
   * Conducts a new search on the locator for the given viewable bounds for the map.
   * Note that the visible area is the viewport of the map, taking into account the map padding.
   * Also note that the radius is from the center of the visible area to the corner of 
   * the visible area.
   */
  searchThisArea() {
    this._container.classList.remove('InteractiveMap--showSearchThisArea');

    const mapProperties = this.core.globalStorage.getState(STORAGE_KEY_MAP_PROPERTIES);
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
    this.core.globalStorage.set(STORAGE_KEY_FROM_SEARCH_THIS_AREA, true);
    this.core.verticalSearch('locations', {
      setQueryParams: true,
      resetPagination: true,
      useFacets: true
    });
  }

  /**
   * Scroll the result list to show the given element
   * @param {HTMLElement} targetEl The result card to scroll to
   */
  scrollToResult(targetEl) {
    const stickyHeight = 0;

    const header = this._headerEl;
    const headerHeight = header ? header.offsetHeight : 0;

    const container = this._resultsWrapperEl;
    const elTop = targetEl.offsetTop - (container.scrollTop + container.offsetTop);
    const elBottom = elTop + targetEl.offsetHeight;
    const isScrolledIntoView = elTop >= stickyHeight && elBottom <= container.offsetHeight - headerHeight;

    window.scroll = (x) => smoothScroll(container, x, 400);
    if (!isScrolledIntoView) {
      smoothScroll(container, elTop - stickyHeight, 400);
    }
  }

  setState(data) {
    if (data.searchState === 'search-loading') {
      return;
    }

    this._data = data;

    if (data.resultsContext === 'no-results') {
      this._isNoResults = true;
      this._container.classList.add('InteractiveMap--noResults');
    } else {
      this._isNoResults = false;
      this._container.classList.remove('InteractiveMap--noResults');
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
      const altVerticalsData = this.core.globalStorage.getState('alternative-verticals');
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
    return 'theme-components/interactive-map';
  }

  static areDuplicateNamesAllowed() {
    return false;
  }

  static get type() {
    return 'InteractiveMap';
  }
}

export { InteractiveMap };
