import { isStaging } from './is-staging';

/**
 * Gets the prop specified by the propPath from the JAMBO_INJECTED_DATA,
 * under the given experienceKey.
 * 
 * Will first choose the correct config, based on whether the browser
 * is a STAGING or PRODUCTION environment, under
 * JAMBO_INJECTED_DATA.answers.experiences[experienceKey].configByLabel.
 * Defaults to the top-level config at
 * JAMBO_INJECTED_DATA.answers.experiences[experienceKey] if configByLabel
 * does not exist.
 * 
 * @param {string} experienceKey 
 * @param {Array<string>} propPath
 * @returns {any}
 */
export function getInjectedProp(experienceKey, propPath) {
  const injectedData = JSON.parse(process.env.JAMBO_INJECTED_DATA || '{}');
  const experiences = injectedData?.answers?.experiences;
  if (!experiences || !experiences[experienceKey]) {
    return undefined;
  }
  const currentConfig = getConfigForCurrentDomain(injectedData, experiences[experienceKey]);
  let propAccumulator = currentConfig;
  for (const propName of propPath) {
    if (!propAccumulator.hasOwnProperty(propName)) {
      return undefined;
    }
    propAccumulator = propAccumulator[propName];
  }
  return propAccumulator;
}

/**
 * Chooses the STAGING or PRODUCTION config, defaulting to the top level config
 * if configByLabel does not exist, or if the desired config does not exist.
 *
 * @param {Object} injectedData 
 * @param {Object} experienceConfig
 * @returns {Object}
 */
function getConfigForCurrentDomain(injectedData, experienceConfig) {
  const IS_STAGING = isStaging(injectedData?.pages?.domains);
  const { configByLabel } = experienceConfig;
  if (!configByLabel) {
    return experienceConfig;
  }
  return (IS_STAGING ? configByLabel.STAGING : configByLabel.PRODUCTION) || experienceConfig;
}
