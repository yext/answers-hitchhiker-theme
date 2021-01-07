const fs = require('fs');
const path = require('path');
const hbs = require('../../test-utils/hbs');

const pageTemplates = [
  'universal-standard',
  'vertical-grid',
  'vertical-standard',
  'vertical-map'
];

for (const pageTemplate of pageTemplates) {
  const templatePath = path.resolve(__dirname, `../../../templates/${pageTemplate}/script/navigation.hbs`);
  const navigationConfigTemplate = fs.readFileSync(templatePath, 'utf-8');
  const compiledTemplate = hbs.compile(navigationConfigTemplate);

  describe(`uses relativePath correctly (${pageTemplate})`, () => {
    describe('with url set in a vertical page\'s verticalsToConfig', () => {
      const templateData = {
        relativePath: '../..',
        verticalConfigs: {
          people: {
            verticalKey: 'people',
            verticalsToConfig: {
              people: {
                url: 'vtc.html',
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

    it('with url set in a vertical page\'s top level config', () => {
      const templateData = {
        relativePath: '../..',
        verticalConfigs: {
          people: {
            url: 'top-level.html',
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
      expect(verticalPage.url).toEqual('../../top-level.html');
    });

    it('will default url to {{pageName}}.html', () => {
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
  });
}