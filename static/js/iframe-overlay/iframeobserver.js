import { InteractionTypes, Selectors } from "./constants";
import InteractionDirector from "./interactiondirector";

export default class IFrameObserver {
  constructor (mediator) {
    /**
     * @type {InteractionDirector}
     */
    this.mediator = mediator;
  }

  attach() {
    iFrameResize({
      checkOrigin: false,
      sizeHeight: false,
      autoResize: false,
      scrolling: true,
      onInit: () => {
        this.mediator.onIFrameChanged(InteractionTypes.INIT);
      },
      onMessage: (data) => {
        if (!data.message) {
          return;
        }

        this.mediator.onIFrameChanged(data.message.type, data.message.detail);
      }
    }, `#${Selectors.iframeId}`);
  }
}