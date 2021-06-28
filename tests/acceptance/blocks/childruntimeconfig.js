import { ClientFunction } from 'testcafe';

/**
 * Provides interaction with the runtime config located in the AnswersExperience
 */
class ChildRuntimeConfig {
  /**
   * Sets a value of the runtime config
   * @param {string} key 
   * @param {*} value 
   */
  async set(key, value) {
    await ClientFunction((key, value) => {
      AnswersExperience.runtimeConfig.set(key, value);
    })(key, value);
  }

  /**
   * Gets a value of the runtime config
   * @param {string} key 
   * @returns {*}
   */
  async get(key) {
    return await ClientFunction((key) => {
      return AnswersExperience.runtimeConfig.get(key);
    })(key);
  }
}

export default new ChildRuntimeConfig();