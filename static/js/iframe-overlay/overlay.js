import IFrameObserver from "./iframeobserver";
import InteractionDirector from "./interactiondirector";
import ParentFrameObserver from "./parentframeobserver";

export default class Overlay {
  constructor(config) {
    this.config = config;
  }

  create() {
    // TODO (agrow) inject overlay

    // Set up communication between iframe and parent frame
    this._beginCommunication();
  }

  _beginCommunication() {
    const iframeConfig = {
      button: this.config.button,
      panel: this.config.panel,
      prompts: this.config.prompts,
    };

    const mediator = new InteractionDirector(iframeConfig);

    new IFrameObserver(mediator)
      .attach();
    new ParentFrameObserver(mediator)
      .attach();
  }
}