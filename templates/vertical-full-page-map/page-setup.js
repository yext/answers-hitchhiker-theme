if (window.locatorBundleLoaded) {
  {{> theme-components/theme-map/script}}
  {{> theme-components/vertical-full-page-map/script}}
} else {
  const locatorBundleScript = document.querySelector('script#js-answersLocatorBundleScript');

  locatorBundleScript.onload = function() {
    {{> theme-components/theme-map/script}}
    {{> theme-components/vertical-full-page-map/script}}
  };
}
