import { PORT } from '../constants';
import SearchBar from '../blocks/searchbar';
import VerticalResults from '../blocks/verticalresults';
import ThemeMap from '../blocks/thememap';
import CollapsibleFilters from '../blocks/collapsiblefilters';
import SearchRequestLogger from '../searchrequestlogger';

fixture`Vertical Full Page Map with Filters and Clusters`
  .page(`http://localhost:${PORT}/locations_full_page_map_with_filters`)
  .beforeEach(async t => {
    await SearchRequestLogger.registerVerticalSearchLogger(t);
  });

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