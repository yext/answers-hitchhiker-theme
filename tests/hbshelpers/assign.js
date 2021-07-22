const hbs = require('handlebars');
import assign from '../../hbshelpers/assign';

hbs.registerHelper('assign', assign);

  it('performs an assign', () => {
    const context = hbs.compile('{{#assign}}[{"a": "7"}, {"a": 2}, {"b": 3}, {"c": 4}]{{/assign}}');
    expect(context()).toEqual(JSON.stringify({"a":2,"b":3,"c":4}));
  });
  
  it('performs assign on 1 element', () => {
    const template = hbs.compile('{{#assign}}{"a": "7"}{{/assign}}');
    expect(template()).toEqual(JSON.stringify({"a": "7"}));
  });
  
  
  it('performs assign on 0 elements', () => {
    const template = hbs.compile('{{#assign}}{}{{/assign}}');
    expect(template()).toEqual(JSON.stringify({}));
  });
  