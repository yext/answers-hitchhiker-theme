const fs = require('fs');
const path = require('path');
const hbs = require('../../test-utils/hbs');

const universalResultsPath =
  path.resolve(__dirname, '../../../templates/universal-standard/script/universalresults.hbs');
const universalResultsTemplate = fs.readFileSync(universalResultsPath, 'utf-8');
const compiledTemplate = hbs.compile(universalResultsTemplate);

hbs.registerHelper('read', () => {
  return 'mock universal section template'
});

describe('uses relativePath correctly', () => {
  describe('with url set in a vertical page\'s verticalsToConfig', () => {
    const templateData = {
      relativePath: '../..',
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
    const output = compiledTemplate(templateData);
    const ANSWERS = {
      addComponent: jest.fn()
    };
    eval(output);
    const componentConfig = ANSWERS.addComponent.mock.calls[0][1];
    const peopleConfig = componentConfig.config.people;
  
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
    const output = compiledTemplate(templateData);
    const ANSWERS = {
      addComponent: jest.fn()
    };
    eval(output);
    const componentConfig = ANSWERS.addComponent.mock.calls[0][1];
    const peopleConfig = componentConfig.config.people;
  
    expect(peopleConfig.verticalPages).toEqual([{
      verticalKey: 'people',
      pageUrl: '../../page-path.html',
    }]);
    expect(peopleConfig.url).toEqual('../../page-path.html');
  });

  it('will default url to {{pageName}}.html', () => {
    const templateData = {
      relativePath: '../..',
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
    const output = compiledTemplate(templateData);
    const ANSWERS = {
      addComponent: jest.fn()
    };
    eval(output);
    const componentConfig = ANSWERS.addComponent.mock.calls[0][1];
    const peopleConfig = componentConfig.config.people;
  
    expect(peopleConfig.verticalPages).toEqual([{
      verticalKey: 'people',
      url: 'people.html',
    }]);
    expect(peopleConfig.url).toEqual('people.html');
  });
});
