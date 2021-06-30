import { canonicalizeBoolean } from '../utils';

export default {
  key: 'sessionTrackingEnabled',
  callback: value => {
    window.AnswersExperience.AnswersInitializedPromise
      .then(() => {
        const canonicalizedValue = canonicalizeBoolean(value);
        console.log(canonicalizedValue);
        ANSWERS.setSessionsOptIn(canonicalizedValue);
      })
      .catch(err => console.warn(err));
  }
}