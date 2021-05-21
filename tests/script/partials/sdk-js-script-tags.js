const hbs = require('../../test-utils/hbs');

const defaultOutput = `<script
  src="https://assets.sitescdn.net/answers/v1.8/answers-modern.min.js"
  type="module"
></script>
<script
  src="https://assets.sitescdn.net/answers/v1.8/answers.min.js"
  nomodule
  defer
></script>`;

const jaOutput = `<script
  src="https://assets.sitescdn.net/answers/v1.8/ja-answers-modern.min.js"
  type="module"
></script>
<script
  src="https://assets.sitescdn.net/answers/v1.8/ja-answers.min.js"
  nomodule
  defer
></script>`;

it('creates correct tags when no locale specified', () => {
  const partialUsage = '{{> script/partials/sdk-js-script-tags sdkVersion=1.8}}'
  expect(hbs.compile(partialUsage)()).toEqual(defaultOutput);
});

it('creates correct tags for en', () => {
  const partialUsage = `{{> script/partials/sdk-js-script-tags
    sdkVersion=1.8
    locale="en"
  }}`
  expect(hbs.compile(partialUsage)()).toEqual(defaultOutput);
});

it('creates correct tags for ja', () => {
  const partialUsage = `{{> script/partials/sdk-js-script-tags
    sdkVersion=1.8
    locale="ja"
  }}`
  expect(hbs.compile(partialUsage)()).toEqual(jaOutput);
});
