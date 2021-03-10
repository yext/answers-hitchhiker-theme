if (window.locatorBundleLoaded) {
  {{> theme-components/new-map/script}}
  {{> theme-components/interactive-map/script}}
} else {
  const locatorBundleScript = document.querySelector('script#js-answersLocatorBundleScript');

  locatorBundleScript.onload = function() {
    {{> theme-components/new-map/script}}
    {{> theme-components/interactive-map/script}}
  };
}
