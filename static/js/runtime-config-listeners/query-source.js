/**
 * @type {import('../runtime-config.js').RuntimeConfigListener}
 */
 export default {
  key: 'querySource',
  callback: value => {
    ANSWERS.setQuerySource(value);
  }
}