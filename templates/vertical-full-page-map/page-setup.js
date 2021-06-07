{{> theme-components/theme-map/script}}
{{> theme-components/vertical-full-page-map/script}}

/**
 * Registers listeners on the card
 *
 * @param {ANSWERS.Component} card A location card
 */
 function registerVerticalFullPageMapCardListeners(card) {
  new VerticalFullPageMap.CardListenerAssigner({card: card}).addListenersToCard();
}