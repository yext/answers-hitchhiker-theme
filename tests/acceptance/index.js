const createTestCafe = require('testcafe');
const { PORT } = require('./constants');
const yargs = require('yargs');

const argv = yargs
  .options({
    'browsers': {
      description: 'The browsers to run the tests on',
      alias: 'b',
      type: 'array',
      default: 'chrome'
    },
    'concurrency': {
      description: 'Number of instances of each browser type',
      alias: 'c',
      type: 'number',
      default: 1
    }
  })
  .help()
  .alias('help', 'h')
  .parse();

runTests(argv.browsers, argv.concurrency);

/**
 * Run the acceptance tests
 * 
 * @param {string[]} browsers The browsers to run the tests on
 * @param {number} concurrency Number of instances of each browser type
 */
async function runTests (browsers, concurrency) {
  const testcafe = await createTestCafe({
    configFile: './testcafe.json'
  });
  try {
    const numberTestsFailed = await testcafe.createLiveModeRunner()
      .src('tests/acceptance/suites/*.js')
      .filter(t => t.includes('Pagination works'))
      .browsers()
      .concurrency(1)
      .startApp(`npx serve -l tcp://0.0.0.0:${PORT} test-site/public`, 4000)
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