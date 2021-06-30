import analyticsListener from './runtime-config-listeners/analytics';
import sessionTrackingListener from './runtime-config-listeners/session-tracking';

/**
 * Responsible for registering listeners to a runtime config object
 */
export default class RuntimeConfigListenerRegistrant {
  constructor(runtimeConfig) {
    this._runtimeConfig = runtimeConfig;
  }

  registerListeners() {
    this._runtimeConfig.registerListener(analyticsListener);
    this._runtimeConfig.registerListener(sessionTrackingListener);
  }
}