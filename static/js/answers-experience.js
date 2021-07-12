import DeferredPromise from './deferred-promise';
import analyticsListener from './runtime-config-listeners/analytics';
import sessionTrackingListener from './runtime-config-listeners/session-tracking';
import querySourceListener from './runtime-config-listeners/query-source';

/**
 * @typedef {import('./runtime-config.js').RuntimeConfigListener} RuntimeConfigListener
 */

export default class AnswersExperience {
  constructor (runtimeConfig) {
    this.runtimeConfig = runtimeConfig;
    this.AnswersInitializedPromise = new DeferredPromise();
    this._runtimeConfigListeners = [
      analyticsListener,
      sessionTrackingListener,
      querySourceListener
    ];

    this._registerRuntimeConfigListeners();
  }

  /**
   * Registers runtime config listeners and ensures that they execute
   * after Answers has initialized
   */
  _registerRuntimeConfigListeners() {
    this._runtimeConfigListeners
      .map(listener => {
        return this._makeListenerWaitForAnswersInit(listener);
      })
      .forEach(listener => {
        this.runtimeConfig.registerListener(listener);
      });
  }

  /**
   * Creates a RuntimeConfigListener which will wait for Answers initialization before
   * executing its callback
   * @param {RuntimeConfigListener} listener
   * @returns {RuntimeConfigListener}
   */
  _makeListenerWaitForAnswersInit (listener) {
    return {
      ...listener,
      callback: value => {
        this.AnswersInitializedPromise.then(() => {
          listener.callback(value);
        });
      },
    }
  }
}
