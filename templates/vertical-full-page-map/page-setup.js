function loadFullPageMap() {
  {{> theme-components/theme-map/script}}
  {{> theme-components/vertical-full-page-map/script}}
}

if (window.locatorBundleLoaded) {
  loadFullPageMap();
} else {
  const locatorBundleScript = document.querySelector('script#js-answersLocatorBundleScript');
  locatorBundleScript.onload = () => {
    window.locatorBundleLoaded = true;
    locatorBundleScript.dispatchEvent(new Event('locator-bundle-loaded'));
    loadFullPageMap();
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
  const locatorBundleScript = document.querySelector('script#js-answersLocatorBundleScript');
  locatorBundleScript.addEventListener('locator-bundle-loaded', () => {
    new VerticalFullPageMap.CardListenerAssigner({card: card}).addListenersToCard();
  });
}