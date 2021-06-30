export default {
  key: 'sessionTrackingEnabled',
  valueType: 'boolean',
  callback: value => {
    ANSWERS.setSessionsOptIn(value);
  }
}