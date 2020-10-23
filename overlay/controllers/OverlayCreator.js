/**
 * This class is responsible for using the overlay config to create and/or set up
 * the portions of the page necessary for the Overlay
 */
class OverlayCreator {
  constructor(config = {}) {
    /**
     * @type {Object}
     */
    this._panelConfig = config.panel;

    /**
     * @type {Array<Object>}
     */
    this._prompts = config.prompts;

    /**
     * @type {boolean}
     */
    this._isCollapsed = config.isCollapsed;
  }

  /**
   * Creates and sets up the portions of the page specific to the overlay: header panel,
   * prompts, and button
   */
  create() {
    const bodyEl = document.querySelector('body');
    bodyEl.classList.add('Overlay');

    new HeaderPanelInfuser(this._panelConfig).infuse();
    new PromptInjector(this._prompts).inject();

    this._updateOverlayShape();

    const promptsEl = document.querySelector('.js-Answers-overlaySuggestions');
    promptsEl && promptsEl.classList.remove('hidden');

    if (this._isCollapsed) {
      window.parentIFrame.sendMessage({
        type: 'iframeReady',
        detail: {
          totalHeight: this._getTotalHeight()
        }
      });
    }
  }

  /**
   * Updates the initial state of the page based on whether the Overlay is expanded
   * or collapsed.
   */
  _updateOverlayShape() {
    if (this._isCollapsed) {
      window.shrinkOverlay();
      window.collapseOverlay();
    } else {
      window.growOverlay();
      window.expandOverlay();
    }
  }

  /**
   * Returns the height of the page, in pixels
   *
   * @returns {number}
   */
  _getTotalHeight() {
    const answersContentEl = document.querySelector('.Answers');
    const headerEl = document.querySelector('.OverlayHeader');
    return(answersContentEl && answersContentEl.getBoundingClientRect().height || 0) +
      ((headerEl && headerEl.getBoundingClientRect().height) || 0);
  }
}