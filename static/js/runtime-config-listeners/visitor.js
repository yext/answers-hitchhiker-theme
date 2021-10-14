/**
 * @type {import('../runtime-config.js').RuntimeConfigListener}
 */
 export default {
  key: 'visitor',
  callback: value => {
    ANSWERS.setVisitor(value);
  }
}