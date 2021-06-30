export default {
  key: 'analyticsEventsEnabled',
  valueType: 'boolean',
  callback: value => {
    ANSWERS.setAnalyticsOptIn(value);
  }
};