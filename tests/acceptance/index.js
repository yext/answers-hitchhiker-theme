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

const util = require('util');
const exec = util.promisify(require('child_process').exec);

async function serveSite() {
  await exec(`npx serve -l tcp://0.0.0.0:${PORT} test-site/public`);
}

serveSite();
runTests(argv.browsers);

// runSampleTest(argv.browsers);
// console.log('out');
// async function runSampleTest (browsers) {
//   const testcafe = await createTestCafe();
//   try {
//   const runner = testcafe.createRunner();
//   const failedCount = await runner
//     .src('tests/acceptance/suites/vertical-full-page-map.js')
//     .browsers(browsers)
//     .concurrency(2)
//     .run();
//     console.log('Tests failed: ' + failedCount);
//   }
//   finally {
//       console.log('closing..');
//       await testcafe.close();
//       console.log('closed.');
//   }
//   console.log('done');
// }

/**
 * Run the acceptance tests
 * 
 * @param {string[]} browsers The browsers to run the tests on
 */
function runTests (browsers) {
  const tests = [];
  browsers.forEach(browser => tests.push(testCafeInstance(browser)));
  Promise.all(tests).then(() => {console.log("Completed all testcafe acceptance tests.");});
}

async function testCafeInstance(browser) {
  const testcafe = await createTestCafe({
    configFile: './testcafe.json'
  });
  try {
    const numberTestsFailed = await testcafe.createRunner()
      .src('tests/acceptance/suites/*.js')
      .browsers(browser)
      .concurrency(2)
      .run({ quarantineMode: true });
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