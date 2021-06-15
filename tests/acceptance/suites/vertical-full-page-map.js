import { PORT } from '../constants';
import SearchBar from '../blocks/searchbar';
import VerticalResults from '../blocks/verticalresults';
import ThemeMap from '../blocks/thememap';
import Pagination from '../blocks/pagination';

fixture`Vertical Full Page Map`
  .page(`http://localhost:${PORT}/locations_full_page_map`)

test('Can search and get results', async t => {
  await SearchBar.submitQuery('virginia');
  const isResultsPresent = await VerticalResults.isResultsPresent();
  await t.expect(isResultsPresent).ok();
});

test('Clicking on a pin focuses on a results card', async t => {
  await SearchBar.submitQuery('virginia');
  let isCardFocused = await VerticalResults.isCardFocused();
  await t.expect(isCardFocused).notOk();
  await ThemeMap.selectPin();
  isCardFocused = await VerticalResults.isCardFocused();
  await t.expect(isCardFocused).ok();
});

test('Search when map moves works', async t => {
  await SearchBar.submitQuery('virginia');
  const resultsCountBeforeDrag = await VerticalResults.getNumResults();
  await ThemeMap.dragLeft();
  await ThemeMap.dragLeft();
  const resultsCountAfterDrag = await VerticalResults.getNumResults();
  await t.expect(resultsCountBeforeDrag !== resultsCountAfterDrag).ok();
});

test('Search this area button works', async t => {
  await SearchBar.submitQuery('virginia');
  await ThemeMap.toggleSearchThisArea();
  const resultsCountBeforeDrag = await VerticalResults.getNumResults();
  await ThemeMap.dragLeft();
  await ThemeMap.clickSearchThisAreaButton();
  const resultsCountAfterDrag = await VerticalResults.getNumResults();
  await t.expect(resultsCountBeforeDrag !== resultsCountAfterDrag).ok();
});

test('Default initial search works and is enabled by default', async t => {
  const resultsCount = await VerticalResults.getNumResults();
  await t.expect(resultsCount).ok();
});

test('Pagination works', async t => {
  const initialResultsOffset = await VerticalResults.getResultsOffset();
  await Pagination.nextResults();
  const updatedResultsOffset = await VerticalResults.getResultsOffset();
  await t.expect(initialResultsOffset).notEql(updatedResultsOffset);
});

test('Pagination scrolls the results to the top', async t => {
  await VerticalResults.scrollToBottom();
  const scrollTop = await VerticalResults.getScrollTop();
  await t.expect(scrollTop).notEql(0);
  await Pagination.nextResults();
  const scrollTopAfterPagination = await VerticalResults.getScrollTop();
  await t.expect(scrollTopAfterPagination).eql(0);
});