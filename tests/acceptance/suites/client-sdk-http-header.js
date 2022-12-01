import { PORT } from '../constants';
import { SearchRequestLogger } from '../searchrequestlogger';
import packageJson from '../../../package.json';

const verticalSearchLogger = (new SearchRequestLogger()).createVerticalSearchLogger();
const verticalAutocompleteLogger = (new SearchRequestLogger()).createVerticalAutocompleteLogger();

fixture`Client-SDK header works on vertical searches/autocomplete`
  .page(`http://localhost:${PORT}/people`)
  .requestHooks(verticalSearchLogger, verticalAutocompleteLogger)
  .beforeEach(async t => {
    await t.resizeWindow(1600, 900);
  })

test('the Client-SDK header is sent correctly on vertical search/autocomplete requests', async t => {
  await t.expect(verticalAutocompleteLogger.requests.length).eql(1);
  await t.expect(verticalSearchLogger.requests.length).eql(1);
  await t
    .expect(verticalAutocompleteLogger.requests[0].request.headers['client-sdk'])
    .contains(`ANSWERS_THEME=${packageJson.version}`);
  await t
    .expect(verticalSearchLogger.requests[0].request.headers['client-sdk'])
    .contains(`ANSWERS_THEME=${packageJson.version}`);
});

const universalSearchLogger = (new SearchRequestLogger()).createUniversalSearchLogger();
const universalAutocompleteLogger = (new SearchRequestLogger()).createUniversalAutocompleteLogger();

fixture`Client-SDK header works on universal searches/autocomplete`
  .page(`http://localhost:${PORT}`)
  .requestHooks(universalSearchLogger, universalAutocompleteLogger)
  .beforeEach(async t => {
    await t.resizeWindow(1600, 900);
  })

test('the Client-SDK header is sent correctly on universal search/autocomplete requests', async t => {
  await t.expect(universalSearchLogger.requests.length).eql(1);
  await t.expect(universalAutocompleteLogger.requests.length).eql(1);
  await t
    .expect(universalAutocompleteLogger.requests[0].request.headers['client-sdk'])
    .contains(`ANSWERS_THEME=${packageJson.version}`);
  await t
    .expect(universalSearchLogger.requests[0].request.headers['client-sdk'])
    .contains(`ANSWERS_THEME=${packageJson.version}`);
});