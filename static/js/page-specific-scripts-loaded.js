/**
 * A promise executor function which calls resolve once all page-specific scripts are loaded
 *
 * @param {Function} resolve
 * @param {Function} reject
 */
export default function (resolve, reject) {
  const locatorBundleScript = document.querySelector('script#js-answersLocatorBundleScript');
  if (locatorBundleScript) {
    locatorBundleScript.onload = resolve;
    locatorBundleScript.onerror = () => {
      reject('Failed to load locator-bundle.js');
    };
  } else {
    resolve();
  }
};