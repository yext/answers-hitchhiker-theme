/**
 * A promise executor function which calls resolve once all page-specific scripts are loaded
 *
 * @param {Function} resolve 
 */
export default function (resolve) {
  const locatorBundleScript = document.querySelector('script#js-answersLocatorBundleScript');
  if (locatorBundleScript) {
    locatorBundleScript.onload = resolve;
  } else {
    resolve();
  }
};