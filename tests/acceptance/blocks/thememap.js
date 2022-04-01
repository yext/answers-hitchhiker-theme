import { Selector, t, ClientFunction } from 'testcafe';

/**
 * This class models user interactions with the {@link ThemeMap}.
 */
class ThemeMap {
  constructor () {
    this._pin = Selector('.yxt-Pin button');
    this._pinCluster = Selector('.yxt-PinCluster button');
    this._canvas = Selector('.Answers-map');
    this._searchThisAreaToggle = Selector('.Answers-searchThisAreaToggleLabel');
    this._searchThisAreaButton = Selector('.js-searchThisAreaButton');
  }

  /**
   * Selects a pin from the map.
   */
  async selectPin () {
    await t.click(this._pin);
  }

  /**
   * Selects a pin cluster from the map.
   */
  async selectPinCluster () {
    await t.click(this._pinCluster);
    await this.waitForZoomStabilization();
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

  async clickMap () {
    await t.click(this._canvas);
  }

  /**
   * Gets the current zoom of the map
   * @returns {Promise<number>}
   */
  async getZoom () {
    const zoom = await ClientFunction(() => {
      return ANSWERS
        .components
        .getActiveComponent('VerticalFullPageMapOrchestrator')
        .currentZoom
    })();
    return zoom;
  }

  /**
   * Waits for the map zoom to stabilize
   */
  async waitForZoomStabilization () {
    const pollingIntervalMsecs = 250;
    const minNumStableIntervals = 3;
    const maxNumIntervals= 10;
    let previousZoom = await this.getZoom();
    let numStableIntervals = 0;
    let numIntervals = 0;
    let isZoomStabilized = false;
    let isMaxIntervalsReached = false;

    while (!isZoomStabilized && !isMaxIntervalsReached) {
      await t.wait(pollingIntervalMsecs);
      const currentZoom = await this.getZoom();

      if (currentZoom === previousZoom) {
        numStableIntervals++;
      } else {
        numStableIntervals = 0;
      }

      numIntervals++;

      isZoomStabilized = (numStableIntervals >= minNumStableIntervals);
      isMaxIntervalsReached = (numIntervals >= maxNumIntervals);
      previousZoom = currentZoom;
    }
  }
}

export default new ThemeMap();