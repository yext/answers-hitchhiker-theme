/**
 * @type {import('../runtime-config.js').RuntimeConfigListener}
 */
 export default {
  key: 'customPrompts',
  callback: value => {
    ANSWERS.components._activeComponents
      .filter(component => component.name === 'SearchBar.autocomplete')
      .forEach(autocompleteComponent => autocompleteComponent.setCustomPrompts(value));
  }
}