import updateRuntimeConfig from './utils/update-runtime-config';

/**
 * Responsible for handling updated runtime config objects
 */
export default class RuntimeConfigReceiver {
  static handle (configReceived) {
    // Due to the async nature of the iframe resizer messaging, ensure
    // that we only update the runtime config if it is more recent than the last one
    const lastUpdated = window.RuntimeConfig?.lastUpdated ?? -1;
    const messageContainsNewRuntimeConfig = configReceived?.lastUpdated >= lastUpdated;
    
    if (!messageContainsNewRuntimeConfig) {
      return;
    }
    
    if (configReceived.initAnswersExperience) {
      initAnswersExperience(configReceived);
    } else {
      updateRuntimeConfig(configReceived);
    }
  }
}