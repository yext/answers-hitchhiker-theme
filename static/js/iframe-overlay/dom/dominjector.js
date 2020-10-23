import { AnimationStyling, Selectors } from '../constants';

/**
 * DomInjector is responsible for injecting the elements for the Overlay into the
 * document.
 */
export default class DomInjector {
  constructor(domain, experiencePath, offset, alignment) {
    /**
     * @type {string}
     */
    this.domain = domain;

    /**
     * @type {string}
     */
    this.experiencePath = experiencePath;

    /**
     * @type {string}
     */
    this.verticalOffset = offset.vertical;

    /**
     * @type {string}
     */
    this.horizontalOffset = offset.horizontal;

    /**
     * @type {string}
     */
    this.alignment = alignment;
  }

  /**
   * Injects the Overlay elements into the DOM.
   */
  inject() {
    const overlayContainerEl = this._injectOverlayContainer();
    const iframeContainerEl = this._injectIFrameContainer(overlayContainerEl);
    this._injectIFrame(iframeContainerEl);
    this._injectButtonFrame(overlayContainerEl);
  }

  _injectOverlayContainer() {
    const iframeContainerEl = document.createElement('div');
    iframeContainerEl.id = Selectors.OVERLAY_CONTAINER_ID;
    iframeContainerEl.style['position'] = 'fixed';
    iframeContainerEl.style['bottom'] = AnimationStyling.BASE_SPACING;
    iframeContainerEl.style[this.alignment] = AnimationStyling.BASE_SPACING;
    iframeContainerEl.style['max-width'] = AnimationStyling.MAX_WIDTH_DESKTOP;
    iframeContainerEl.style['max-height'] = AnimationStyling.MAX_HEIGHT_DESKTOP;
    iframeContainerEl.style['pointer-events'] = 'none';
    iframeContainerEl.style['overflow'] = 'hidden';
    iframeContainerEl.style['border-radius'] = '10px';
    document.body.appendChild(iframeContainerEl);
    return iframeContainerEl;
  }

  /**
   * Injects the iframe's container element into the DOM
   */
  _injectIFrameContainer(wrapperEl) {
    const iframeContainerEl = document.createElement('div');
    iframeContainerEl.id = Selectors.IFRAME_CONTAINER_ID;
    iframeContainerEl.classList.add('initial');
    iframeContainerEl.style['z-index'] = AnimationStyling.ZINDEX_HIDDEN;
    iframeContainerEl.style['opacity'] = '0';
    if (this.horizontalOffset || this.verticalOffset) {
      iframeContainerEl.style['transform'] = `translate(${this.horizontalOffset}, ${this.verticalOffset})`;
    }
    iframeContainerEl.style['max-width'] = '100%';
    iframeContainerEl.style['max-height'] = '100%';
    iframeContainerEl.style['height'] = AnimationStyling.MIN_HEIGHT;
    iframeContainerEl.style['width'] = AnimationStyling.WIDTH_DESKTOP;
    wrapperEl.appendChild(iframeContainerEl);
    return iframeContainerEl;
  }

  /**
   * Injects the iframe element into the DOM
   *
   * @param {Element} iframeContainerEl
   */
  _injectIFrame(iframeContainerEl) {
    const iframeEl = document.createElement('iframe');
    iframeEl.id = Selectors.IFRAME_ID;
    iframeEl.src = this._buildAnswersExperienceUrl();
    iframeEl.name = 'overlay';
    iframeEl.style['position'] = 'absolute';
    iframeEl.style['top'] = '0px';
    iframeEl.style['right'] = '0px';
    iframeEl.style['bottom'] = '0px';
    iframeEl.style['left'] = '0px';
    iframeEl.style['width'] = '100%';
    iframeEl.style['height'] = '100%';
    iframeEl.style['min-height'] = '0px';
    iframeEl.style['border'] = 'none';
    iframeEl.style['margin'] = '0px';
    iframeEl.style['padding'] = '0px';
    iframeEl.style['opacity'] = '0'; // For IE11
    iframeContainerEl.appendChild(iframeEl);
    return iframeEl;
  }

  /**
   * Injects the iframe element into the DOM
   *
   * @param {Element} iframeContainerEl
   */
  _injectButtonFrame(iframeContainerEl) {
    const iframeEl = document.createElement('iframe');
    iframeEl.id = Selectors.BUTTON_FRAME_ID;
    iframeEl.src = this.domain + 'overlay-button.html';
    iframeEl.name = 'overlayButton';
    iframeEl.style['opacity'] = '0';
    iframeEl.style['z-index'] = AnimationStyling.ZINDEX_HIDDEN;
    iframeEl.style['position'] = 'absolute';
    iframeEl.style['bottom'] = AnimationStyling.BASE_SPACING;
    iframeEl.style[this.alignment] = AnimationStyling.BASE_SPACING;
    iframeEl.style['width'] = '64px';
    iframeEl.style['height'] = '64px';
    iframeEl.style['min-height'] = '0px';
    iframeEl.style['border'] = 'none';
    iframeEl.style['margin'] = '0px';
    iframeEl.style['padding'] = '0px';
    iframeEl.style['border-radius'] = '200px';
    iframeEl.style['box-shadow'] = AnimationStyling.BOX_SHADOW_NORMAL;
    iframeContainerEl.appendChild(iframeEl);
    return iframeEl;
  }

  /**
   * @returns {string} the source URL for the Answers experience
   */
  _buildAnswersExperienceUrl() {
    const referrerPageUrl = window.location.href.split('?')[0].split('#')[0];
    const referrerPageUrlParam = '?referrerPageUrl=' + referrerPageUrl;
    return this.domain + this.experiencePath + referrerPageUrlParam;
  }
}
