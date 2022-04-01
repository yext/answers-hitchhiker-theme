import getCleanedJamboInjectedData from '../../../static/webpack/getCleanedJamboInjectedData';

describe('secures the injected data', () => {
  const sampleConfig = {
    apiKey: 999,
    verticals: {
      KM: {
        displayName: 'Locations',
        source: 'KNOWLEDGE_MANAGER'
      }
    }
  };
  
  const mockInjectedData = {
    businessId: 999,
    answers: {
      experiences: {
        test_experience: {
          ...sampleConfig,
          configByLabel: {
            PRODUCTION: sampleConfig,
            STAGING: sampleConfig
          }
        }
      }
    }
  };
  
  it('removes instances of the apiKey', () => {
     const securedInjectedData = getCleanedJamboInjectedData(mockInjectedData);
     expect(securedInjectedData).toEqual(expect.not.objectContaining({apiKey: 999}));
  });
});

