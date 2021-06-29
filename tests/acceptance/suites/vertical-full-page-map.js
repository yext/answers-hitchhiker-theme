import { PORT } from '../constants';
import SearchBar from '../blocks/searchbar';
import VerticalResults from '../blocks/verticalresults';
import ThemeMap from '../blocks/thememap';
import Pagination from '../blocks/pagination';
import { Selector, t, ClientFunction } from 'testcafe';

fixture`Vertical Full Page Map`
  .page(`http://localhost:${PORT}/locations_full_page_map`)

test('Pagination scrolls the results to the top', async t => {
  await ClientFunction(() => { document.getElementById('status').innerHTML = 'start' })();
  await VerticalResults.scrollToBottom();
  await ClientFunction(() => { document.getElementById('status').innerHTML = 'scrolled to bottom' })();
  const scrollTop = await VerticalResults.getScrollTop();
  console.log(scrollTop)
  await t.expect(scrollTop).notEql(0);
  await ClientFunction(() => { document.getElementById('status').innerHTML = 'about to hit next button' })();
  await Pagination.nextResults();
  await ClientFunction(() => { document.getElementById('status').innerHTML = 'hit next button' })();
  const scrollTopAfterPagination = await VerticalResults.getScrollTop();
  console.log(scrollTopAfterPagination)
  await t.expect(scrollTopAfterPagination).eql(0);
});