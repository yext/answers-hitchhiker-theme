import { isStaging } from './is-staging';

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

function getConfigForCurrentDomain(injectedData, experienceConfig) {
  const IS_STAGING = isStaging(injectedData?.pages?.domains);
  const { configByLabel } = experienceConfig;
  if (!configByLabel) {
    return experienceConfig;
  }
  return (IS_STAGING ? configByLabel.STAGING : configByLabel.PRODUCTION) || experienceConfig;
}
