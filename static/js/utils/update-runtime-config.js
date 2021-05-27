import { RuntimeConfig } from '../runtime-config';

/**
 * Updates the experience's RuntimeConfig object such that it contains the provided data
 *
 * @param {Object} config 
 */
export default function updateRuntimeConfig (config) {
  const runtimeConfig = window.AnswersExperience.runtimeConfig;
  if (runtimeConfig) {
    runtimeConfig.setAll(config);
  } else {
    window.AnswersExperience.runtimeConfig = new RuntimeConfig(config);
  }
}