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
    this.mediator = mediator;

    /**
     * @type {String}
     */
    this.iframeSelector = iframeSelector;
  }

  /**
   * Observes the iframe and notifies the mediator when the iframe sends messages or
   * is initialized.
   */
  attach() {
    iFrameResize({
      checkOrigin: false,
      sizeHeight: false,
      autoResize: false,
      scrolling: true,
      onInit: () => {
        this.mediator.onIFrameInteraction(InteractionTypes.INIT);
      },
      onMessage: (data) => {
        if (!data.message) {
          return;
        }

        this.mediator.onIFrameInteraction(data.message.type, data.message.detail);
      }
    }, this.iframeSelector);
  }
}