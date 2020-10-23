require('iframe-resizer');

import InteractionDirector from './interactiondirector';
import { InteractionTypes } from '../constants';

/**
 * IFrameObserver is responsible for observing its iframe, notifying its mediator when
 * the iframe changes state.
 */
export default class IFrameObserver {
  constructor (mediator, iframeSelector) {
    /**
     * @type {InteractionDirector}
     */
    this._mediator = mediator;

    /**
     * @type {String}
     */
    this._iframeSelector = iframeSelector;

    /**
     * @type {boolean}
     */
    this._hasBeenInitialized = false;
  }

  /**
   * Observes the iframe and notifies the mediator when the iframe sends messages or
   * is initialized.
   *
   * @param {InteractionTypes} initializationEventType
   * @param {Object} config configuration sent to the iframe when contact has been made
   */
  attach(initializationEventType, config = {}) {
    iFrameResize({
      checkOrigin: false,
      sizeHeight: false,
      autoResize: false,
      scrolling: true,
      heightCalculationMethod: 'taggedElement',
      onInit: () => {
        this._mediator.onInteraction(initializationEventType, {
          isCollapsed: !this._hasBeenInitialized,
          ...config
        });

        // When the document inside the iframe changes pages, if the new page has an iFrameResizer
        // script on it, it calls this onInit function again. Since we treat the initial
        // Overlay page differently than subsequent pages, so we need to tell the iframe whether
        // it's the first page we've seen in the Overlay.
        this._hasBeenInitialized = true;
      },
      onMessage: (data) => {
        if (!data.message) {
          return;
        }

        this._mediator.onInteraction(data.message.type, data.message.detail);
      }
    }, this._iframeSelector);
  }
}