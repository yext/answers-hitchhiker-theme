/**
 * @type {import('../runtime-config.js').RuntimeConfigListener}
 */
 export default {
  key: 'visitor',
  callback: value => {
    // console.error('called');
    ANSWERS.setVisitor(value);
  }
}