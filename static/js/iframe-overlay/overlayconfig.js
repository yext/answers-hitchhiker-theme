/**
 * OverlayConfig represents the configuration required for the Overlay.
 */
export default class OverlayConfig {
  constructor(config = {}) {
    /**
     * The path to use for the experience. This is a relative path that will be appended
     * to the domain for their Answers experience.
     * @type {String}
     */
    this.experiencePath = config.experiencePath || 'index.html';

    /**
     * List of prompts, each prompt has the following properties:
     * {
     *   text: "View all banks",     // Required
     *   url: "/banks.html?query=''" // Optional
     *   target: "_top",             // Optional
     * }
     * @type {Array<Object>}
     */
    this.prompts = config.prompts || [];

    /**
     * Whether to show or hide the button. If true, we'd expect a customSelector to be
     * specified (see "this.customSelector" below).
     * @type {boolean}
     */
    this.hideDefaultButton = config.hideDefaultButton || false;

    /**
     * The CSS selector of an element; clicks to this element toggle the display the
     * overlay. Accepts any valid CSS selector, selecting the first element matching the
     * customSelector in the document.
     * @type {String}
     */
    this.customSelector = config.customSelector || '';

    /**
     * Controls the positioning offset for the overlay.
     */
    config.offset = config.offset || {};
    this.offset = {
      /**
       * Adds additional horizontal padding to offset the entire overlay.
       * @type {number|string}
       */
      horizontal: config.offset.horizontal || 0,
      /**
       * Adds additional vertical padding to offset the entire overlay.
       * @type {number|string}
       */
      vertical: config.offset.vertical || 0
    };

    /**
     * Configuration for the button.
     */
    config.button = config.button || {};
    config.button.color = config.button.color || {};
    this.button = {
      /**
       * Text to display; if populated, shows to the right of the icon.
       * @type {String}
       */
      text: config.button.text || '',
      /**
       * Where to align the button, can be 'left' or 'right'
       * @type {String}, either 'left' or 'right'
       */
      alignment: config.button.alignment === 'left' ? 'left' : 'right',
      /**
       * The background color of the button, accepts hex or rgb.
       * @type {String}
       */
      backgroundColor: config.button.color.background || '#000000',
      /**
       * The foreground color of the button, accepts hex or rgb.
       * @type {String}
       */
      foregroundColor: config.button.color.foreground || '#FFFFFF',
    };

    /**
     * Configuration for the panel.
     */
    config.panel = config.panel || {};
    config.panel.color = config.panel.color || {};
    this.panel = {
      /**
       * The heading text for the panel of the overlay
       * @type {String}
       */
      header: config.panel.header || '',
      /**
       * The subtitle text for the panel of the overlay
       * @type {String}
       */
      subtitle: config.panel.subtitle || '',
      /**
       * The icon URL for the panel of the overlay
       * @type {String}
       */
      icon: config.panel.icon || '',
      /**
       * The background color of the panel, accepts hex or rgb.
       * @type {String}
       */
      backgroundColor: config.panel.color.background || '#000000',
      /**
       * The foreground color of the panel, accepts hex or rgb.
       * @type {String}
       */
      foregroundColor: config.panel.color.foreground || '#FFFFFF',
    };
  }
}