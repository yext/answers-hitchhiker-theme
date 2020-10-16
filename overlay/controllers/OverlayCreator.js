/**
 * This class is responsible for using the overlay config to create and/or set up
 * the portions of the page necessary for the Overlay
 */
class OverlayCreator {
  constructor(config = {}) {
    /**
     * @type {Object}
     */
    this._buttonConfig = {
      labelText: config.button.text,
      alignment: config.button.alignment,
      backgroundColor: config.button.backgroundColor,
      foregroundColor: config.button.foregroundColor,
      hideWhenCollapsed: config.hideDefaultButton
    };

    /**
     * @type {Object}
     */
    this._panelConfig = {
      heading: config.panel.header,
      subtitle: config.panel.subtitle,
      imageUrl: config.panel.icon,
      backgroundColor: config.panel.backgroundColor,
      foregroundColor: config.panel.foregroundColor
    };

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

    window.collapseOverlay();

    new HeaderPanelInfuser(this._panelConfig).infuse();
    new PromptInjector(this._prompts).inject();
    new ButtonInfuser(this._buttonConfig)
      .infuse();

    this._updateOverlayShape();

    const buttonEl = document.querySelector('.js-OverlayButton');
    const buttonSize = buttonEl && buttonEl.getBoundingClientRect();
    this._setButtonWidth(buttonSize.width);

    window.parentIFrame.sendMessage({
      type: 'buttonReady',
      detail: {
        height: this._getCollapsedOverlayHeight(buttonSize.height),
        width: this._getCollapsedOverlayWidth(buttonSize.width),
        totalHeight: this._getTotalHeight()
      }
    });
  }

  /**
   * Updates the initial state of the page based on whether the Overlay is expanded
   * or collapsed.
   */
  _updateOverlayShape() {
    if (this._isCollapsed) {
      const promptsEl = document.querySelector('.js-Answers-overlaySuggestions');
      promptsEl && promptsEl.classList.remove('hidden');

      window.shrinkOverlay();
      window.collapseOverlay();
    } else {
      window.growOverlay();
      window.expandOverlay();
    }
  }

  /**
   * Sets the button width on the window
   *
   * @param {number} buttonWidth
   */
  _setButtonWidth(buttonWidth) {
    window.buttonWidth = buttonWidth;
  }

  /**
   * Returns the height of the collapsed overlay, in pixels
   *
   * @param {number} buttonWidth
   * @returns {number}
   */
  _getCollapsedOverlayHeight(buttonHeight) {
    const verticalOffset = 16;
    const arbitraryNumberOfPixelsFromUX = 3;
    return buttonHeight > 0 && (buttonHeight + verticalOffset + arbitraryNumberOfPixelsFromUX);
  }

  /**
   * Returns the width of the collapsed overlay, in pixels
   *
   * @param {number} buttonWidth
   * @returns {number}
   */
  _getCollapsedOverlayWidth(buttonWidth) {
    const horizontalOffset = 16;
    const arbitraryNumberOfPixelsFromUX = 6;
    return buttonWidth && (buttonWidth + horizontalOffset + arbitraryNumberOfPixelsFromUX);
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
      ((headerEl && headerEl.getBoundingClientRect().height) || 0) +
      this._getCollapsedOverlayHeight();
  }
}