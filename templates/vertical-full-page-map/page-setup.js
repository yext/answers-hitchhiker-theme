function addFullPageMap() {
  {{> theme-components/theme-map/script}}
  {{> theme-components/vertical-full-page-map/script}}
}

if (window.verticalFullPageMapBundleLoaded) {
  addFullPageMap();
} else {
  const verticalFullPageMapScript = document.querySelector('script#js-verticalFullPageMapScript');
  verticalFullPageMapScript.onload = () => {
    window.verticalFullPageMapBundleLoaded = true;
    verticalFullPageMapScript.dispatchEvent(new Event('vertical-full-page-map-bundle-loaded'));
    addFullPageMap();
  }
}

/**
 * Registers listeners on the card once the locator bundle is loaded
 *
 * @param {ANSWERS.Component} card A location card
 */
function registerVerticalFullPageMapCardListeners(card) {
  if (window.verticalFullPageMapBundleLoaded) {
    new VerticalFullPageMap.CardListenerAssigner({card: card}).addListenersToCard();
    return;
  }
  const verticalFullPageMapScript = document.querySelector('script#js-verticalFullPageMapScript');
  verticalFullPageMapScript.addEventListener('vertical-full-page-map-bundle-loaded', () => {
    new VerticalFullPageMap.CardListenerAssigner({card: card}).addListenersToCard();
  });
}