function addFullPageMap() {
  {{> theme-components/theme-map/script}}
  {{> theme-components/vertical-full-page-map/script}}
}

if (window.verticalFullPageMapBundleLoaded) {
  addFullPageMap();
} else {
  const verticalFullPageMapScript = document.querySelector('script#js-verticalFullPageMapScript');
  verticalFullPageMapScript.onload = addFullPageMap;
}
