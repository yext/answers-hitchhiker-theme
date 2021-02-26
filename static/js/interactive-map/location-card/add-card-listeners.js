const getIndexOfThisCard = () => {
  const { _index } = JSON.parse(this._container.parentElement.dataset.opts || {});
  return _index;
}

const storeCardFocusIndex = (index) => {
  this.core.storage.set(HitchhikerJS.StorageKeys.LOCATOR_CARD_FOCUS, { index: index });
}

const removePinFocusFromAllCards = () => {
  document.querySelectorAll('.yxt-Card--pinFocused').forEach((el) => {
    el.classList.remove('yxt-Card--pinFocused');
  });
}

const addPinFocusToThisCard = () => {
  this._container.parentElement.classList.add('yxt-Card--pinFocused');
}

/**
 * Set yxt-Card--pinFocused when the card is clicked
 */
this._container.parentElement.addEventListener('click', () => {
  const index = getIndexOfThisCard();
  storeCardFocusIndex(index);
  removePinFocusFromAllCards();
  addPinFocusToThisCard();
});

/**
 * Set yxt-Card--pinFocused when any HTML <a> element on the card gains focus.
 * These include cards titles and CTAs
 */
this._container.querySelectorAll('a').forEach((el) => {
  el.addEventListener('focus', () => {
    const index = getIndexOfThisCard();
    storeCardFocusIndex(index);
    removePinFocusFromAllCards();
    addPinFocusToThisCard();
  })
});
