/**
 * @type {import('../runtime-config.js').RuntimeConfigListener}
 */
export default {
  key: 'analyticsEventsEnabled',
  valueType: 'boolean',
  callback: value => {
    ANSWERS.setAnalyticsOptIn(value);
  }
};