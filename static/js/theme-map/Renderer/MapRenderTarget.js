import { Map } from '../Maps/Map.js';
import { PinClusterer } from '../PinClusterer/PinClusterer.js';
import { Type, assertType, assertInstance } from '../Util/Assertions.js';
import { RenderTarget, RenderTargetOptions } from './RenderTarget.js';

class MapRenderTargetOptions extends RenderTargetOptions {
  constructor() {
    super();

    this.idForEntity = entity => 'js-yl-' + entity.profile.uid;
    this.map = null;
    this.pinBuilder = (pinOptions, entity, index) => pinOptions.build();
    this.pinClusterer = null;
  }

  withIdForEntity(idForEntity) {
    assertType(idForEntity, Type.FUNCTION);

    this.idForEntity = idForEntity;
    return this;
  }

  /**
   * map: SearchMap
   */
  withMap(map) {
    assertInstance(map, Map);

    this.map = map;
    return this;
  }

  withPinBuilder(pinBuilder) {
    assertType(pinBuilder, Type.FUNCTION);

    this.pinBuilder = pinBuilder;
    return this;
  }

  withPinClusterer(pinClusterer) {
    assertInstance(pinClusterer, PinClusterer);

    this.pinClusterer = pinClusterer;
    return this;
  }

  build() {
    return new MapRenderTarget(this);
  }
}

class MapRenderTarget extends RenderTarget {
  constructor(options) {
    assertInstance(options, MapRenderTargetOptions);

    super(options);

    if (!options.map) {
      return Promise.reject(new Error('map is null or undefined'));
    }

    this._idForEntity = options.idForEntity;
    this._map = options.map;
    this._pinBuilder = options.pinBuilder;
    this._pinClusterer = options.pinClusterer;

    this._pins = {};
  }

  getPins() {
    return { ...this._pins };
  }

  /**
   * async render(data) => SearchMap
   * Calls map update function with data for pins, then returns map element
   */
  async render(data) {
    if (this._pinClusterer) {
      this._pinClusterer.reset(false);
    }

    Object.values(this._pins).forEach(pin => pin.remove());
    this._pins = {};

    (data.response.entities || []).forEach((entity, index) => {
      const pin = this._pinBuilder(this._map.newPinOptions(), entity, index + 1);
      if (pin) {
        this._pins[this._idForEntity(entity)] = pin;
      }
    }
    );

    const pins = Object.values(this._pins);
    const coordinates = pins.map(pin => pin.getCoordinate());

    if (coordinates.length && data.fitCoordinates) {
      this._map.fitCoordinates(coordinates);
    }

    if (this._pinClusterer) {
      this._pinClusterer.cluster(pins, this._map);
    } else {
      pins.forEach(pin => pin.setMap(this._map));
    }

    return this._map;
  }
}

export {
  MapRenderTarget,
  MapRenderTargetOptions
};
