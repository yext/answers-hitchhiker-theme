const fs = require('fs');
const { execSync } = require('child_process');

describe('generate-translation script works as expected', () => {
  const outputPath = './tests/static/js/generate-translation-output';
  const translationPath = './tests/static/fixtures';

  it('append exports field to input file', () => {
    fs.mkdirSync(`${outputPath}/static/js/hours/table`, { recursive: true });
    execSync(`node ./static/js/generate-translation.js ${translationPath} ${outputPath}`);
    const openStatusOutput = fs.readFileSync(`${outputPath}/static/js/open-status-i18n.js`).toString();
    const expectedOpenStatusOutput = fs.readFileSync(`${translationPath}/translations/open-status-i18n.js`).toString();
    expect(openStatusOutput).toEqual(expectedOpenStatusOutput);
    const tableHeaderOutput = fs.readFileSync(`${outputPath}/static/js/hours/table/table-strings-i18n.js`).toString();
    const expectedTableheaderOutput = fs.readFileSync(`${translationPath}/translations/table-strings-i18n.js`).toString();
    expect(tableHeaderOutput).toEqual(expectedTableheaderOutput);
    fs.rmdirSync(outputPath, { recursive: true });
  });
});
