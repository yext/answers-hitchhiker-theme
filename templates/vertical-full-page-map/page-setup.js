function addFullPageMap() {
  {{> theme-components/theme-map/script}}
  {{> theme-components/vertical-full-page-map/script}}
}

if (window.locatorBundleLoaded) {
  addFullPageMap();
} else {
  const locatorBundleScript = document.querySelector('script#js-answersLocatorBundleScript');
  locatorBundleScript.onload = () => {
    window.locatorBundleLoaded = true;
    locatorBundleScript.dispatchEvent(new Event('vertical-full-page-map-bundle-loaded'));
    addFullPageMap();
  }
}

/**
 * Registers listeners on the card once the locator bundle is loaded
 *
 * @param {ANSWERS.Component} card A location card
 */
function registerVerticalFullPageMapCardListeners(card) {
  if (window.locatorBundleLoaded) {
    new VerticalFullPageMap.CardListenerAssigner({card: card}).addListenersToCard();
    return;
  }
  const verticalFullPageMapScript = document.querySelector('script#js-verticalFullPageMapScript');
  verticalFullPageMapScript.addEventListener('vertical-full-page-map-bundle-loaded', () => {
    new VerticalFullPageMap.CardListenerAssigner({card: card}).addListenersToCard();
  });
}