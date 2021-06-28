const createTestCafe = require('testcafe');
const { PORT } = require('./constants');
const yargs = require('yargs');

const argv = yargs
  .option('browsers', {
    description: 'The browsers to run the tests on',
    alias: 'b',
    type: 'array',
    default: 'chrome'
  })
  .option('live', {
    description: 'Run the tests in live mode',
    alias: 'L'
  })
  .boolean('live')
  .help()
  .alias('help', 'h')
  .parse();

runTests(argv.browsers, argv.live);

/**
 * Run the acceptance tests
 * 
 * @param {string[]} browsers The browsers to run the tests on
 * @param {boolean} useLiveMode whether to use a live mode runner
 */
async function runTests (browsers, useLiveMode) {
  const testcafe = await createTestCafe({
    configFile: './testcafe.json'
  });
  try {
    const runner = useLiveMode ? await testcafe.createLiveModeRunner() : await testcafe.createRunner();
    const numberTestsFailed = await runner
      .src('tests/acceptance/suites/vertical-full-page-map.js')
      .browsers(browsers)
      .filter((testName) => {
        return testName === 'Pagination scrolls the results to the top'
      })
      .startApp(`npx serve -p ${PORT} test-site/public`, 4000)
      .run();
    if (numberTestsFailed > 0) {
      await testcafe.close();
      process.exit(1);
    }
  } catch (e) {
    console.error(e);
    await testcafe.close();
    process.exit(1);
  } finally {
    await testcafe.close();
  }
}