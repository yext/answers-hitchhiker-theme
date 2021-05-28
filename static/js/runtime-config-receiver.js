/**
 * Responsible for handling runtime config messages from the parent
 */
 export default class RuntimeConfigReceiver {
  /**
   * Updates the experience's runtime config to include the data provided by the received config
   * @param {Object} config An object representation of the runtime config.
   *                        (Not the data model with getters and setters)
   */
  static handle (config) {
    Object.entries(config).forEach(([key, value]) => {
      window.AnswersExperience.runtimeConfig.set(key, value);
    });
  }
}