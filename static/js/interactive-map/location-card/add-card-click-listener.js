this._container.parentElement.addEventListener('click', () => {
  const { _index } = JSON.parse(this._container.parentElement.dataset.opts || {});
  this.core.storage.set(HitchhikerJS.StorageKeys.LOCATOR_CARD_CLICK, { index: _index });

  document.querySelectorAll('.yxt-Card--pinClicked').forEach((el) => {
    el.classList.remove('yxt-Card--pinClicked');
  });

  this._container.parentElement.classList.add('yxt-Card--pinClicked');
});
