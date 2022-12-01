import { PORT } from '../constants';
import SearchBar from '../blocks/searchbar';
import VerticalResults from '../blocks/verticalresults';
import ThemeMap from '../blocks/thememap';
import Pagination from '../blocks/pagination';
import SearchRequestLogger from '../searchrequestlogger';
import CollapsibleFilters from '../blocks/collapsiblefilters'; 

const verticalSearchLogger = SearchRequestLogger.createVerticalSearchLogger();

fixture`Vertical Full Page Map`
  .page(`http://localhost:${PORT}/locations_full_page_map`)
  .requestHooks(verticalSearchLogger)
  .beforeEach(async t => {
    await t.resizeWindow(1600, 900);
  })

test('Can search and get results', async t => {
  await SearchBar.submitQuery('virginia');
  await SearchRequestLogger.waitOnSearchComplete(t);
  const isResultsPresent = await VerticalResults.isResultsPresent();
  await t.expect(isResultsPresent).ok();
});

test('Clicking on a pin focuses on a results card', async t => {
  await SearchBar.submitQuery('virginia');
  await SearchRequestLogger.waitOnSearchComplete(t);
  let isCardFocused = await VerticalResults.isCardFocused();
  await t.expect(isCardFocused).notOk();
  await ThemeMap.selectPin();
  isCardFocused = await VerticalResults.isCardFocused();
  await t.expect(isCardFocused).ok();
});

test('Search when map moves works', async t => {
  await SearchBar.submitQuery('virginia');
  await SearchRequestLogger.waitOnSearchComplete(t);
  await ThemeMap.dragLeft();
  await ThemeMap.dragLeft();
  const isSearchFired = await SearchRequestLogger.waitOnSearchComplete(t);
  await t.expect(isSearchFired).ok();
});

test('Search this area button works', async t => {
  await SearchBar.submitQuery('virginia');
  await ThemeMap.toggleSearchThisArea();
  await SearchRequestLogger.waitOnSearchComplete(t);
  await ThemeMap.dragLeft();
  await ThemeMap.clickSearchThisAreaButton();
  const isSearchFired = await SearchRequestLogger.waitOnSearchComplete(t);
  await t.expect(isSearchFired).ok();
});

test('Default initial search works and is enabled by default', async t => {
  await SearchRequestLogger.waitOnSearchComplete(t);
  const resultsCount = await VerticalResults.getNumResults();
  await t.expect(resultsCount).ok();
});

test('Pagination works', async t => {
  const initialResultsOffset = await VerticalResults.getResultsOffset();
  await Pagination.nextResults();
  await SearchRequestLogger.waitOnSearchComplete(t);
  const updatedResultsOffset = await VerticalResults.getResultsOffset();
  await t.expect(initialResultsOffset).notEql(updatedResultsOffset);
});

test('Pagination scrolls the results to the top', async t => {
  await SearchRequestLogger.waitOnSearchComplete(t);
  await VerticalResults.scrollToBottom();
  const scrollTop = await VerticalResults.getScrollTop();
  await t.expect(scrollTop).notEql(0);
  await Pagination.nextResults();
  await SearchRequestLogger.waitOnSearchComplete(t);
  const scrollTopAfterPagination = await VerticalResults.getScrollTop();
  await t.expect(scrollTopAfterPagination).eql(0);
});

fixture`Vertical Full Page Map with Filters`
  .page(`http://localhost:${PORT}/locations_full_page_map_with_filters`)
  .requestHooks(verticalSearchLogger)
  .beforeEach(async t => {
    await t.resizeWindow(1600, 900);
  })

test('Clicking on a pin closes the filter view', async t => {
  await SearchBar.submitQuery('virginia');
  await SearchRequestLogger.waitOnSearchComplete(t);
  await CollapsibleFilters.viewFilters();
  await ThemeMap.selectPin();
  const isFilterViewOpen = await CollapsibleFilters.isFilterViewOpen();
  await t.expect(isFilterViewOpen).notOk();
});

test('Clicking on a cluster causes the map to zoom in', async t => {
  await SearchBar.submitQuery('virginia');
  await SearchRequestLogger.waitOnSearchComplete(t);
  const zoom = await ThemeMap.getZoom();
  await ThemeMap.selectPinCluster();
  const zoomAfterSelectingCluster = await ThemeMap.getZoom();
  await t.expect(zoom).lt(zoomAfterSelectingCluster);
});

test('Clicking on a cluster causes a new search to be ran', async t => {
  await SearchBar.submitQuery('virginia');
  await SearchRequestLogger.waitOnSearchComplete(t);
  const numResults = await VerticalResults.getNumResults();
  await ThemeMap.selectPinCluster();
  const numResultsAfterSelectingCluster = await VerticalResults.getNumResults();
  await t.expect(numResults).notEql(numResultsAfterSelectingCluster);
});