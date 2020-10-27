window.shrinkOverlay = function () {
  const bodyEl = document.querySelector('body');

  if (bodyEl) {
    bodyEl.classList.add('shorter');
    bodyEl.classList.remove('taller');
  }
}

window.growOverlay = function () {
  {{#unless componentSettings.SearchBar.redirectUrl}}
  const bodyEl = document.querySelector('body');

  if (bodyEl) {
    bodyEl.classList.add('taller');
    bodyEl.classList.remove('shorter');
  }
  {{/unless}}
}

window.collapseOverlay = function () {
  const bodyEl = document.querySelector('body');

  if (bodyEl) {
    bodyEl.classList.add('collapsed');
    bodyEl.classList.remove('expanded');
  }
}

window.expandOverlay = function (isMobile) {
  const bodyEl = document.querySelector('body');

  if (bodyEl) {
    bodyEl.classList.remove('collapsed');
    bodyEl.classList.add('expanded');

    if (bodyEl.classList.contains('shorter') && !isMobile) {
      const inputEl = document.querySelector('.js-yext-query');
      inputEl && inputEl.focus();
    }
  }
}
