const fs = require('fs');
const path = require('path');
const hbs = require('../../test-utils/hbs');

const pageTemplates = [
  'vertical-grid',
  'vertical-standard',
  'vertical-map',
  'vertical-full-page-map'
];

const tempToVertPath = 'templates/common-partials/script/verticalresults';
const partialPath = path.resolve(__dirname, `../../../${tempToVertPath}.hbs`);
hbs.registerPartial(tempToVertPath, fs.readFileSync(partialPath, 'utf-8'));

for (const pageTemplate of pageTemplates) {
  const compiledTemplate = getCompiledVerticalResultsTemplate(pageTemplate);

  describe(`uses relativePath correctly (${pageTemplate})`, () => {
    describe('for vertical pages with url at the top level page config', () => {
      const templateData = {
        relativePath: '../..',
        verticalConfigs: {
          people: {
            url: 'top-level.html',
            verticalKey: 'people',
            verticalsToConfig: {
              people: {
                iconUrl: 'static/assets/icon.gif'
              }
            }
          }
        }
      };
      const verticalPage = evalComponentConfig(compiledTemplate, templateData).verticalPages[0];
  
      it('iconUrl correctly uses relativePath', () => {
        expect(verticalPage.iconUrl).toEqual('../../static/assets/icon.gif');
      });
  
      it('url correctly uses relativePath', () => {
        expect(verticalPage.url).toEqual('../../top-level.html');
      });
    });
  
    it('for vertical pages with url inside verticalsToConfig', () => {
      const templateData = {
        relativePath: '../..',
        verticalConfigs: {
          people: {
            verticalKey: 'people',
            verticalsToConfig: {
              people: {
                url: 'vtc.html'
              }
            }
          }
        }
      };
      const verticalPage = evalComponentConfig(compiledTemplate, templateData).verticalPages[0];
      expect(verticalPage.url).toEqual('../../vtc.html');
    });
  
    it('defaults to {{pageName}}.html', () => {
      const templateData = {
        relativePath: '../..',
        verticalConfigs: {
          people: {
            verticalKey: 'people',
            verticalsToConfig: {
              people: {}
            }
          }
        }
      };
      const verticalPage = evalComponentConfig(compiledTemplate, templateData).verticalPages[0];
      expect(verticalPage.url).toEqual('people.html');
    });
  
    describe('for universal pages', () => {
      it('works when url is at the top level page config', () => {
        const templateData = {
          relativePath: '../..',
          verticalConfigs: {
            index: {
              url: 'index-page.html',
              verticalsToConfig: {
                Universal: {}
              }
            }
          }
        };
        const verticalPage = evalComponentConfig(compiledTemplate, templateData).verticalPages[0];
        expect(verticalPage.url).toEqual('../../index-page.html');
      });
  
      it('works when url is in verticalsToConfig', () => {
        const templateData = {
          relativePath: '../..',
          verticalConfigs: {
            index: {
              verticalsToConfig: {
                Universal: {
                  url: 'index-page-vtc.html'
                }
              }
            }
          }
        };
        const verticalPage = evalComponentConfig(compiledTemplate, templateData).verticalPages[0];
        expect(verticalPage.url).toEqual('../../index-page-vtc.html');
      });
  
      it('defaults to {{pageName}}.html', () => {
        const templateData = {
          relativePath: '../..',
          verticalConfigs: {
            index: {
              verticalsToConfig: {
                Universal: {}
              }
            }
          }
        };
        const verticalPage = evalComponentConfig(compiledTemplate, templateData).verticalPages[0];
        expect(verticalPage.url).toEqual('index.html');
      });
    });
  });

  describe(`handles verticalLabel correctly (${pageTemplate})`, () => {
    it('allows users to override the label', () => {
      const templateData = {
        verticalConfigs: {
          people: {
            verticalKey: 'peopleKey',
            verticalsToConfig: {
              peopleKey: {
                label: 'overridden label!'
              }
            }
          }
        }
      };
      const verticalPage = evalComponentConfig(compiledTemplate, templateData, jest.fn()).verticalPages[0];
      expect(verticalPage.label).toEqual('overridden label!');
    });

    it('will use HitchhikerJS.getInjectedProp by default', () => {
      const templateData = {
        global_config: {
          experienceKey: 'mockExperienceKey',
        },
        verticalConfigs: {
          people: {
            verticalKey: 'peopleKey',
            verticalsToConfig: {
              peopleKey: {}
            }
          }
        }
      }
      const mockGetInjectedProp = jest.fn(() => 'injected vertical label');
      const verticalPage = evalComponentConfig(compiledTemplate, templateData, mockGetInjectedProp).verticalPages[0];
      expect(mockGetInjectedProp).toHaveBeenLastCalledWith('mockExperienceKey', ['verticals', 'peopleKey', 'displayName']);
      expect(verticalPage.label).toEqual('injected vertical label');
    });

    it('will default to verticalKey if no injected vertical label', () => {
      const templateData = {
        global_config: {
          experienceKey: 'mockExperienceKey',
        },
        verticalConfigs: {
          people: {
            verticalKey: 'peopleKey',
            verticalsToConfig: {
              peopleKey: {}
            }
          }
        }
      }
      const mockGetInjectedProp = jest.fn(() => undefined);
      const verticalPage = evalComponentConfig(compiledTemplate, templateData, mockGetInjectedProp).verticalPages[0];
      expect(mockGetInjectedProp).toHaveBeenLastCalledWith('mockExperienceKey', ['verticals', 'peopleKey', 'displayName']);
      expect(verticalPage.label).toEqual('peopleKey');
    });

    it('will use label for universal pages', () => {
      const templateData = {
        global_config: {
          experienceKey: 'mockExperienceKey',
        },
        verticalConfigs: {
          index: {
            verticalsToConfig: {
              Universal: {
                label: 'universal label'
              }
            }
          }
        }
      }
      const mockGetInjectedProp = jest.fn(() => undefined);
      const verticalPage = evalComponentConfig(compiledTemplate, templateData, mockGetInjectedProp).verticalPages[0];
      expect(mockGetInjectedProp).toHaveBeenCalledTimes(0);
      expect(verticalPage.label).toEqual('universal label');
    });
  });
}

function evalComponentConfig(compiledTemplate, templateData, mockGetInjectedProp) {
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

function getCompiledVerticalResultsTemplate(pageTemplate) {
  const templatePath = path.resolve(__dirname, `../../../templates/${pageTemplate}/script/verticalresults.hbs`);
  const verticalResultsConfigTemplate = fs.readFileSync(templatePath, 'utf-8');
  return hbs.compile(verticalResultsConfigTemplate);
}