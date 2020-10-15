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
      borderRadius: config.button.text ? '200px' : '50%'
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
    this._isCollapsed = true; // TODO (agrow) get this value from config
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
    new ButtonInjector(this._buttonConfig).inject();

    this._updateOverlayShape();
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
}