import { getInjectedProp } from '../../../static/js/get-injected-prop';
import { isStaging } from '../../../static/js/is-staging';
jest.mock('../../../static/js/is-staging.js');

let topLevelConfig, productionConfig, stagingConfig;
beforeEach(() => {
  stagingConfig = {
    apiKey: 'staging-api-key',
    verticals: {
      mockVertical: {
        displayName: 'staging-display-name',
        source: 'KNOWLEDGE_MANAGER'
      }
    }
  };
  productionConfig = {
    apiKey: 'production-api-key',
    verticals: {
      mockVertical: {
        displayName: 'production-display-name',
        source: 'KNOWLEDGE_MANAGER'
      }
    }
  };
  topLevelConfig = {
    apiKey: 'top-level-api-key',
    verticals: {
      mockVertical: {
        displayName: 'top-level-display-name',
        source: 'KNOWLEDGE_MANAGER'
      }
    }
  };
  mockInjectedExperienceConfig({
    ...topLevelConfig,
    configByLabel: {
      STAGING: stagingConfig,
      PRODUCTION: productionConfig
    }
  });
});

describe('getInjectedProp()', () => {
  it('returns undefined when no matching experience key found', () => {
    expect(getInjectedProp('unknownKey')).toEqual(undefined);
  });

  it('will use configByLabel.PRODUCTION when isStaging() returns false', () => {
    isStaging.mockImplementationOnce(() => false);
    const injectedDisplayName = getInjectedProp('mockExperience', ['verticals', 'mockVertical', 'displayName']);
    expect(injectedDisplayName).toEqual('production-display-name');
  });

  it('will use configByLabel.STAGING when isStaging() returns true', () => {
    isStaging.mockImplementationOnce(() => true);
    const injectedDisplayName = getInjectedProp('mockExperience', ['verticals', 'mockVertical', 'displayName']);
    expect(injectedDisplayName).toEqual('staging-display-name');
  });

  it('will default to top level config when configByLabel is not found', () => {
    mockInjectedExperienceConfig(topLevelConfig);
    const injectedDisplayName = getInjectedProp('mockExperience', ['verticals', 'mockVertical', 'displayName']);
    expect(injectedDisplayName).toEqual('top-level-display-name');
  });

  it('will return undefined when no JAMBO_INJECTED_DATA is set', () => {
    process.env.JAMBO_INJECTED_DATA = null;
    const injectedDisplayName = getInjectedProp('mockExperience', ['verticals', 'mockVertical', 'displayName']);
    expect(injectedDisplayName).toEqual(undefined);
  });

  it('will return undefined if a value in the propPath is not found', () => {
    const injectedDisplayName = getInjectedProp('mockExperience', ['verticals', 'mockVertical', 'a', 'b', 'c']);
    expect(injectedDisplayName).toEqual(undefined);
  });
});

function mockInjectedExperienceConfig(experienceConfig) {
  const mockJamboInjectedData = {
    answers: {
      experiences: {
        mockExperience: experienceConfig
      }
    }
  };
  process.env.JAMBO_INJECTED_DATA = JSON.stringify(mockJamboInjectedData)
}