/**
 * @type {import('../runtime-config.js').RuntimeConfigListener}
 */
 export default {
  key: 'customPrompts',
  callback: value => {
    ANSWERS.components.getActiveComponents('AutoComplete')
      .filter(c => c.name === 'SearchBar.autocomplete')
      .forEach(autocompleteComponent => autocompleteComponent.setCustomPrompts(value));
  }
}