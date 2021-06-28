import { ClientFunction } from 'testcafe';

/**
 * Provides interaction with the runtime config.
 */
class RuntimeConfigWrapper {
  constructor({ isParent = false }) {
    /**
     * If true, indicates that the runtimeConfig is on a parent site of an 
     * Answers iframe integration.
     */
    this._isParent = isParent;
  }
  /**
   * Sets a value of the runtime config
   * @param {string} key 
   * @param {*} value 
   */
  async set(key, value) {
    await ClientFunction((key, value, isParent) => {
      if (isParent) {
        AnswersExperienceFrame.runtimeConfig.set(key, value);
      } else {
        AnswersExperience.runtimeConfig.set(key, value);
      }
    })(key, value, this._isParent);
  }

  /**
   * Gets a value of the runtime config
   * @param {string} key 
   * @returns {*}
   */
  async get(key) {
    return ClientFunction((key, isParent) => {
      if (isParent) {
        return AnswersExperienceFrame.runtimeConfig.get(key);
      } else {
        return AnswersExperience.runtimeConfig.get(key);
      }
    })(key, this._isParent);
  }
}

export default RuntimeConfigWrapper;