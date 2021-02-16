import { Coordinate } from './Geo/Coordinate.js';
import { MapOptions } from './Maps/Map.js';
import { MapRenderTargetOptions } from './Renderer/MapRenderTarget.js';
import { RendererOptions } from './Renderer/Renderer.js';
import { PinProperties } from './Maps/PinProperties.js';
import { PinClustererOptions } from './PinClusterer/PinClusterer.js';
import { transformDataToUniversalData, transformDataToVerticalData } from './Util/transformers.js';

import { GoogleMaps } from './Maps/Providers/Google.js';
import { MapboxMaps } from './Maps/Providers/Mapbox.js';

const STORAGE_KEY_HOVERED_RESULT = 'HOVERED_RESULT_KEY';
const STORAGE_KEY_SELECTED_RESULT = 'SELECTEDED_RESULT_KEY';
const STORAGE_KEY_FROM_SEARCH_THIS_AREA = 'FROM_SEARCH_THIS_AREA';
const STORAGE_KEY_MAP_PROPERTIES = 'MAP_PROPERTIES';

class NewMap extends ANSWERS.Component {
  constructor(config, systemConfig) {
    super(config, systemConfig);

    this.mapProvider = config.mapProvider;
    this.apiKey = config.apiKey;
    this.clientId = config.cliendId;
    this.language = config.language;
    this.defaultCenter = config.defaultCenter;
    this.defaultZoom = config.defaultZoom;
    this.providerOptions = config.providerOptions;
    this.mapPadding = config.mapPadding;
    this.pinImages = config.pinImages;
    this.pinClusterImages = config.pinClusterImages;
    this.enablePinClustering = config.enablePinClustering;
    this.onPinSelect = config.onPinSelect;
    this.onPostMapRender = config.onPostMapRender;
    this.pinClickListener = config.pinClickListener;
    this.pinClusterClickListener = config.pinClusterClickListener;
    this.dragEndListener = config.dragEndListener;
    this.zoomChangeListener = config.zoomChangeListener;
    this.displayAllResultsOnNoResults  = config.displayAllResultsOnNoResults;

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

  onCreate () {
    this.loadAndInitializeMap();

    this.core.globalStorage.on('update', 'vertical-results', (data) => {
      this.setState(data);
    });
  }

  setState (data) {
    if (data.searchState === 'search-loading') {
      return;
    }

    this._data = data;
    this.onMount();
  }

  onMount () {
    this._updateMap(this._data);
  }

  /**
   * Load the map provider scripts and initialize the map with the configuration options
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
      .withWrapper(this._container)
      .withProvider(mapProviderImpl)
      .withProviderOptions(this.providerOptions || {})
      .withPadding(this.mapPadding)
      .build();
    this.map = map;
    this.addMapInteractions(map);
  }

  /**
   * Add map interactions like event listeners and rendering targets
   * @param {Map} The map object
   */
  addMapInteractions(map) {
    // TODO google specific
    window.google.maps.event.addListener(map._map.map, 'dragend', () => this.dragEndListener(map));

    window.google.maps.event.addListener(map._map.map, 'zoom_changed', () => this.zoomChangeListener(map));

    window.google.maps.event.addListener(map._map.map, 'bounds_changed', () => {
      this.core.globalStorage.set(STORAGE_KEY_MAP_PROPERTIES, {
        visibleCenter: map.getVisibleCenter(),
        visibleRadius: map.getVisibleRadius()
      })
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
      .withOnPostRender((data, map) => this.onPostMapRender(data, map, mapRenderTarget.getPins()))
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

          if (!map.coordinateIsInVisibleBounds(pins[id].getCoordinate())) {
            map.setCenterWithPadding(pins[id].getCoordinate(), true);
          }
        }
      }
    });
  }

  /**
   * Get the Map pin clusterer object
   */
  getClusterer () {
    const clustererOptions = new PinClustererOptions()
      .withClickListener(() => this.pinClusterClickListener())
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

    pin.setClickHandler(() => this.pinClickListener(index, id));
    pin.setHoverHandler(hovered => this.core.globalStorage.set(STORAGE_KEY_HOVERED_RESULT, hovered ? id : null));
    return pin;
  }

  /**
   * Update the map with the new data
   *
   * @param data The vertical results data
   */
  _updateMap (data) {
    const verticalData = transformDataToVerticalData(data);
    const universalData = transformDataToUniversalData(data);
    let entityData = verticalData.length ? verticalData : universalData;

    const fromSearchThisArea = this.core.globalStorage.getState(STORAGE_KEY_FROM_SEARCH_THIS_AREA);
    this.core.globalStorage.delete(STORAGE_KEY_FROM_SEARCH_THIS_AREA);
    let updateZoom = !fromSearchThisArea;

    const isNoResults = data.resultsContext === 'no-results';
    if (isNoResults && !this.displayAllResultsOnNoResults) {
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

  static defaultTemplateName() {
    return 'theme-components/interactive-map';
  }

  static areDuplicateNamesAllowed() {
    return false;
  }

  static get type() {
    return 'NewMap';
  }
}

export { NewMap };
