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

// Include code and named-exports from the non-legacy bundle
export * from './entry';