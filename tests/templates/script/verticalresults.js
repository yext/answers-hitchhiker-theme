const fs = require('fs');
const path = require('path');
const hbs = require('../../test-utils/hbs');

const pageTemplates = [
  'vertical-grid',
  'vertical-standard',
  'vertical-map'
];

for (const pageTemplate of pageTemplates) {
  const templatePath = path.resolve(__dirname, `../../../templates/${pageTemplate}/script/verticalresults.hbs`);
  const verticalResultsConfigTemplate = fs.readFileSync(templatePath, 'utf-8');
  const compiledTemplate = hbs.compile(verticalResultsConfigTemplate);

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
      const output = compiledTemplate(templateData);
      const ANSWERS = {
        addComponent: jest.fn()
      };
      eval(output);
      const componentConfig = ANSWERS.addComponent.mock.calls[0][1];
      const verticalPage = componentConfig.verticalPages[0];
  
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
      const output = compiledTemplate(templateData);
      const ANSWERS = {
        addComponent: jest.fn()
      };
      eval(output);
      const componentConfig = ANSWERS.addComponent.mock.calls[0][1];
      const verticalPage = componentConfig.verticalPages[0];
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
      const output = compiledTemplate(templateData);
      const ANSWERS = {
        addComponent: jest.fn()
      };
      eval(output);
      const componentConfig = ANSWERS.addComponent.mock.calls[0][1];
      const verticalPage = componentConfig.verticalPages[0];
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
        const output = compiledTemplate(templateData);
        const ANSWERS = {
          addComponent: jest.fn()
        };
        eval(output);
        const componentConfig = ANSWERS.addComponent.mock.calls[0][1];
        const verticalPage = componentConfig.verticalPages[0];
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
        const output = compiledTemplate(templateData);
        const ANSWERS = {
          addComponent: jest.fn()
        };
        eval(output);
        const componentConfig = ANSWERS.addComponent.mock.calls[0][1];
        const verticalPage = componentConfig.verticalPages[0];
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
        const output = compiledTemplate(templateData);
        const ANSWERS = {
          addComponent: jest.fn()
        };
        eval(output);
        const componentConfig = ANSWERS.addComponent.mock.calls[0][1];
        const verticalPage = componentConfig.verticalPages[0];
        expect(verticalPage.url).toEqual('index.html');
      });
    });
  });
}