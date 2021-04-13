function loadFullPageMap() {
  {{> theme-components/theme-map/script}}
  {{> theme-components/vertical-full-page-map/script}}
}

if (window.locatorBundleLoaded) {
  loadFullPageMap();
} else {
  const locatorBundleScript = document.querySelector('script#js-answersLocatorBundleScript');
  locatorBundleScript.onload = loadFullPageMap;
}
