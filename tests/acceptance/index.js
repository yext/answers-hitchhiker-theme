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
  .help()
  .alias('help', 'h')
  .parse();

runTests(argv.browsers);

/**
 * Run the acceptance tests
 * 
 * @param {string[]} browsers The browsers to run the tests on
 */
async function runTests (browsers) {
  const testcafe = await createTestCafe({
    hostname: 'localhost',
    port1:    1337,
    port2:    1338
  });
  try {
    const numberTestsFailed = await testcafe.createRunner()
      .src('tests/acceptance/suites/*.js')
      .browsers(browsers)
      .startApp(`npx serve -p ${PORT} test-site/public`, 4000)
      .run({ quarantineMode: true });
    if (numberTestsFailed > 0) {
      process.exit(1);
    }
  } catch (e) {
    console.error(e);
    process.exit(1);
  } finally {
    await testcafe.close();
  }
}