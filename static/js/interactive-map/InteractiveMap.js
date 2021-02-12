import { MapOptions } from './Maps/Map.js';
import { MapRenderTargetOptions } from './Renderer/MapRenderTarget.js';
import { RendererOptions } from './Renderer/Renderer.js';
import { Coordinate } from './Geo/Coordinate.js';
import { PinProperties } from './Maps/PinProperties.js';
import { PinClustererOptions } from './PinClusterer/PinClusterer.js';
import { smoothScroll } from './Util/SmoothScroll.js';

import { GoogleMaps } from './Maps/Providers/Google.js';
import { MapboxMaps } from './Maps/Providers/Mapbox.js';

import { PinImages } from './PinImages.js';
import { ClusterPinImages } from './ClusterPinImages.js';

const STORAGE_KEY_HOVERED_RESULT = 'HOVERED_RESULT_KEY';
const STORAGE_KEY_SELECTED_RESULT = 'SELECTEDED_RESULT_KEY';
const STORAGE_KEY_FROM_SEARCH_THIS_AREA = 'FROM_SEARCH_THIS_AREA';

/**
 * The component to control the interactions for an interative map.
 * Interactions like clicking on a pin or dragging the map and
 * searching an area is controlled here
 */
class InteractiveMap extends ANSWERS.Component {
  static defaultTemplateName() {
    return 'theme-components/interactive-map';
  }

  static areDuplicateNamesAllowed() {
    return false;
  }

  static get type() {
    return 'InteractiveMap';
  }

  constructor(config, systemConfig) {
    super(config, systemConfig);

    /**
     * The container in the DOM for the interactive map
     * @type {HTMLElement}
     */
    this._mapContainerEl = document.getElementById('js-answersMap');

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
    this.language = this.getLanguageForProvider(config.locale, this.mapProvider);

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
     * @type {PinImages}
     */
    this.pinClusterImages = new ClusterPinImages(
      this.pinClusterOptions.default || this.pinOptions.default,
      this.pinClusterOptions.hovered || this.pinOptions.hovered,
      this.pinClusterOptions.selected || this.pinOptions.selected,
    );

    /**
     * The padding for the map within the viewable area
     * @type {Object}
     */
    this.mapPadding = {
      top: () => window.innerWidth <= 991 ? 150 : 50,
      bottom: () => 50,
      right: () => 50,
      left: () => this.getLeftPadding(),
    };

    /**
     * The map object
     * @type {Map}
     */
    this.map = null;

    /**
     * The map renderer
     * @type {Renderer}
     */
    this.renderer = new RendererOptions().build();

    /**
     * Whether the map is render ready
     * @type {boolean}
     */
    this.renderReady = false;

    /**
     * The initial data for the map, just in case it isn't renderable yet
     * @type {Object}
     */
    this.initialData = null;

    /**
     * HTML element id for the hovered pin
     * @type {string}
     */
    this.hoveredPinId = null;

    /**
     * HTML element id for the selected pin
     * @type {string}
     */
    this.selectedPinId = null;
  }

