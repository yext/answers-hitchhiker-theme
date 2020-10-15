import { AnimationStyling, Selectors } from '../constants';

/**
 * DomInjector is responsible for injecting the elements for the Overlay into the
 * document.
 */
export default class DomInjector {
  constructor(experienceUrl, offset, alignment) {
    /**
     * @type {string}
     */
    this.experienceUrl = experienceUrl;

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
    // Create iframe container
    const iframeContainerEl = document.createElement('div');
    iframeContainerEl.id = Selectors.IFRAME_CONTAINER_ID;
    iframeContainerEl.classList.add('initial');
    iframeContainerEl.style['position'] = 'fixed';
    iframeContainerEl.style['z-index'] = '-1';
    iframeContainerEl.style['bottom'] = '16px';
    iframeContainerEl.style[this.alignment] = '16px';
    iframeContainerEl.style['opacity'] = '0';
    iframeContainerEl.style['transform'] = `translate(${this.horizontalOffset}, ${this.verticalOffset})`;
    iframeContainerEl.style['max-width'] = AnimationStyling.WIDTH_MOBILE;
    iframeContainerEl.style['max-height'] = AnimationStyling.HEIGHT_TALLER;
    iframeContainerEl.style['height'] = AnimationStyling.HEIGHT_TALLER;
    iframeContainerEl.style['width'] = AnimationStyling.WIDTH_DESKTOP;
    iframeContainerEl.style['overflow'] = 'hidden';
    iframeContainerEl.style['border-radius'] = '10px';
    document.body.appendChild(iframeContainerEl);

    // Create iframe
    const iframeEl = document.createElement('iframe');
    iframeEl.id = Selectors.IFRAME_ID;
    iframeEl.src = this.experienceUrl;
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
    iframeContainerEl.appendChild(iframeEl);
  }
}
