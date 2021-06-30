import { canonicalizeBoolean } from '../utils';

export default {
  key: 'analyticsEventsEnabled',
  callback: value => {
    window.AnswersExperience.AnswersInitializedPromise
      .then(() => {
        const canonicalizedValue = canonicalizeBoolean(value);
        console.log(canonicalizedValue);
        ANSWERS.setAnalyticsOptIn(canonicalizedValue);
      })
      .catch(err => console.warn(err));
  }
};