  /**
   * Get the padding for the left hand side of the map (results bar), in order
   * to keep pins in only the visible part of the map.
   * @return {Number} The padding (in pixels) for the visible area of the map
   */
  getLeftPadding () {
    if (window.innerWidth <= 991) {
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

    this.loadAndInitializeMap().then((map) => {
      this.map = map;
      this.addMapInteractions(map);
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
  }

  /**
   * Load the map provider scripts and initialize the map with the configuration options
   * @return {Map} The map object
   */
  async loadAndInitializeMap () {
    const mapProviderImpl = (this.mapProvider === 'google') ? GoogleMaps : MapboxMaps;
    await mapProviderImpl.load(this.apiKey, {
      client: this.clientId,
      language: this.language,
    });
    const map = new MapOptions()
      .withDefaultCenter(this.defaultCenter)
      .withDefaultZoom(this.defaultZoom)
      .withWrapper(this._mapContainerEl)
      .withProvider(mapProviderImpl)
      .withProviderOptions(this.providerOptions || {})
      .withPadding(this.mapPadding)
      .build();
    return map;
  }

  /**
   * Add map interactions like event listeners and rendering targets
   * @param {Map} The map object
   */
  addMapInteractions(map) {
    // TODO google specific
    window.google.maps.event.addListener(map._map.map, 'dragend', () => {
      if (this.searchOnMapMove) {
        this.searchThisArea();
      } else {
        this._container.classList.add('InteractiveMap--showSearchThisArea');
      }
    });

    window.google.maps.event.addListener(map._map.map, 'zoom_changed', () => {
      if (this.map._zoomTrigger === 'api') {
        return;
      }

      this.map.idle().then(() => {
        if (this.searchOnMapMove) {
          this.searchThisArea();
        } else {
          this._container.classList.add('InteractiveMap--showSearchThisArea');
        }
      });
    });

    const iconsForEntity = (entity, index) => ({
      default: this.pinImages.getDefaultPin(index, entity.profile),
      hovered: this.pinImages.getHoveredPin(index, entity.profile),
      selected: this.pinImages.getSelectedPin(index, entity.profile),
    });
    const pinBuilder = (pinOptions, entity, index) => {
      Object.entries(iconsForEntity(entity, index))
        .forEach(([name, icon]) => pinOptions.withIcon(name, icon));
      pinOptions.withHideOffscreen(false);
      return this.buildPin(pinOptions, entity, index);
    };

    const mapRenderTargetOptions = new MapRenderTargetOptions()
      .withMap(map)
      .withOnPostRender((data, map) => this.mapRenderCallback(data, map, mapRenderTarget.getPins()))
      .withPinBuilder(pinBuilder)

    if (this.enablePinClustering) {
      mapRenderTargetOptions.withPinClusterer(this.getClusterer());
    }

    const mapRenderTarget = mapRenderTargetOptions.build();

    this.renderer.register(mapRenderTarget);
    this.renderReady = true;
    if (this.initialData) {
      this.renderer.render(this.initialData);
    }

    this.core.globalStorage.on('update', STORAGE_KEY_HOVERED_RESULT, id => {
      if (id != this.hoveredPinId) {
        const pins = mapRenderTarget.getPins();

        if (this.hoveredPinId && pins[this.hoveredPinId]) {
          pins[this.hoveredPinId].setStatus({ hovered: false });
          this.hoveredPinId = null;
        }

        if (id && pins[id]) {
          pins[id].setStatus({ hovered: true });
          this.hoveredPinId = id;
        }
      }
    });
    this.core.globalStorage.on('update', STORAGE_KEY_SELECTED_RESULT, id => {
      if (id != this.selectedPinId) {
        const pins = mapRenderTarget.getPins();

        if (this.selectedPinId && pins[this.selectedPinId]) {
          pins[this.selectedPinId].setStatus({ selected: false });
          this.selectedPinId = null;
        }

        if (id && pins[id]) {
          pins[id].setStatus({ selected: true });
          this.selectedPinId = id;

          if (this.onPinSelect) {
            this.onPinSelect();
          }

          if (!this.map.coordinateIsInVisibleBounds(pins[id].getCoordinate())) {
            this.map.setCenterWithPadding(pins[id].getCoordinate(), true);
          }
        }
      }
    });
  }

  /**
   * The callback for after any time the map renders
   * @param {Object} data The data (formatted in the Consulting LiveAPI format) of results
   * @param {Map} map The map object
   * @param {Object} pins Mapping from pin id to the pin object on the map
   */
  mapRenderCallback (data, map, pins) {
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
   * Get the Map pin clusterer object
   */
  getClusterer () {
    const clustererOptions = new PinClustererOptions()
      .withClickListener(() => {
        if (this.searchOnMapMove) {
          this.searchThisArea();
        }
      })
      .withIconTemplate('default', (pinDetails) => {
        return this.pinClusterImages.getDefaultPin(pinDetails.pinCount);
      })
      .withIconTemplate('hovered', (pinDetails) => {
        return this.pinClusterImages.getHoveredPin(pinDetails.pinCount);
      })
      .withIconTemplate('selected', (pinDetails) => {
        return this.pinClusterImages.getSelectedPin(pinDetails.pinCount);
      })
      .withPropertiesForStatus(status => {
        const properties = new PinProperties()
          .setIcon(status.hovered || status.focused ? 'hovered' : 'default')
          .setWidth(28)
          .setHeight(28);

        return properties;
      })
      .withMinClusterSize(2)
      .withClusterRadius(50)
      .withClusterZoomAnimated(true)
      .withClusterZoomMax(20);
    return clustererOptions.build();
  }

  /**
   * Gets the language locale according to specific fallback logic
   * 1. The user-specified locale to the component
   * 2. If invalid, try using only the first two characters
   * 3. If still invalid, providers fallback to en
   *
   * @param {string} localeStr The user-defined locale string
   * @param {string[]} supportedLocales The locales supported by the current map provider
   * @return {string} The language locale for the map
   */
  getLanguageForProvider(localeStr, supportedLocales) {
    if (localeStr.length == 2) {
      return localeStr;
    } 

    if (localeStr.length > 2) {
      if (supportedLocalesForProvider.includes(localeStr)) {
        return localeStr;
      } 
      return localeStr.substring(0, 2);
    }

    return 'en';
  }

  /**
   * Conducts a new search on the locator for the given viewable bounds for the map.
   * Note that the visible area is the viewport of the map, taking into account the map padding.
   * Also note that the radius is from the center of the visible area to the corner of 
   * the visible area.
   */
  searchThisArea() {
    this._container.classList.remove('InteractiveMap--showSearchThisArea');

    const center = this.map.getVisibleCenter();
    const lat = center.latitude;
    const lng = center.longitude;
    const radius = this.map.getVisibleRadius();

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
   * Builds a pin given pin options.
   * @param {PinOptions} pinOptions The pin options builder
   * @param {Object} entity The entity data to use in pin building
   * @param {Number} index The index of the entity in the result list ordering
   */
  buildPin(pinOptions, entity, index) {
    const pin = pinOptions
      .withCoordinate(new Coordinate(entity.profile.yextDisplayCoordinate))
      .withPropertiesForStatus(status => {
        const properties = new PinProperties()
          .setIcon(status.selected ? 'selected' : ((status.hovered || status.focused) ? 'hovered' : 'default'))
          .setSRText(index)
          .setZIndex(status.selected ? 1 : ((status.hovered || status.focused) ? 2 : 0));

        properties.setWidth(24);
        properties.setHeight(28);

        if (status.selected) {
          properties.setWidth(24);
          properties.setHeight(34);
        }

        return properties;
      })
      .build();

    const id = 'js-yl-' + entity.profile.meta.id;
    this.core.globalStorage.on('update', 'card-click', (data) => {
      const cardIndex = data.index;
      if (cardIndex + 1 === index) {
        this.core.globalStorage.set(STORAGE_KEY_SELECTED_RESULT, id);
      }
    });

    pin.setClickHandler(() => this.pinClickHandler(index, id));
    pin.setHoverHandler(hovered => this.core.globalStorage.set(STORAGE_KEY_HOVERED_RESULT, hovered ? id : null));
    return pin;
  }

  /**
   * The callback when a result pin on the map is clicked
   * @param {Number} index The index of the pin in the current result list order
   * @param {string} cardId The HTML element id of the card that a
   */
  pinClickHandler (index, cardId) {
    this.core.globalStorage.set(STORAGE_KEY_SELECTED_RESULT, cardId);
    const selector = `.yxt-Card[data-opts='{ "_index": ${index - 1} }']`;
    const card = document.querySelector(selector);
    const mediaQuery = window.matchMedia("(max-width: 991px)");

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

  /**
   * Transforms the data from the answers API to the live api format the Locator code expects
   * @param {Object} data The results from the answers API
   * @return {Object} The results formatted for the Locator code
   */
  transformDataToUniversalData (data) {
    const universalData = (data.map ? (data.map.mapMarkers || []) : []).map(marker => ({
      profile: {
        ...marker.item,
        meta: {
          accountId: '',
          countryCode: marker.item.address.countryCode,
          entityType: marker.item.type,
          folderId: '',
          id: marker.item.id,
          labels: '',
          language: '',
          schemaTypes: '',
          timestamp: '',
          uid: '',
          utcOffsets: '',
          yextId: marker.item.id,
        }
      }
    }));
    return universalData;
  }

  /**
   * Transforms the data from the answers API to the live api format the Locator code expects
   * @param {Object} data The results from the answers API
   * @return {Object} The results formatted for the Locator code
   */
  transformDataToVerticalData (data) {
    const verticalData = (data.results || []).map(ent => ({
      profile: {
        ...ent._raw,
        meta: {
          accountId: '',
          countryCode: ent._raw.address.countryCode,
          entityType: ent._raw.type,
          folderId: '',
          id: ent.id,
          labels: '',
          language: '',
          schemaTypes: '',
          timestamp: '',
          uid: '',
          utcOffsets: '',
          yextId: ent.id,
        },
      }
    }));
    return verticalData;
  }

  onMount () {
    this._children.forEach(child => {
      child.unMount();
    });
    this._children.forEach(c => c.remove());
    this._children = [];

    this._updateMap();

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
   * Update the map with the new data by rendering
   */
  _updateMap () {
    const verticalData = this.transformDataToVerticalData(this._data);
    const universalData = this.transformDataToUniversalData(this._data);
    let entityData = verticalData.length ? verticalData : universalData;

    const fromSearchThisArea = this.core.globalStorage.getState(STORAGE_KEY_FROM_SEARCH_THIS_AREA);
    this.core.globalStorage.delete(STORAGE_KEY_FROM_SEARCH_THIS_AREA);
    let updateZoom = !fromSearchThisArea;

    if (this._isNoResults && !this.displayAllResultsOnNoResults) {
      entityData = [];
      updateZoom = false;
    }

    const renderData = {
      response: { entities: entityData },
      updateZoom: updateZoom
    };

    if (this.renderReady) {
      this.renderer.render(renderData);
    } else {
      this.initialData = renderData;
    }
  }

  /**
   * Get the base universal url
   * @return {string} The universal url
   */
  getBaseUniversalUrl () {
    const universalConfig = this.verticalsConfig.find(config => !config.verticalKey) || {};
    return universalConfig.url;
  }
}

window.InteractiveMap = InteractiveMap;
export { InteractiveMap };
