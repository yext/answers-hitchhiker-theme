import { Coordinate } from './Geo/Coordinate.js';
import { MapOptions } from './Maps/Map.js';
import { MapRenderTargetOptions } from './Renderer/MapRenderTarget.js';
import { RendererOptions } from './Renderer/Renderer.js';
import { PinProperties } from './Maps/PinProperties.js';
import { PinClustererOptions } from './PinClusterer/PinClusterer.js';
import { transformDataToUniversalData, transformDataToVerticalData } from './Util/transformers.js';
import { getEncodedSvg, getMapProvider } from './Util/helpers.js';

import ThemeMapConfig from './ThemeMapConfig.js'
import StorageKeys from '../constants/storage-keys.js';

/**
 * The component to create and control the functionality of a map,
 * including importing and initializing the map, assigning event 
 * listeners, and rendering the map on the page with results changes
 */
class ThemeMap extends ANSWERS.Component {
  constructor(rawConfig, systemConfig) {
    super(rawConfig, systemConfig);

    /**
     * Configuration with default logic
     * @type {ThemeMapConfig}
     */
    this.config = new ThemeMapConfig(rawConfig);

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

    /**
     * HTML element id for the selected cluster
     * @type {string}
     */
    this.selectedClusterPin = null;

    /*
     * A list of listeners to remove when results are updated
     * @type {StorageListener[]}
     */
    this.resultsSpecificStorageListeners = [];
  }

