import { PORT } from '../constants';
import SearchBar from '../blocks/searchbar';
import VerticalResults from '../blocks/verticalresults';
import ThemeMap from '../blocks/thememap';

fixture`Vertical Full Page Map`
  .page(`http://localhost:${PORT}/locations_full_page_map`)

test('Can search and get results', async t => {
  await SearchBar.submitQuery('virginia');
  const results = VerticalResults.getResults();
  await t.expect(results.exists).ok();
});

test('Clicking on a pin focuses on a results card', async t => {
  await SearchBar.submitQuery('virginia');
  const focusedCard = VerticalResults.getFocusedCard();
  await t.expect(focusedCard.exists).notOk();
  await ThemeMap.selectMapboxPin();
  await t.expect(focusedCard.exists).ok();
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
