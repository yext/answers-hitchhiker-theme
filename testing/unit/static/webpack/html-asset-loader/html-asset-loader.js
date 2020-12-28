import HtmlAssetLoader from '../../../../static/webpack/html-asset-loader';
const fs = require('fs');
const path = require('path');

it('works inside ANSWERS.registerTemplate() calls using relativePath', () => {
  const { source, output } = getFixture('registerTemplate');
  const actualOutput = HtmlAssetLoader.call({}, source);
  expect(actualOutput).toEqual(output);
});

it('works for static assets in string in js', () => {
  const { source, output } = getFixture('stringInJs');
  const actualOutput = HtmlAssetLoader.call({}, source);
  expect(actualOutput).toEqual(output);
});

it('works for static assets in regular html', () => {
  const { source, output } = getFixture('htmlAttribute');
  const actualOutput = HtmlAssetLoader.call({}, source);
  expect(actualOutput).toEqual(output);
});

it('works for static assets specified using single quotes', () => {
  const { source, output } = getFixture('singleQuotes');
  const actualOutput = HtmlAssetLoader.call({}, source);
  expect(actualOutput).toEqual(output);
});

/**
 * Returns the source string (from html-loader), and the output we expect
 * html-asset-loader to create from it.
 * 
 * @param {string} fixtureName
 * @returns {{{source: string, output: string}}}
 */
function getFixture(fixtureName) {
  const srcPath = path.resolve(__dirname, 'fixtures', 'source', fixtureName + '.js');
  const outputPath = path.resolve(__dirname, 'fixtures', 'output', fixtureName + '.js');
  return {
    source: fs.readFileSync(srcPath, 'utf-8'),
    output: fs.readFileSync(outputPath, 'utf-8')
  }
}