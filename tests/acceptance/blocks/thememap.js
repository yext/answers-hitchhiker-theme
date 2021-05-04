import { Selector, t } from 'testcafe';

/**
 * This class models user interactions with the {@link ThemeMap}.
 */
class ThemeMap {
  constructor () {
    this._pin = Selector('.js-answersMap button');
    this._canvas = Selector('.mapboxgl-canvas');
    this._searchThisAreaToggle = Selector('.Answers-searchThisAreaToggleLabel');
    this._searchThisAreaButton = Selector('.js-searchThisAreaButton');
  }

  /**
   * Selects a pin from the Mapbox map.
   */
  async selectMapboxPin () {
    await t.click(this._pin);
  }

  async dragLeft () {
    await t.drag(this._canvas, 750, 0);
  }

  async toggleSearchThisArea () {
    await t.click(this._searchThisAreaToggle);
  }

  async clickSearchThisAreaButton () {
    await t.click(this._searchThisAreaButton);
  }
}

export default new ThemeMap();