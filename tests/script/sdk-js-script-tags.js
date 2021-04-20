const fs = require('fs');
const path = require('path');
const hbs = require('../test-utils/hbs');

const defaultOutput = `<script
  src="https://assets.sitescdn.net/answers/v1.8/answers-modern.min.js"
  type="module"
  onload="initAnswers()"
></script>
<script
  src="https://assets.sitescdn.net/answers/v1.8/answers.min.js"
  nomodule
  onload="initAnswers()"
  defer
></script>`;

const jaOutput = `<script
  src="https://assets.sitescdn.net/answers/v1.8/ja-answers-modern.min.js"
  type="module"
  onload="initAnswers()"
></script>
<script
  src="https://assets.sitescdn.net/answers/v1.8/ja-answers.min.js"
  nomodule
  onload="initAnswers()"
  defer
></script>`;

it('creates correct tags for en', () => {
  const templateData = {
    sdkVersion: '1.8',
    locale: 'en'
  }
  expect(buildScriptTags(templateData)).toEqual(defaultOutput);
});

it('creates correct tags for ja', () => {
  const templateData = {
    sdkVersion: '1.8',
    locale: 'ja'
  }
  expect(buildScriptTags(templateData)).toEqual(jaOutput);
});

function buildScriptTags(data) {
  const templatePath = path.resolve(__dirname, '../../script/sdk-js-script-tags.hbs');
  const template = fs.readFileSync(templatePath, 'utf-8');
  return hbs.compile(template)(data);
}