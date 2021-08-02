const hbs = require('../test-utils/hbs');

it('removes line comments', () => {
    const template = hbs.compile(`
    {{#stripJsComments}}
    // Remove me
    {{/stripJsComments}}`);
    expect(template().trim()).toEqual('');
});
    
it('removes block comments', () => {
  const template = hbs.compile(`
  {{#stripJsComments}}
  /**
   * 
   * what's up
   */
  {{/stripJsComments}}`);
  expect(template().trim()).toEqual('');
});
