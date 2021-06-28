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
  const testcafe = await createTestCafe();
  try {
    const numberTestsFailed = await testcafe.createRunner()
      .src('tests/acceptance/suites/*.js')
      .setTestSpeed(0.1)
      .browsers(browsers)
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