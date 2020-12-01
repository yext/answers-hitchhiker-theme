// Import global polyfills
import 'core-js/stable';
import cssVars from 'css-vars-ponyfill';

cssVars({
  onlyLegacy: true,
  onBeforeSend: (xhr, node, url) => {
    try {
      const uriWithCacheBust = new URL(url);
      const params = new SearchParams(uriWithCacheBust.search);
      params.set('_', new Date().getTime());
      uriWithCacheBust.search = params.toString();
      xhr.open('GET', uriWithCacheBust.toString());
    } catch (e) {
      // Catch the error and continue if the URL provided in the asset is not a valid URL
    }
  }
});

// Import all SCSS
import Scss from '../../../scss/answers/overlay/button/_default.scss';

// Import all JS assets
import OverlayButtonJS from './button.js';
export { OverlayButtonJS };
window.OverlayButtonJS = OverlayButtonJS;