  onCreate () {
    this.loadAndInitializeMap();

    this.core.storage.registerListener({
      eventType: 'update',
      storageKey: StorageKeys.VERTICAL_RESULTS,
      callback: (data) => {
        this.setState(data);
      }
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
    const mapProviderImpl = getMapProvider(this.config.mapProvider);
    await mapProviderImpl.load(this.config.apiKey, {
      client: this.config.clientId,
      language: this.config.language,
    });
    const map = new MapOptions()
      .withDefaultCenter(this.config.defaultCenter)
      .withDefaultZoom(this.config.defaultZoom)
      .withWrapper(this._container)
      .withProvider(mapProviderImpl)
      .withProviderOptions(this.config.providerOptions || {})
      .withPadding(this.config.padding)
      .withLocale(this.config.language)
      .build();
    this.map = map;
    this.addMapInteractions(map);
  }

  /**
   * Update in the Answers SDK storage map properties used by other components
   */
  updateMapPropertiesInStorage() {
    this.core.storage.set(StorageKeys.LOCATOR_MAP_PROPERTIES, {
      visibleCenter: this.map.getVisibleCenter(),
      visibleRadius: this.map.getVisibleRadius()
    });
  }

  /**
   * Add map interactions like event listeners and rendering targets
   * @param {Map} The map object
   */
  addMapInteractions(map) {
    this.map.idle().then(() => {
      map.setPanHandler((prevousBounds, currentBounds, zoomTrigger) => {
        this.updateMapPropertiesInStorage();
        this.config.panHandler(prevousBounds, currentBounds, zoomTrigger);
      });
      map.setDragEndHandler(() => {
        this.updateMapPropertiesInStorage();
        this.config.dragEndListener()
      });
      map.setZoomChangedHandler((zoomTrigger) => {
        this.config.zoomChangedListener(this.map.getZoom(), zoomTrigger);
      });
      map.setZoomEndHandler((zoomTrigger) => {
        this.updateMapPropertiesInStorage();
        this.config.zoomEndListener(this.map.getZoom(), zoomTrigger);
      });
      map.setCanvasClickHandler(() => this.config.canvasClickListener());
    });

    const mapRenderTargetOptions = new MapRenderTargetOptions()
      .withMap(map)
      .withOnPostRender((data, map) => this.config.onPostMapRender(data, map, mapRenderTarget.getPins()))
      .withPinBuilder((pinOptions, entity, index) => this.buildPin(pinOptions, entity, index))

    let pinClusterer;
    if (this.config.enablePinClustering) {
      pinClusterer = this.getClusterer();
      mapRenderTargetOptions.withPinClusterer(pinClusterer);
    }

    const mapRenderTarget = mapRenderTargetOptions.build();

    this.renderer.register(mapRenderTarget);
    this.renderReady = true;
    if (this.initialData) {
      this.renderer.render(this.initialData);
    }

    this.core.storage.registerListener({
      eventType: 'update',
      storageKey: StorageKeys.LOCATOR_HOVERED_RESULT,
      callback: id => {
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
      }
    });

    this.core.storage.registerListener({
      eventType: 'update',
      storageKey: StorageKeys.LOCATOR_SELECTED_RESULT,
      callback: id => {
        if (id === this.selectedPinId) {
          return;
        }

        const pins = mapRenderTarget.getPins();

        if (this.selectedPinId && pins[this.selectedPinId]) {
          pins[this.selectedPinId].setStatus({ selected: false });
          this.selectedPinId = null;
        }

        if (this.selectedClusterPin) {
          this.selectedClusterPin.setStatus({ selected: false });
          this.selectedClusterPin = null;
        }

        if (!id) {
          return;
        }

        if (!pins[id]) {
          throw new Error(`A pin with the id ${id} could not be found on the map.`);
        }

        if (this.config.enablePinClustering && pinClusterer) {
          this.updateSelectedResultStateWithClusters(id, pins, pinClusterer.getClusters());
        } else {
          this.updateSelectedResultStateWithoutClusters(id, pins);
        }

        if (this.config.onPinSelect) {
          this.config.onPinSelect();
        }
      }
    });
  }

  /**
   * Update the pin and map state with information about the selected result. This result
   * may be selected by either a pin click or a card click.
   *
   * @param {string} id
   * @param {MapPin[]} pins
   */
  updateSelectedResultStateWithoutClusters(id, pins) {
    pins[id].setStatus({ selected: true });
    this.selectedPinId = id;

    if (!this.map.coordinateIsInVisibleBounds(pins[id].getCoordinate())) {
      this.map.setCenterWithPadding(pins[id].getCoordinate(), true);
    }
  }

  /**
   * Update the pin and map state with information about the selected result. This result
   * may be selected by either a pin click or a card click.
   * This will check if the selected result, identified by id, is in a cluster in clusters
   * and enact changes according to the selected cluster.
   * If not, fallback to the normal selected result behavior.
   *
   * @param {string} id
   * @param {MapPin[]} pins
   * @param {PinCluster[]} clusters
   */
  updateSelectedResultStateWithClusters(id, pins, clusters) {
    const filteredClusters = clusters.filter((cluster) => cluster.containsPin(id));

    if (filteredClusters.length === 0) {
      this.updateSelectedResultStateWithoutClusters(id, pins);
      return;
    }

    const selectedCluster = filteredClusters[0];
    const selectedClusterPin = selectedCluster.clusterPin;

    selectedClusterPin.setStatus({ selected: true });
    this.selectedPinId = id;
    this.selectedClusterPin = selectedClusterPin;

    if (!this.map.coordinateIsInVisibleBounds(selectedCluster.clusterPin.getCoordinate())) {
      this.map.setCenterWithPadding(selectedCluster.clusterPin.getCoordinate(), true);
    }
  }

  /**
   * Get the Map pin clusterer object
   */
  getClusterer () {
    const clustererOptions = new PinClustererOptions()
      .withClickHandler(() => {
        this.updateMapPropertiesInStorage();
        this.config.pinClusterClickListener();
      })
      .withIconTemplate('default', (pinDetails) => {
        return getEncodedSvg(this.config.pinClusterImages.getDefaultPin(pinDetails.pinCount).svg);
      })
      .withIconTemplate('hovered', (pinDetails) => {
        return getEncodedSvg(this.config.pinClusterImages.getHoveredPin(pinDetails.pinCount).svg);
      })
      .withIconTemplate('selected', (pinDetails) => {
        return getEncodedSvg(this.config.pinClusterImages.getSelectedPin(pinDetails.pinCount).svg);
      })
      .withPropertiesForStatus((status, pinCount) => {
        const defaultPin = this.config.pinClusterImages.getDefaultPin(pinCount);
        const properties = new PinProperties()
          .setIcon(status.hovered || status.focused || status.selected ? 'hovered' : 'default')
          .setWidth(defaultPin.width)
          .setHeight(defaultPin.height)
          .setAnchorX(this.config.pinClusterAnchors.anchorX)
          .setAnchorY(this.config.pinClusterAnchors.anchorY)
          .setClass('yxt-PinCluster')
          .setSRText(`Cluster of ${pinCount} results`);

        return properties;
      })
      .withMinClusterSize(this.config.minClusterSize)
      .withClusterRadius(this.config.minClusterRadius)
      .withClusterZoomAnimated(this.config.clusterZoomAnimated)
      .withClusterZoomMax(this.config.clusterZoomMax);
    return clustererOptions.build();
  }

  /**
   * Builds a pin given pin options.
   * @param {PinOptions} pinOptions The pin options builder
   * @param {Object} entity The entity data to use in pin building
   * @param {Number} index The index of the entity in the result list ordering
   */
  buildPin(pinOptions, entity, index) {
    const id = 'js-yl-' + entity.profile.meta.id;
    const defaultPin = this.config.pinImages.getDefaultPin(index, entity.profile);
    const hoveredPin = this.config.pinImages.getHoveredPin(index, entity.profile);
    const selectedPin = this.config.pinImages.getSelectedPin(index, entity.profile);
    const pin = pinOptions
      .withId(id)
      .withIcon(
        'default',
        getEncodedSvg(defaultPin.svg))
      .withIcon(
        'hovered',
        getEncodedSvg(hoveredPin.svg))
      .withIcon(
        'selected',
        getEncodedSvg(selectedPin.svg))
      .withHideOffscreen(false)
      .withCoordinate(new Coordinate(entity.profile.yextDisplayCoordinate))
      .withPropertiesForStatus(status => {
        const properties = new PinProperties()
          .setIcon(status.selected ? 'selected' : ((status.hovered || status.focused) ? 'hovered' : 'default'))
          .setClass('yxt-Pin')
          .setSRText(`Result number ${index}`)
          .setZIndex(status.selected ? 1 : ((status.hovered || status.focused) ? 2 : 0))
          .setAnchorX(this.config.pinAnchors.anchorX)
          .setAnchorY(this.config.pinAnchors.anchorY);

        properties.setWidth(defaultPin.width);
        properties.setHeight(defaultPin.height);

        if (status.selected) {
          properties.setWidth(selectedPin.width);
          properties.setHeight(selectedPin.height);
        }

        return properties;
      })
      .build();

    const cardFocusUpdateListener = {
      eventType: 'update',
      storageKey: StorageKeys.LOCATOR_CARD_FOCUS,
      callback: (data) => {
        const cardIndex = data.index;
        if (cardIndex + 1 === index) {
          this.core.storage.set(StorageKeys.LOCATOR_SELECTED_RESULT, id);
        }
      }
    };
    this.resultsSpecificStorageListeners.push(cardFocusUpdateListener);
    this.core.storage.registerListener(cardFocusUpdateListener);
    pin.setClickHandler(() => this.config.pinFocusListener(index, id));
    pin.setFocusHandler(() => this.config.pinFocusListener(index, id));
    pin.setHoverHandler(hovered => this.core.storage.set(
      StorageKeys.LOCATOR_HOVERED_RESULT,
      hovered ? id : null
    ));
    return pin;
  }

  /**
   * Update the map with the new data
   *
   * @param data The vertical results data
   */
  _updateMap (data) {
    this.resultsSpecificStorageListeners.forEach((listener) => {
      this.core.storage.removeListener(listener);
    });
    this.resultsSpecificStorageListeners = [];

    const verticalData = transformDataToVerticalData(data);
    const universalData = transformDataToUniversalData(data);
    let entityData = verticalData.length ? verticalData : universalData;

    const numConcurrentSearchThisAreaCalls = 
      this.core.storage.get(StorageKeys.LOCATOR_NUM_CONCURRENT_SEARCH_THIS_AREA_CALLS) || 0;

    if (numConcurrentSearchThisAreaCalls > 0) {
      this.core.storage.set(
        StorageKeys.LOCATOR_NUM_CONCURRENT_SEARCH_THIS_AREA_CALLS,
        numConcurrentSearchThisAreaCalls - 1
      ); 
    }

    let fitCoordinates = numConcurrentSearchThisAreaCalls <= 0;

    const isNoResults = data.resultsContext === 'no-results';
    if (isNoResults && !this.config.displayAllResultsOnNoResults) {
      entityData = [];
      fitCoordinates = false;
    }

    const renderData = {
      response: { entities: entityData },
      fitCoordinates: fitCoordinates
    };

    if (this.renderReady) {
      this.renderer.render(renderData);
    } else {
      this.initialData = renderData;
    }
  }

  static defaultTemplateName() {
    return 'theme-components/theme-map';
  }

  static areDuplicateNamesAllowed() {
    return false;
  }

  static get type() {
    return 'ThemeMap';
  }
}

export { ThemeMap };
