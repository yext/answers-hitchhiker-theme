const hbs = require('handlebars');
import shallowMergeConfig from '../../hbshelpers/shallowMergeConfig';

hbs.registerHelper('shallowMergeConfig', shallowMergeConfig);

it('performs a shallowMergeConfig', () => {
    const context = hbs.compile('{{#shallowMergeConfig}}[{"a": "7"}, {"a": 2}, {"b": 3}, {"c": 4}]{{/shallowMergeConfig}}');
    expect(context()).toEqual(JSON.stringify({"a":2,"b":3,"c":4}));
});
    
it('performs shallowMergeConfig on 1 element', () => {
    const template = hbs.compile('{{#shallowMergeConfig}}{"a": "7"}{{/shallowMergeConfig}}');
    expect(template()).toEqual(JSON.stringify({"a": "7"}));
});
    
    
it('performs shallowMergeConfig on 0 elements', () => {
    const template = hbs.compile('{{#shallowMergeConfig}}{}{{/shallowMergeConfig}}');
    expect(template()).toEqual(JSON.stringify({}));
});
  