import DeferredPromise from './deferred-promise';

export default class AnswersExperience {
  constructor (runtimeConfig) {
    this.runtimeConfig = runtimeConfig;
    this.AnswersInitializedPromise = new DeferredPromise();
  }
}
