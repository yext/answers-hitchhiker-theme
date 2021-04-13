const fs = require('fs');
const path = require('path');
const hbs = require('../../test-utils/hbs');

const compiledTemplate = getCompiledUniversalResultsTemplate();
hbs.registerHelper('read', () => {
  return 'mock universal section template'
});

describe('uses relativePath correctly', () => {
  describe('with url set in a vertical page\'s verticalsToConfig', () => {
    const templateData = {
      relativePath: '../..',
      global_config: {
        experienceKey: 'mockExperienceKey',
      },
      verticalConfigs: {
        people: {
          verticalKey: 'people',
          verticalsToConfig: {
            people: {
              url: 'vtc-url.html',
              iconUrl: 'static/assets/icon.gif',
              viewAllText: 'test view all'
            }
          }
        }
      }
    };
    const peopleConfig = evalComponentConfig(templateData).config.people;

    it('verticalPages and url', () => {
      expect(peopleConfig.verticalPages).toEqual([{
        verticalKey: 'people',
        url: '../../vtc-url.html',
      }]);
      expect(peopleConfig.url).toEqual('../../vtc-url.html');
    });

    it('sectionTitleIconUrl', () => {
      expect(peopleConfig.sectionTitleIconUrl).toEqual('../../static/assets/icon.gif');
    });
  });

  it('with url set in a vertical page\'s top level config', () => {
    const templateData = {
      relativePath: '../..',
      global_config: {
        experienceKey: 'mockExperienceKey',
      },
      verticalConfigs: {
        people: {
          url: 'page-path.html',
          verticalKey: 'people',
          verticalsToConfig: {
            people: {
              viewAllText: 'test view all'
            }
          }
        }
      }
    };
    const peopleConfig = evalComponentConfig(templateData).config.people;
    expect(peopleConfig.verticalPages).toEqual([{
      verticalKey: 'people',
      pageUrl: '../../page-path.html',
    }]);
    expect(peopleConfig.url).toEqual('../../page-path.html');
  });

  it('will default url to {{pageName}}.html', () => {
    const templateData = {
      relativePath: '../..',
      global_config: {
        experienceKey: 'mockExperienceKey',
      },
      verticalConfigs: {
        people: {
          verticalKey: 'people',
          verticalsToConfig: {
            people: {
              viewAllText: 'test view all'
            }
          }
        }
      }
    };
    const peopleConfig = evalComponentConfig(templateData).config.people;
    expect(peopleConfig.verticalPages).toEqual([{
      verticalKey: 'people',
      url: 'people.html',
    }]);
    expect(peopleConfig.url).toEqual('people.html');
  });
});

describe('handles verticalLabel correctly', () => {
  it('lets you override verticalLabel', () => {
    const templateData = {
      global_config: {
        experienceKey: 'mockExperienceKey',
      },
      verticalConfigs: {
        people: {
          verticalKey: 'people',
          verticalsToConfig: {
            people: {
              label: 'overridden!',
              viewAllText: 'test view all'
            }
          }
        }
      }
    }
    const peopleConfig = evalComponentConfig(templateData).config.people;
    expect(peopleConfig.sectionTitle).toEqual('overridden!');
  });

  it('will use HitchhikerJS.getInjectedProp by default', () => {
    const templateData = {
      global_config: {
        experienceKey: 'mockExperienceKey',
      },
      verticalConfigs: {
        people: {
          verticalKey: 'people',
          verticalsToConfig: {
            people: {
              viewAllText: 'test view all'
            }
          }
        }
      }
    }
    const mockGetInjectedProp = jest.fn(() => 'injected vertical label');
    const peopleConfig = evalComponentConfig(templateData, mockGetInjectedProp).config.people;
    expect(mockGetInjectedProp).toHaveBeenLastCalledWith('mockExperienceKey', ['verticals', 'people', 'displayName']);
    expect(peopleConfig.sectionTitle).toEqual('injected vertical label');
  });

  it('will use verticalKey if no injected verticalLabel', () => {
    const templateData = {
      global_config: {
        experienceKey: 'mockExperienceKey',
      },
      verticalConfigs: {
        people: {
          verticalKey: 'peopleKey',
          verticalsToConfig: {
            peopleKey: {
              viewAllText: 'test view all'
            }
          }
        }
      }
    }
    const mockGetInjectedProp = jest.fn(() => null);
    const peopleConfig = evalComponentConfig(templateData, mockGetInjectedProp).config.peopleKey;
    expect(mockGetInjectedProp).toHaveBeenLastCalledWith('mockExperienceKey', ['verticals', 'peopleKey', 'displayName']);
    expect(peopleConfig.sectionTitle).toEqual('peopleKey');
  });
});

function evalComponentConfig(templateData, mockGetInjectedProp) {
  const output = compiledTemplate(templateData);
  const ANSWERS = {
    addComponent: jest.fn()
  };
  const HitchhikerJS = {
    getInjectedProp: mockGetInjectedProp || jest.fn()
  };
  eval(output);
  const componentConfig = ANSWERS.addComponent.mock.calls[0][1];
  return componentConfig;
}

function getCompiledUniversalResultsTemplate() {
  const universalResultsPath =
    path.resolve(__dirname, '../../../templates/universal-standard/script/universalresults.hbs');
  const universalResultsTemplate = fs.readFileSync(universalResultsPath, 'utf-8');
  return hbs.compile(universalResultsTemplate);
}