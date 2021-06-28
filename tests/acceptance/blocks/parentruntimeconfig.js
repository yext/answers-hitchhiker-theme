import { ClientFunction } from 'testcafe';

/**
 * Provides interaction with the runtime config located in the AnswersExperienceFrame
 */
class ParentRuntimeConfig {
  /**
   * Sets a value of the runtime config
   * @param {string} key 
   * @param {*} value 
   */
  async set(key, value) {
    await ClientFunction((key, value) => {
      AnswersExperienceFrame.runtimeConfig.set(key, value);
    })(key, value);
  }

  /**
   * Gets a value of the runtime config
   * @param {string} key 
   * @returns {*}
   */
  async get(key) {
    return await ClientFunction((key) => {
      return AnswersExperienceFrame.runtimeConfig.get(key);
    })(key);
  }
}

export default new ParentRuntimeConfig();